import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import configRoutes from "./routes/index.js";
import * as groupData from "./data/groups.js";
import * as groupEventsData from "./data/groupEvents.js";

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

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

// let myGroup = await groupEventsData.remove("643377afcc8ba623da17ab3c");
// console.log(myGroup);

// let myNewGroup = await groupData.create(
//   "MASTER GROUP",
//   "The coolest group ever!"
// );
// let myGroups = await groupData.getAll();

// let myDescription = "This is an updated description of the grgoup!";
// // await groupData.updateDescription("6432f0a1cffb096de591aa55", myDescription);

let myNewGroupEvent = await groupEventsData.create(
  "64348d1b2f4dd57a63bba048",
  "NEW EVENT?"
);

// let updatedTitle = await groupEventsData.addUser(
//   "64335155c88aeab21d99b251",
//   "64335cbb7885a7c8b6e327b4",
//   "64250150f2b4c8421ef908c7"
// );

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
