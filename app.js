const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);

const MONGO_DB_URI = "mongodb+srv://vishal:nokian72@cluster0-mabcy.mongodb.net/shop?retryWrites=true&w=majority";
const User = require("./models/user");

const db = mongoose.connect(MONGO_DB_URI);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const ErrorCtrl = require("./controllers/errors");

const app = express();
const store = new mongodbStore({
  uri: MONGO_DB_URI,
  collection: 'sessions'
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "my secret", resave: false, saveUninitialized: false, store: store })
);

app.use((req, res, next) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(ErrorCtrl.get404ErrorPage);

db.then(result => {
  User.findOne().then(fUser => {
    if (!fUser) {
      const user = new User({
        name: "Vishal",
        email: "test@test.com",
        cart: {
          items: []
        }
      });
      user.save();
    }
    app.listen(3000);
    console.log("Server Connected and is Running on port 3000 !!");
  });
});
