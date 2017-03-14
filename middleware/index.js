var Campground = require("../models/campground");
var Comment = require("../models/comment");
// ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Camground not found");
                res.redirect("back");
            }
            else {
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();  
                }
                else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "Ops, you need to login first!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }
            else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();  
                }
                else {
                    req.flash("error", "Your parents need to give you permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "Bummer, you need to login to do that!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Ops, you need to login first!");
    res.redirect("/login");
}

module.exports = middlewareObj