require("dotenv").config();
const fs = require("fs");

var config = {
  base_url: process.env.FRONT_HOST,
  transporter: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "priviledger.team@gmail.com",
      pass: "priviledger123",
    },
    dkim: {
      domainName: "",
      keySelector: "",
      //            privateKey: fs.readFileSync("privatekey.pem")
    },
  },
};

module.exports = config;
