exports.get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "¡Pagina no encontrada!",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500 = (req, res, next) => {
  res.status(404).render("500", {
    pageTitle: "¡Pagina de Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};
