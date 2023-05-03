import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import configRoutes from "./routes/index.js";
import session from "express-session";
import * as groupData from "./data/groups.js";
import * as groupEventsData from "./data/groupEvents.js";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import { groupActivityData, userData } from "./data/index.js";
import * as messageData from "./data/messages.js";
import * as userJobHistoryData from "./data/userJobHistory.js";
import * as groupActivityDataFunctions from "./data/groupActivity.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");

const app = express();

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use(
  session({
    name: "BetterInterviewBook",
    secret: "secret-key",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 3600000 },
  })
);

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Authorizing and authenticating the routes
app.use("/login", (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});

app.use("/signup", (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});

app.use("/company", (req, res, next) => {
  if (!req.session.user) {
    return res.render("Auth/login", {
      error: "You Must Sign In First",
      title: "Login",
    });
  } else {
    if (req.session.user.candidateType === "Company") {
      next();
    } else {
      return res.render("Auth/login", {
        error: "You Do not have Access for this page",
        title: "Login",
      });
    }
  }
});

app.use("/network", (req, res, next) => {
  if (
    !req.session.user ||
    (req.session.user.candidateType !== "Student" &&
      req.session.user.candidateType !== "Company")
  ) {
    return res.redirect("/login");
  }
  next();
});

app.use("/skills", (req, res, next) => {
  if (
    !req.session.user ||
    (req.session.user.candidateType !== "Student" &&
      req.session.user.candidateType !== "Company")
  ) {
    return res.redirect("/login");
  }
  next();
});

app.use("/company/job", (req, res, next) => {
  if (req.session && !req.session.user) {
    return res.render("Auth/login", {
      error: "You Must Sign In First",
      title: "Login",
    });
  } else {
    if (req.session.user.candidateType === "Company") {
      next();
    } else {
      return res.render("error", {
        error:
          "You Do not have Access for this page. Logout and Signup as Company.",
        title: "Error",
      });
    }
  }
});

app.use("/groups", (req, res, next) => {
  if (
    !req.session.user ||
    (req.session.user.candidateType !== "Student" &&
      req.session.user.candidateType !== "Company")
  ) {
    return res.redirect("/login");
  }
  next();
});

app.use("/profile", (req, res, next) => {
  if (
    !req.session.user ||
    (req.session.user.candidateType !== "Student" &&
      req.session.user.candidateType !== "Company")
  ) {
    return res.redirect("/login");
  }
  next();
});

app.use("/logout", (req, res, next) => {
  if (req.session && !req.session.user) {
    return res.redirect("/login");
  } else {
    next();
  }
});

app.use("/", (req, res, next) => {
  let auth = "";
  if (req.session && req.session.user) {
    auth = "Authenticated User";
  } else {
    auth = "Non Authenticated User";
  }
  console.log(
    new Date().toUTCString() +
      ": " +
      req.method +
      " " +
      req.originalUrl +
      " " +
      auth
  );
  return next();
});

let updatedGroup = await groupEventsData.update(
  "64348d1b2f4dd57a63bba048",
  "64348d51a0c96da3a556b5f5",
  { title: "the new title", eventDate: "09/30/2023" }
);
console.log(updatedGroup);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
