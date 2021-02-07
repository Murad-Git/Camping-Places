const express   = require("express"),
router          = express.Router(),
passport        = require("passport"),
User            = require("../models/user"),
Campground      = require("../models/campground"),
middleware      = require("../middleware/index");

// Home page
router.get("/", (req,res)=>{
    res.render("landing");
});

// Register form Page
router.get("/register",(req,res)=>{
    res.render("register", {page:'register'});
});

// Handle sign up logic
router.post("/register", (req,res)=>{
    let newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: req.body.avatar,
        desc: req.body.desc
    });
    User.register(newUser, req.body.password, (err,user)=>{
        if(err){
            req.flash("error", err.message);
            res.redirect("/register")
        }else{
            passport.authenticate("local")(req,res, ()=>{
                req.flash("success", "Welcome to Yelp Camp " + user.username);
                res.redirect("/campgrounds");
                console.log("New User: ", user.username)
            });
        }
    });
});

// Logging In form Page
router.get("/login", (req,res)=>{
    res.render("login", {page:'login'});
});

// ("/login", middleware, callback)
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }
    ),(req,res,err)=>{
        if(err){
            req.flash("error", err.message);
        }
    });

// Log Out route
router.get("/logout", (req,res)=>{
    req.logOut();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds");
});

// User Profile
router.get("/users/:id", (req,res)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(err){
            req.flash("error", "There is no such user");
            return res.render("back")
        }else{
            Campground.find().where("author.id").equals(foundUser._id).exec((err,campgrounds)=>{
                if(err){
                    req.flash("error", "There is no such user");
                    return res.render("back");
                }else{
                    res.render("users/show", {user:foundUser, campgrounds:campgrounds});
                }
            })
        }
    });
});

// Changing users profile
// Edit route
router.get("/users/:id/edit",middleware.isLoggedIn, (req,res)=>{
    User.findById(req.params.id, (err,foundUser)=>{
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }else{
            res.render("users/edit", {user:foundUser});
        }
    });
})

// Update route
router.put("/users/:id",middleware.isLoggedIn, (req,res)=>{
    User.findByIdAndUpdate(req.params.id, req.body.user, err =>{
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }else{
            req.flash("success", "Your page has been updated");
            res.redirect("/users/" +req.params.id);
        }
    });
});


module.exports = router;