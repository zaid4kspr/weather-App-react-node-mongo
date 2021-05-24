const express = require("express"),
  mongoose = require("mongoose"),
  Admin = require("../models/Admin"),
  City = require("../models/City"),
  router = express.Router(),
  messages = require("../helpers/messages"),
  hat = require("hat"),
  axios = require("axios"),
  adminAuth = require("../middlewares/JWT").adminAuth;
const redisClient = require("./../../redis-client");
const geoip = require("geoip-lite");
const adminPassport = require("../passports/admin");
const mailer = require("../helpers/mailer");

const transporter = mailer.create();

const config = require("../config/mailConfig");

const winston = require("winston");
const logger = winston.createLogger({
  level: "error",
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({
      filename: "log/error.log",
      level: "error",
    }),
  ],
});

// **weather things
// this weather api offers only 50 api call/day so I am not using it any more
async function getCityInfo(ip) {
  let r = await axios.get(
    process.env.WEATHER_API_URL +
      "/locations/v1/cities/ipaddress" +
      "?apikey=" +
      process.env.WEATHER_API_KEY +
      "&language=en-us&q=" +
      ip
  );
  return r.data;
}

async function getCurrentWeather(key) {
  let r = await axios.get(
    process.env.WEATHER_API_URL +
      "/currentconditions/v1/" +
      key +
      "?apikey=" +
      process.env.WEATHER_API_KEY +
      "&language=en-us"
  );
  r.data["createdAt"] = new Date();

  return r.data;
}
async function getAllRegions() {
  let r = await axios.get(
    process.env.WEATHER_API_URL +
      "/locations/v1/regions" +
      "?apikey=" +
      process.env.WEATHER_API_KEY +
      "&language=en-us"
  );
  return r.data;
}
async function getweatherByCityId(cityId) {
  let r = await axios.get(
    process.env.WEATHER_API_2_URL +
      "/data/2.5/weather?id=" +
      cityId +
      "&appid=" +
      process.env.WEATHER_API_2_KEY +
      "&units=metric"
  );
  r.data["createdAt"] = new Date();
  return r.data;
}
function regionDataExpired(regionData) {
  let now = new Date();
  let hourago = new Date(now.getTime() - 1000 * 60 * 60);
  regionData.createdAt = new Date(regionData.createdAt);

  return new Date(regionData.createdAt) < hourago;
}
async function weatherByLatLOng(dataExtractedFromIp) {
  let lat = dataExtractedFromIp.ll[0];
  let lon = dataExtractedFromIp.ll[1];
  let r = await axios.get(
    process.env.WEATHER_API_2_URL +
      "/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      process.env.WEATHER_API_2_KEY +
      "&units=metric"
  );
  r.data["createdAt"] = new Date();
  return r.data;
}
async function forecast(dataExtractedFromIp) {
  let lat = dataExtractedFromIp.ll[0];
  let lon = dataExtractedFromIp.ll[1];
  let r = await axios.get(
    process.env.WEATHER_API_2_URL +
      "/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      process.env.WEATHER_API_2_KEY +
      "&exclude=hourly,minutely" +
      "&units=metric"
  );
  return r.data;
}
router.get("/weather/city/:ip?", adminAuth, async (req, res) => {
  try {
    const { ip } = req.params;
    if (!ip) throw "missing ip address";
    let geo = geoip.lookup(ip);
    let city = await weatherByLatLOng(geo);

    // also enabling caching for cities coming from user ip so maybe another user add this city to his watch list
    await redisClient.setAsync(city.id, JSON.stringify(city));

    res.status(200).json(city);
  } catch (reason) {
    console.log(reason);
    logger.error("=====================================");
    logger.error(reason);
    logger.error(JSON.stringify(req.body));
    logger.error(req.url);
    logger.error("=====================================");

    res.status(400).json({
      error: reason,
      message: messages.contact,
    });
  }
});
router.get("/weather/forecast/:ip?", adminAuth, async (req, res) => {
  try {
    const { ip } = req.params;
    if (!ip) throw "missing  sssip";
    let geo = geoip.lookup(ip);
    let r = await forecast(geo);

    res.status(200).json(r);
  } catch (reason) {
    console.log(reason);
    logger.error("=====================================");
    logger.error(reason);
    logger.error(JSON.stringify(req.body));
    logger.error(req.url);
    logger.error("=====================================");

    res.status(400).json({
      error: reason,
      message: messages.contact,
    });
  }
});

