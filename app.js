/* eslint-disable no-unused-vars */
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methorOverride = require("method-override"),
  User = require("./models/user"),
  seedDB = require("./views/seeds");

// Requiring routes
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");
const url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";

// Deleting All Camps
// seedDB();

// Page's main Configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// eslint-disable-next-line no-undef
app.use(express.static(__dirname + "/public"));
app.use(methorOverride("_method"));
app.use(flash());

// DBs configure
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB connected!"))
  .catch((err) => {
    console.log("DB connection Error:", err.message);
  });

mongoose.set("useFindAndModify", false);

// Moment JS
app.locals.moment = require("moment");

//Passport Configuration
app.use(
  require("express-session")({
    secret: "Welcome to my secret page",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// checking user's logIn in Navbar
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Using Routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Listening Route
app.listen(process.env.PORT || 3000, () => {
  console.log("starting YelpCamp");
});

// name     url         verb        desc.
//============================================================
// index    /dogs       GET         displays a list of all dog
// new      /dogs/new   GET         displays form to make a new dog
// create   /dogs       POST        add new dog to DB
// show     /dogs/id:   GET         shows info about one dog

// campground.remove({name:"Bob"}, (err, campground)=>{
//     if(err){
//         console.log(err);
//     } else{
//         console.log(campground);
//     }
// })

// campground.create(
//     {
//     name: "Barbados",
//     image: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     description: "Barbaros is a good place to take a rest"
// },(err, campground)=>{
//         if(err){
//             console.log(err);
//         } else{
//             console.log("Newly Created campground");
//             console.log(campground);
//         }
//     }
// );
