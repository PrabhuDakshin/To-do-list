const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin:admin123@cluster0-odccj.mongodb.net/toDoListDB?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const itemsSchema = {
  name: String
};

const customSchema = {
  name: String,
  customItems: [itemsSchema]
};

const Other = mongoose.model("Other", customSchema);
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "Buy Milk"
});

const CustomItem = mongoose.model("WorkItem", itemsSchema);


const item2 = new Item({
  name: "Buy Coffee"
});

const allItems = [item1, item2];



app.get("/", function(req, res) {
  Item.find({}, function(err, items) {
    if (err) {
      console.log("ERROR!!");
    } else {
      if (items.length === 0) {
        Item.insertMany(allItems, function(err) {
          if (err) {
            console.log("ERROR!!");
          } else {
            console.log("Successfully Inserted!");
          }
        });
      }
      res.render("list", {
        kindOfDay: "today",
        newItems: items
      });
    }

  });
});

app.post("/", function(req, res) {

  const item = new Item({
    name: req.body.newItem
  });
 const typeOfList = req.body.list;
 console.log(typeOfList);
  if(typeOfList === "today")
  {
    item.save();
    res.redirect("/");

      }
  else{

    Other.findOne({name: typeOfList}, function(err, found){
      if(found){

        found.customItems.push(item);
        found.save();
      }
    });
    res.redirect("/"+ typeOfList);


  }



});

app.get("/:customHeads", function(req, res) {
  const customName = req.params.customHeads;
  Other.findOne({
    name: customName
  }, function(err, foundName) {
    if (!foundName) {
      console.log("Doesn't Exists");
      const items = new Other({
        name: req.params.customHeads,
        customItems: [item1, item2]
      });
      items.save();
      res.redirect("/" + customName);
    }
    else {
      res.render("list", {kindOfDay: foundName.name, newItems: foundName.customItems});

    }
  });

});


app.post("/delete", function(req, res) {
  if (req.body.hidd === "today") {
    Item.findByIdAndRemove(req.body.checked, function(err) {
      if (err) {
        console.log("ERROR!!");
      } else {
        console.log("Successfully Deleted!");
        res.redirect("/");
      }
    });
  } else {
        Other.findOneAndUpdate({name: req.body.hidd}, {$pull: {customItems: {_id: req.body.checked}}}, function(err, found) {
          if (err) {
            console.log("ERROR!!");
          } else {
            console.log("Successfully Deleted!");
            res.redirect("/" + req.body.hidd);
          }
        });

  }
});


app.listen(3000 || process.env.PORT, function() {
  console.log("Server is Running.");
});
