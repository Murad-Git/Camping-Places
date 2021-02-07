const express   = require("express"),
router          = express.Router({mergeParams: true}),
campground      = require("../models/campground"),
comment         = require("../models/comment"),
middleware      = require("../middleware");

// Adding a comment
router.get("/new",middleware.isLoggedIn, (req,res)=>{
    campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    });
});

// Post Route - to add a new comment a redirect to particular campground
router.post("/",middleware.isLoggedIn, (req,res)=>{
    campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            comment.create(req.body.comment, (err,comment)=>{
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                    res.redirect("/campgrounds");
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

// Comment's Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwner, (req,res)=>{
    comment.findById(req.params.comment_id, (err,foundComments)=>{
        if(err){
            res.redirect("back")
        }else{
            res.render("comments/edit", {campground_id:req.params.id, comment: foundComments});
        }
    });
});

// Comment's Update Route
router.put("/:comment_id", middleware.checkCommentOwner, (req,res)=>{
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err)=>{
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Comment's Delete Route
router.delete("/:comment_id", middleware.checkCommentOwner, (req,res)=>{
    comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comments deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;