const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const itemModel = mongoose.model("item");
const userModel = mongoose.model("user");

router.route("/login").post((req, res, next) => {
  if (req.body.username && req.body.password) {
    passport.authenticate("local", function (error, user) {
      if (error) return res.status(500).send({ error: error });
      req.logIn(user, function (error) {
        if (error) return res.status(500).send({ error: error });
        return res.status(200).send("Login successfull");
      });
    })(req, res);
  } else {
    return res.status(400).send("Login failed: no username or password");
  }
});

router.route("/logout").post((req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout();
    return res.status(200).send("Logout successfull");
  } else {
    return res.status(200).send("User was not logged in");
  }
});

router.route("/register").post((req, res, next) => {
  if (req.body.username && req.body.email && req.body.password) {
    userModel
      .findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          console.log("user");
          console.log(user);
          return res.status(500).send("username already taken");
        } else {
          const user = new userModel({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
          });
          user
            .save()
            .then(() => {
              return res.status(200).send("DB saved succesfully");
            })
            .catch((e) => {
              console.log("error");
              console.log(e);
              return res.status(500).send("Error while saving DB");
            });
        }
      })
      .catch((e) => {
        console.log("error");
        console.log(e);
        return res.status(500).send("DB error occured");
      });
  } else {
    return res
      .status(400)
      .send(
        `No username or email or password. username:${req.body.password}, password:${req.body.password}, email:${req.body.email}`
      );
  }
});

router
  .route("/user")
  .get((req, res, next) => {
    userModel
      .find({})
      .then((users) => {
        res.status(200).send(users);
      })
      .catch((e) => {
        console.log("error");
        console.log(e);
        return res.status(500).send("DB error occured");
      });
  })
  .post((req, res, next) => {
    if (req.body.username && req.body.email && req.body.password) {
      userModel
        .findOne({ username: req.body.username })
        .then((user) => {
          if (user) {
            console.log("user");
            console.log(user);
            return res.status(500).send("user already exists");
          } else {
            const user = new userModel({
              username: req.body.username,
              email: req.body.email,
              password: req.body.password,
            });
            user
              .save()
              .then(() => {
                return res.status(200).send("DB saved succesfully");
              })
              .catch((e) => {
                console.log("error");
                console.log(e);
                return res.status(500).send("Error while saving DB");
              });
          }
        })
        .catch((e) => {
          console.log("error");
          console.log(e);
          return res.status(500).send("DB error occured");
        });
    } else {
      return res
        .status(400)
        .send(
          `No username or email or password. username:${req.body.password}, password:${req.body.password}, email:${req.body.email}`
        );
    }
  })
  .put((req, res, next) => {
    if (
      req.body.username &&
      (req.body.password || req.body.email || req.body.accessLevel)
    ) {
      userModel
        .findOne({ username: req.body.username })
        .then((user) => {
          if (user) {
            user.password = req.body.password
              ? req.body.password
              : user.password;
            user.email = req.body.email ? req.body.email : user.email;
            user.accessLevel = req.body.accessLevel
              ? req.body.accessLevel
              : user.accessLevel;
            user
              .save()
              .then(() => {
                return res.status(200).send("DB saved succesfully");
              })
              .catch((e) => {
                console.log("error");
                console.log(e);
                return res.status(500).send("Error while saving DB");
              });
          } else {
            return res.status(500).send("Name does not exist");
          }
        })
        .catch((e) => {
          console.log("error");
          console.log(e);
          return res.status(500).send("DB error occured");
        });
    } else {
      return res.status(400).send("No Name or Value");
    }
  })
  .delete((req, res, next) => {
    if (req.body.username) {
      userModel
        .findOne({ username: req.body.username })
        .then((user) => {
          if (user) {
            user
              .deleteOne()
              .then(() => {
                return res
                  .status(200)
                  .send(req.body.username + " deleted succesfully");
              })
              .catch((e) => {
                console.log("error");
                console.log(e);
                return res.status(500).send("Error while deleting");
              });
          } else {
            return res.status(500).send("Name does not exist");
          }
        })
        .catch((e) => {
          console.log("error");
          console.log(e);
          return res.status(500).send("DB error occured");
        });
    } else {
      return res.status(400).send("No Name or Value");
    }
  });

router
  .route("/item")
  .get((req, res, next) => {
    itemModel
      .find({})
      .then((items) => {
        res.status(200).send(items);
      })
      .catch((e) => {
        console.log("error");
        console.log(e);
        return res.status(500).send("DB error occured");
      });
  })
  .post((req, res, next) => {
    if (req.body.name && req.body.value) {
      itemModel
        .findOne({ name: req.body.name })
        .then((item) => {
          if (item) {
            console.log("item");
            console.log(item);
            return res.status(500).send("item already exists");
          } else {
            console.log(req.body);
            const item = new itemModel({
              name: req.body.name,
              value: req.body.value,
              description: req.body.description ? req.body.description : "",
            });
            item
              .save()
              .then(() => {
                return res.status(200).send("DB saved succesfully");
              })
              .catch((e) => {
                console.log("error");
                console.log(e);
                return res.status(500).send("Error while saving DB");
              });
          }
        })
        .catch((e) => {
          console.log("error");
          console.log(e);
          return res.status(500).send("DB error occured");
        });
    } else {
      return res.status(400).send("No Name or Value");
    }
  })
  .put((req, res, next) => {
    if (req.body.name && req.body.value) {
      itemModel
        .findOne({ name: req.body.name })
        .then((item) => {
          if (item) {
            item.value = req.body.value;
            item.description = req.body.description;
            item
              .save()
              .then(() => {
                return res.status(200).send("DB saved succesfully");
              })
              .catch((e) => {
                console.log("error");
                console.log(e);
                return res.status(500).send("Error while saving DB");
              });
          } else {
            return res.status(500).send("Name does not exist");
          }
        })
        .catch((e) => {
          console.log("error");
          console.log(e);
          return res.status(500).send("DB error occured");
        });
    } else {
      return res.status(400).send("No Name or Value");
    }
  })
  .delete((req, res, next) => {
    if (req.body.name) {
      itemModel
        .findOne({ name: req.body.name })
        .then((item) => {
          if (item) {
            item
              .deleteOne()
              .then(() => {
                return res
                  .status(200)
                  .send(req.body.name + " deleted succesfully");
              })
              .catch((e) => {
                console.log("error");
                console.log(e);
                return res.status(500).send("Error while deleting");
              });
          } else {
            return res.status(500).send("Name does not exist");
          }
        })
        .catch((e) => {
          console.log("error");
          console.log(e);
          return res.status(500).send("DB error occured");
        });
    } else {
      return res.status(400).send("No Name or Value");
    }
  });

module.exports = router;
