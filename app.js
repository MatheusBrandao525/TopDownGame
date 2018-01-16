var express        = require('express'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local'),
    flash          = require('connect-flash'),
    methodOverride = require('method-override'),
    app            = express(),
    Logon          = require('./models/logon'),
    mw             = require('./middleWare'),
    bodyParser     = require("body-parser");

  mongoose.connect("mongodb://localhost/mageDeck");


  app.use(express.static(__dirname + "/public")); // set default folder to /public

  app.use(bodyParser.urlencoded({extended: true})); //body parser for form data
  app.set("view engine", "ejs");                  //  Using EJS templates
  app.use(methodOverride("_method"));
  app.use(flash());

  app.use(require("express-session")({           // Sessions needed for passport integration (later)
    secret: "If you can read this, you shouldn't be here and you know it. . .",// Not you Michael...your cool
    resave: false,
    saveUninitialized: false
  }));

  app.use(function(req, res, next){
     res.locals.currentUser = req.user;
     res.locals.error = req.flash("error");
     res.locals.info = req.flash("info");
     next();
  });

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(Logon.authenticate()));
  passport.serializeUser(Logon.serializeUser());
  passport.deserializeUser(Logon.deserializeUser());

  app.get("/", function (req, res) {
      res.render("index");
  });

  app.listen("80", function () {
     console.log("The Server has Started!!");

  });
