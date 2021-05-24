require("dotenv").config();
const express = require("express"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  redis = require("redis"),
  routes = require("./app/routes"),
  compression = require("compression"),
  helmet = require("helmet"),
  cors = require("cors"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  rfs = require("rotating-file-stream"),
  swaggerUi = require("swagger-ui-express"),
  app = express(),
  promBundle = require("express-prom-bundle"),
  metricsMiddleware = promBundle({
    includeMethod: true,
  });
  const redisClient = require('./redis-client');

const winston = require("winston");
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "log/error.log",
      level: "error",
    }),
  ],
});

app.use(metricsMiddleware);

expressSwagger = require("express-swagger-generator")(app);

app.use(cors());
app.use(helmet());
app.use(compression());
// morgan config
let logDirectory = path.join(__dirname, "log");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
let accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory,
});
app.use(
  morgan("combined", {
    stream: accessLogStream,
  })
);

mongoose.set("useCreateIndex", true);
mongoose
  .connect(process.env.MONGO_STRING, {
    poolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.error(err));

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(methodOverride("X-HTTP-Method-Override"));

let options = {
  swaggerDefinition: {
    info: {
      description: "This is a sample server",
      title: "Swagger",
      version: "1.0.0",
    },
    host: process.env.SWAGGER_HOST,
    basePath: "/",
    produces: ["application/json"],
    schemes: ["http", "https"],
    securityDefinitions: {
      Bearer: {
        description:
          "Example value:- Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MmQwMGJhNTJjYjJjM",
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
    defaultSecurity: "Bearer",
  },
  basedir: __dirname, //translation absolute path
  files: ["./app/routes.js"], //Path to the API handle folder
};
expressSwagger(options);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(options));

app.use("/api", routes);

app.listen(process.env.PORT || 3100);

exports = module.exports = app;