router.get("/weather/cityId/:cityId", async (req, res) => {
  try {
    const { cityId } = req.params;
    if (!cityId) throw "missing cityId";

    let r = await getweatherByCityId(cityId);

    res.status(200).json(r);
  } catch (reason) {
    console.log(reason);
    logger.error("=====================================");
    logger.error(reason);
    logger.error(JSON.stringify(req.body));
    logger.error(req.url);
    logger.error("=====================================");

    res.status(400).json({
      error: reason,
      message: messages.contact,
    });
  }
});
router.get("/weather/myWatchList", adminAuth, async (req, res) => {
  try {
    let admin = await Admin.findOne({ _id: req.payload.usr._id });
    let r = [];
    let myWatchList = [];
    let regions = [];
    if (!admin) throw "missing cityId";
    // in a real case scenario I would probably store regions in separate model
    regions = admin.regions;

    if (regions) {
      for (let i = 0; i < regions.length; i++) {
        // first step will be searching for cache
        let regionsData = await redisClient.getAsync(regions[i]);
        //parsing data if data exists
        regionsData ? (regionsData = JSON.parse(regionsData)) : "";
        // if data doesn't exist fetch data from external api and save it in cache
        if (!regionsData || regionDataExpired(regionsData)) {
          console.log("not Cached");
          //getting data
          let regionsData = await getweatherByCityId(regions[i]);
          // saving it to cache so we can use it later
          await redisClient.setAsync(regions[i], JSON.stringify(regionsData));
          // push the data in the result array
          myWatchList.push(regionsData);
        } else {
          console.log("got it from redis cache");
          // push the data in the result array
          myWatchList.push(regionsData);
        }
      }
    }

    res.status(200).json(myWatchList);
  } catch (reason) {
    console.log(reason);
    logger.error("=====================================");
    logger.error(reason);
    logger.error(JSON.stringify(req.body));
    logger.error(req.url);
    logger.error("=====================================");

    res.status(400).json({
      error: reason,
      message: messages.contact,
    });
  }
});
router.post("/weather/myWatchList/add", adminAuth, async (req, res) => {
  try {
    let regionId = req.body.regionId;
    if (!regionId) throw "missing region id";

    let admin = await Admin.findOne({ _id: req.payload.usr._id });
    admin.regions.push(regionId);
    await admin.save();
    res.status(200).json({
      message: messages.success_update,
    });
  } catch (reason) {
    console.log(reason);
    logger.error("=====================================");
    logger.error(reason);
    logger.error(JSON.stringify(req.body));
    logger.error(req.url);
    logger.error("=====================================");

    res.status(400).json({
      error: reason,
      message: messages.contact,
    });
  }
});
router.post("/weather/myWatchList/share", adminAuth, async (req, res) => {
  try {
    let { data, email } = req.body;
    let user = req.payload.usr;
    if (!data || !email) throw "missing info";
    data["user"] = user;
    data["sentTo"] = { email: email };
    let mailOptions = mailer.mailOptions(data, "shareWeather");

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: messages.success_update,
    });
  } catch (reason) {
    console.log(reason);
    logger.error("=====================================");
    logger.error(reason);
    logger.error(JSON.stringify(req.body));
    logger.error(req.url);
    logger.error("=====================================");

    res.status(400).json({
      error: reason,
      message: messages.contact,
    });
  }
});

router.get("/weather/cities/:keyword", async (req, res) => {
  try {
    let { keyword } = req.params;

    if (!keyword) throw "missing keyword";

    let r = await City.find({
      name: {
        $regex: ".*" + keyword + ".*",
        $options: "i",
      },
    })
      .skip(0)
      .limit(10)
      .lean();

    res.status(200).json(r);

  } catch (reason) {
    console.log(reason);
    logger.error("=====================================");
    logger.error(reason);
    logger.error(JSON.stringify(req.body));
    logger.error(req.url);
    logger.error("=====================================");

    res.status(400).json({
      error: reason,
      message: messages.contact,
    });
  }
});

// **weather things end.

module.exports = router;
