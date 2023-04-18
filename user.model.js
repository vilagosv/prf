const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    accessLevel: { type: String },
  },
  { collection: "users" }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    if (!user.accessLevel) user.accessLevel = "basic";
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        console.log("Error when generating Salt");
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          console.log("Error when hashing passsword");
          return next(err);
        }
        user.password = hash;
        return next();
      });
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePasswords = function (password, nx) {
  bcrypt.compare(password, this.password, function (error, isMatch) {
    nx(error, isMatch);
  });
};

mongoose.model("user", userSchema);
