const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator/check");

const authCntrl = require("../controllers/auth");
const User = require("../models/user");

router.get("/login", authCntrl.getLogin);

router.post(
  "/login",
  [
    check("userEmail")
      .isEmail()
      .withMessage("Please enter a valid Email")
      .normalizeEmail(),
    body(
      "userPassword",
      "Please enter a valid password with minimum 5 characters and is alphanumeric."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authCntrl.postLogin
);

router.get("/signup", authCntrl.getSignUp);

router.post(
  "/signup",
  [
    check("userEmail")
      .isEmail()
      .withMessage("Please enter a valid Email")
      .custom((val, { req }) => {
        return User.findOne({ email: val }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("User with this email already exists");
          }
          return true;
        });
      })
      .normalizeEmail(),
    body(
      "userPassword",
      "Please eneter a valid password with minimum 5 charaters long and alpahanumeric."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confUserPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.userPassword) {
        throw new Error("Passwords doesn't match.");
      }
      return true;
    })
  ],
  authCntrl.postSignup
);

router.post("/logout", authCntrl.postLogout);

router.get("/resetPassword", authCntrl.getResetPassword);

router.post("/resetPassword", authCntrl.postResetPassword);

router.get("/savePassword/:token", authCntrl.getSavePassword);

router.post("/savePassword", authCntrl.postSavePassword);

module.exports = router;
