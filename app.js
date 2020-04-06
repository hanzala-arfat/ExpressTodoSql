const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const todoRoutes = require("./Routes/routes");
const db = require("./Db//db");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", todoRoutes);

app.listen(3000);
console.log(" SQL Server sarter at  3000... ");
