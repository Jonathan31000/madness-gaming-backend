require("dotenv").config();
var express = require("express"),
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  logger = require("morgan"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  sessionExpress = require("express-session"),
  mongoose = require("mongoose"),
  rateLimit = require("express-rate-limit"),
  helmet = require("helmet"),
  Account = require("./routes/account/_accountModel"),
  fs = require("fs"),
  path = require("path");

process.env.UPLOAD_PATH = path.resolve(process.env.PWD, "../backend-data");
console.log('PROJECT_PATH: ', process.env.PWD);
console.log('UPLOAD_PATH: ', process.env.UPLOAD_PATH);

var app = express();
if (process.env.DEV === "true") {
  app.use(logger("dev"));
}

passport.use(new LocalStrategy(Account.authenticate())),
  passport.serializeUser(Account.serializeUser()),
  passport.deserializeUser(Account.deserializeUser());
mongoose.connect(process.env.MONGODB_URL, {
  maxPoolSize: 50,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const MongoStore = require("connect-mongo");
app.use(sessionExpress({
  secret: "F)H@McQfTjWnZr4uB?E(H+MbQeShVmYq3t6w9z7x!A%D*G-KaNdRgUkXp2s5v8y/",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL
  }),
  cookie: {
    maxAge: 1000 * 60 * 24 * 365
  }
}));

app.use(helmet());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(express.json());
app.use(
  cookieParser(
    "AZKDOPAZ90 382R9C12120E12 DO ZJFIEGY 21E0R 902 OZAD ODKZAOKDK OAZPDK 210 EDKZAPODK 2798R1209V TOKAZD 0E2 AZODKO ZAKDOZKA PODKZA PDK2190 EKDPOAZK D"
  )
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(process.env.PWD, "public")));

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

function findInDir(dir, filter) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      findInDir(filePath, filter);
    } else if (filter.test(filePath)) {
      let myFile = filePath;
      if (myFile.indexOf("route_") > -1) {
        let file_ = filePath.replace(process.env.PWD + "/routes", "").replace("route_", "").replace(".js", "").replaceAll('\\', '/');
        file_ == "/index" ? file_ = "/" : file_;
        if (myFile.indexOf("/auth/route_login") > -1)
          app.use(file_, rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, message: { error: "too-many-request" } }), require(filePath));
        else
          app.use(file_, require(filePath));
        console.log(file_);
      }
    }
  });
}
console.log('Routes List:')
findInDir(process.env.PWD + "/routes", /\.js$/)

app.get("*", function (req, res) {
  res.status(404).send("welcome");
});

global.sendError = (err, res, status = 400) => {
  if (typeof res === "undefined") throw {
    errorTrace: new Error("res is not defined"),
    targetError: err
  }
  let error = "";
  if (typeof err.rawHeaders !== "undefined") {
    if (err.rawHeaders.indexOf('cors') != -1) {
      error = "Cors error";
    }
  } else error = err
  res.status(status).send({ error });
  throw {
    path: res.req.baseUrl,
    message: err,
    errorTrace: new Error(),
  }
};

global.asyncPromise = promise =>
  promise
    .then(data => ([false, data]))
    .catch(error => {
      console.error(error);
      return Promise.resolve([error, false]);
    });

global.saveSession = async (req, cb) =>{
  return new Promise((resolve, reject) => {
    req.session.save(function (err) {
      if (err) return reject(err);
      return resolve(req.session);
    })
  })
}

module.exports = app;
