const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);
const csurf = require('csurf');

const MONGO_DB_URI =
  "mongodb+srv://vishal:<password>@cluster0-mabcy.mongodb.net/shop?retryWrites=true&w=majority";
const User = require("./models/user");

const db = mongoose.connect(MONGO_DB_URI);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const ErrorCtrl = require("./controllers/errors");

const app = express();
const store = new mongodbStore({
  uri: MONGO_DB_URI,
  collection: "sessions"
});
//middleware for csrf token
const csurfProtection = csurf();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use(csurfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(ErrorCtrl.get404ErrorPage);

db.then(result => {
  app.listen(3000);
  console.log("Server Connected and is Running on port 3000 !!");
});
