const bcrypt = require("bcryptjs");
const crypto = require("crypto");
// var flash = require('express-flash-messages')
// app.use(flash());
const { validationResult } = require("express-validator");

const User = require("../models/user");

//Sending emails with nodemailer
const nodemailer = require("nodemailer");
const sendTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendTransport({
    auth: {
      api_key:
        "<ADD_YOUR_API_KEY>"
    }
  })
);

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    docTitle: "Login Form",
    path: "/login",
    errorMessage: []
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    docTitle: "Login Form",
    path: "/signup",
    errorMessage: []
  });
};

exports.getResetPassword = (req, res, next) => {
  res.render("auth/resetPassword", {
    docTitle: "Reset Password Form",
    path: "/resetPassword"
  });
};

exports.getSavePassword = (req, res, next) => {
  User.findOne({
    resetToken: req.params.token,
    resetTokenExpiration: { $gt: Date.now() }
  })
    .then(user => {
      if (!user) {
        //No User found for Upadting password/token expired/wrong token
        return res.redirect("/login");
      }
      res.render("auth/savePassword", {
        docTitle: "Reset Password Form",
        path: "/savePassword",
        userId: user._id,
        token: req.params.token
      });
    })
    .catch(err => console.log(err));
};

exports.postLogin = (req, res, next) => {
  const email = req.body.userEmail,
    password = req.body.userPassword,
    errors = validationResult(req).array();

  if (errors.length > 0) {
    return res.render("auth/login", {
      docTitle: "Login Form",
      path: "/login",
      errorMessage: errors[0].msg
    });
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        //User does not exists with given email Id
        return res.redirect("/login");
      }
      bcrypt.compare(password, user.password).then(passMatch => {
        if (!passMatch) {
          //password is wrong
          return res.redirect("/login");
        }
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save(err => {
          console.log(err);
          if (!err) res.redirect("/");
        });
      });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.userEmail,
    password = req.body.userPassword,
    confPassword = req.body.confUserPassword,
    errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.render("auth/signup", {
      docTitle: "Login Form",
      path: "/signup",
      errorMessage: errors.array()[0].msg
    });
  }
  bcrypt.hash(password, 12).then(hashedPass => {
    const user = new User({
      email: email,
      password: hashedPass,
      cart: { items: [] }
    });
    user
      .save()
      .then(result => {
        res.redirect("/login");
        return transporter.sendMail({
          to: email,
          from: "shop@node.com",
          subject: "Signed Up Successfully !!",
          html: "<h1>You are successfully signed up.</h1>"
        });
      })
      .then(result => console.log("Mail sent successfully!!"))
      .catch(err => console.log(err));
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect("/resetPassword");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.userEmail })
      .then(user => {
        if (!user) {
          //No User found with give email id
          return res.redirect("/resetPassword");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        transporter
          .sendMail({
            to: req.body.userEmail,
            from: "shop@node.com",
            subject: "Reset Password!!",
            html: `
          <h1>You requested to change your password</h1>
          <p>Please follow the link to reset password </p> 
          - <a href="http:localhost:3000/savePassword/${token}">Click Here</a>
        `
          })
          .then(result => console.log("Mail sent successfully!!"))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  });
};

exports.postSavePassword = (req, res, next) => {
  const newPassword = req.body.userPass;
  const userId = req.body.userId;
  const token = req.body.token;
  console.log(userId + " and " + token);
  let resetUser;
  User.findOne({
    resetTokenExpiration: { $gt: Date.now() },
    resetToken: token,
    _id: userId
  })
    .then(user => {
      console.log(user);
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPass => {
      resetUser.password = hashedPass;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      console.log("Password Saved Successfully");
      res.redirect("/login");
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
