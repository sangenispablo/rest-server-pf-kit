const express = require("express");
const { check, body } = require("express-validator");

// modelo User
const User = require("../models/user");
// controladores para auth
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

// proceso el formulario de login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Por favor ingresa un email válido.")
      .normalizeEmail(),
    body("password", "El password es inválido.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

// comenzamos validando este post que son los EndPoint que tenemos que validar
// registro de un nuevo usuario
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Por favor ingresa un email válido.")
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address if forbidden.');
        // }
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "El email ya existe, por favor usa otro."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "La contraseña debe tener numeros y letras con un minimo de 5 caracteres."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Las constraseñas no coinciden.");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
