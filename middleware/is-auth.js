// esta funcion lo que hace es verificar si hay un usuario logueado
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};
