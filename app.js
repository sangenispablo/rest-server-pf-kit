const path = require("path");

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const csrfProtection = csrf();
// socket
const socket = require("socket.io");

// el controlador de error
const errorController = require("./controllers/error");
// modelo de Usuario para cargar en el req si esta que ya esta logueado
const User = require("./models/user");
// routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const miSocket = require("./util/sockets");

const PORT = process.env.PORT || 3000;

const SECRET = process.env.SECRET || "c0d3r";

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

// sessions
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const fname = new Date().getTime().toString();
    cb(null, fname + "-" + file.originalname);
  },
});

// filtro de multer
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// engine template "EJS"
app.set("view engine", "ejs");
app.set("views", "views");

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
// proteccion de inputs para evitar la inyeccion de codigo
app.use(csrfProtection);
// manejo de mensajes de error
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// cargo los datos del usuario logueado en el req.user
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// defino las rutas
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

// coneccion a Mongo y levanto el servidor
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log(
      "Connected to MongoDB",
      result.connections[0].host,
      result.connections[0].port
    );
    const server = app.listen(PORT, () => {
      console.log("Server Up:", PORT);
    });
    // Socket setup
    const io = socket(server);
    // separo la logica del websocket fuera del server
    miSocket(io);
  })
  .catch((err) => {
    console.log(err);
  });
