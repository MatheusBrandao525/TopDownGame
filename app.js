var express    = require('express'),
    app        = express(),
    bodyParser = require("body-parser");


    app.use(express.static(__dirname + "/public")); // set default folder to /public

    app.use(bodyParser.urlencoded({extended: true})); //body parser for form data
    app.set("view engine", "ejs");                  //  Using EJS templates
  //  app.use(methodOverride("_method"));
  //  app.use(flash());


  app.get("/", function (req, res) {
      res.render("index");
  });

  app.listen("80", function () {
     console.log("The Server has Started!!");

  });
