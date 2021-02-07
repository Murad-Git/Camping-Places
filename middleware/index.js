const middlewareObj = {},
  campground = require("../models/campground"),
  comment = require("../models/comment"),
  user = require("../models/user.js");

middlewareObj.checkCampgroundOwner = function (req, res, next) {
  if (req.isAuthenticated()) {
    campground.findById(req.params.id, (err, foundCamp) => {
      if (err) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        // does user own the campground?
        if (foundCamp.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwner = function (req, res, next) {
  if (req.isAuthenticated()) {
    comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        res.redirect("back");
      } else {
        // does user own the comment?
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("/login");
  }
};
middlewareObj.checkUserOwner = {
  function(req, res, next) {
    if (req.isAuthenticated()) {
      user.findById(req.params.id, (err, foundUser) => {
        if (err) {
          req.flash("error", err.message);
          res.redirect("back");
        } else {
          // does user own the profile
          if (foundUser.id.equals(req.body.user)) {
            next();
          } else {
            req.flash("error", "You don't have permission");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in");
      res.redirect("back");
    }
  },
};

module.exports = middlewareObj;
