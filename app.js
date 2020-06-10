const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var items = ["item1", "item2"];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));




app.get("/", function(req, res) {
  var today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  var curDay = today.toLocaleDateString("en-US", options);
  res.render("list", {kindOfDay: curDay, newItems: items});
});

app.post("/", function(req, res){
  console.log(req.body.newItem);
  items.push(req.body.newItem);
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server is Running.");
});
