function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    next();
  }
  else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/");
  }
}
