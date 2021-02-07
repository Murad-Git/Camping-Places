const express         = require("express"),
router          = express.Router(),
campground      = require("../models/campground"),
middleware      = require("../middleware"),
multer          = require("multer"),
cloudinary      = require("cloudinary");



// eslint-disable-next-line no-undef
storage         = multer.diskStorage({
    filename:(req,file,callback)=>{
        callback(null, Date.now + file.originalname);
    }
});

// Images uploading config (multer)
const imageFilter = (req, file, cb) =>{
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
        req.flash("error", 'Only image files are allowed!')
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// uploading with storage and filter config
// eslint-disable-next-line no-undef
const upload = multer({ storage: storage, fileFilter: imageFilter});

// access to cloudinary
cloudinary.config({ 
  cloud_name: 'dabkx9lym', 
  api_key: "953479419953535", 
  api_secret: "YFaaDuTKtnjih3TDdNb_sgd6fso"
});

// Campgrounds page
// router.get("/", (req,res)=>{
//     let perPage = 8;
//     let pageQuery = parseInt(req.query.page);
//     let pageNumber = pageQuery ? pageQuery : 1;
//     let noMatch = null;
//     if(req.query.search){
//         const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//         // Get all campgrounds from DB
//         campground.find({name:regex}, (err, allCampgrounds)=>{
//             if(err){
//                 req.flash("error", err.message)
//                 console.log(err)
//             }else{
//                 if(allCampgrounds.length <1){
//                     noMatch = "No matched campgrounds please try again.";
//                 }
//                 res.render("campgrounds/index", {campgrounds:allCampgrounds,noMatch:noMatch});
//             }
//         });
//     }else{
//     campground.find({}, (err, allCampgrounds)=>{
//         if(err){
//             req.flash("error", err.message)
//             console.log(err)
//         }else{
//             res.render("campgrounds/index", {campgrounds:allCampgrounds,noMatch:noMatch});
//         }
//     });
//     }
// });
//INDEX - show all campgrounds
router.get("/", function(req, res){
    let perPage = 8;
    let pageQuery = parseInt(req.query.page);
    let pageNumber = pageQuery ? pageQuery : 1;
    let noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec( (err, allCampgrounds) =>{
            campground.countDocuments({name: regex}).exec( (err, count)=> {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(allCampgrounds.length < 1) {
                        noMatch = "No campgrounds match that query, please try again.";
                    }
                    res.render("campgrounds/index", {
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search
                    });
                }
            });
        });
    } else {
        // get all campgrounds from DB
        campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec( (err, allCampgrounds) =>{
            campground.countDocuments().exec( (err, count) =>{
                if (err) {
                    console.log(err);
                } else {
                    res.render("campgrounds/index", {
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: false
                    });
                }
            });
        });
    }
});

// Creating a campground
router.post("/", middleware.isLoggedIn, upload.single("image"), (req,res)=>{
    cloudinary.v2.uploader.upload(req.file.path, (err,result) =>{
        if(err){
            req.flash("error", "Can't upload image, try again later.");
            req.redirect("back");
        }else{
            // add cloudinary url for the image to the campground object under image property
            req.body.campground.image = result.secure_url;
            req.body.campground.imageId = result.public_id;
            // add author to the campground
            req.body.campground.author = {
            id:req.user._id,
            username: req.user.username
        }}
    //get data from form and add campground
    campground.create(req.body.campground, (err, newlyCreated)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("back")
        }else{
            console.log("Succesfully added: ", newlyCreated);
            req.flash("success", "Campground "+ newlyCreated.name+ "succesfully added");
            res.redirect("/campgrounds");
        }});
    });
});

// Creating Form
router.get("/new",middleware.isLoggedIn, (req,res)=>{
    res.render("campgrounds/new");
});

// Show route - more info about one CGs
router.get("/:id", (req,res)=>{
    campground.findById(req.params.id).populate("comments likes").exec((err, foundCamp)=>{
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }else{
            res.render("campgrounds/show", {campgrounds:foundCamp});
        }
    });
});

// Edit CampGrounds Route
router.get("/:id/edit",middleware.checkCampgroundOwner, (req,res)=>{
    // is user logged in
    campground.findById(req.params.id, (err,foundCamp)=>{
        res.render("campgrounds/edit", {campground:foundCamp});
})});

// Update route
router.put("/:id", upload.single('image'), (req, res)=>{
    // find and update the correct campground
    campground.findById(req.params.id, async (err, campground)=>{
        if(err){
            console.log(err)
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(campground.imageId);
                  let result = await cloudinary.v2.uploader.upload(req.file.path);
                  campground.image = result.secure_url;
                  campground.imageId = result.public_id;
              } catch(err) {
                  console.log(err)
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            campground.name = req.body.name;
            campground.price = req.body.price;
            campground.description = req.body.description;
            campground.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
});
// 
// Delete campground Route
router.delete('/:id',middleware.checkCampgroundOwner, (req, res) =>{
    campground.findById(req.params.id, async (err, campground) =>{
      if(err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      try {
          await cloudinary.v2.uploader.destroy(campground.imageId);
          campground.remove();
          console.log("Deleted: ", campground);
          req.flash('success', 'Campground successfully deleted!');
          res.redirect('/campgrounds');
      } catch(err) {
          if(err) {
            req.flash("error", err.message);
            return res.redirect("back");
          }
      }
    });
  });

//   Like routes

router.post("/:id/like", middleware.isLoggedIn, (req,res)=>{
    campground.findById(req.params.id, (err,foundCamp)=>{
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
            // Check if req.user._id exists in foundCamp.likes
            let foundUserLike = foundCamp.likes.some( like =>{
                return like.equals(req.user._id);
            });
            if (foundUserLike){
                // user already liked, removing like
                foundCamp.likes.pull(req.user._id);
            }else{
                // adding new user's like
                foundCamp.likes.push(req.user);
            }
            foundCamp.save( err =>{
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                return res.redirect("/campgrounds/" + foundCamp._id)
            });
    });
});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
module.exports = router;