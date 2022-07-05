var express = require('express');
const jwt = require("jsonwebtoken");
let User = require("../models/user.model");
const passport = require("passport");
const router = express.Router();
require('../config/passport')

// protected api example
// router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.json(req.user)
// })

router.route("/update/:id").put((req, res) => {
    User.findByIdAndUpdate(req.params.id)
        .then((user) => {
            user.username = req.body.username;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.mailAddress = req.body.mailAddress;
            user.password = req.body.password;
            user.role = req.body.role;
            if (!user.role) {
                user.role = "Simple User";
            }
            user.permissions = req.body.permissions;
            if (!user.permissions) {
                user.permissions.push("None");
            }
            user.save()
                .then(() => res.json("User updated!"))
                .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/register").post((req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const mailAddress = req.body.mailAddress;
    const password = req.body.password;
    var role = req.body.role;
    if (!role) {
        role = "Simple User";
    }
    var permissions = [];
    if (!req.body.permissions) {
        permissions.push("None");
    } else {
        permissions.push(req.body.permissions);
    }
    console.log( firstname, lastname, mailAddress, password, role, permissions)
    const newUser = new User({ firstname, lastname, mailAddress, password, role, permissions });
    newUser
        .save()
        .then(() => res.json("User added!"))
        .catch((err) => {
            console.log(err)
            res.status(400).json("Error: " + err)
        });
})

router.route("/login").post(async (req, res) => {
    User.getAuthenticated(req.body.username, req.body.mailAddress, req.body.password, function (err, user, reason) {
        if (err) throw err;
        // login was successful if we have a user
        if (user) {
            // handle login success
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCES_TOKEN_SECRET, {
                expiresIn: "1d",
            });
            res.json({ accessToken: accessToken, user: user });
            return;
        }
        // otherwise we can determine why we failed
        else {
            var reasons = User.failedLogin;
            switch (reason) {
                case reasons.NOT_FOUND:
                    res.status(400).send("No User Found!");
                    break;
                case reasons.PASSWORD_INCORRECT:

                    // note: these cases are usually treated the same - don't tell
                    // the user *why* the login failed, only that it did
                    res.status(400).send("Invalid details");
                    break;
                case reasons.MAX_ATTEMPTS:
                    // send email or otherwise notify user that account is
                    // temporarily locked
                    res.status(400).send("You failed too many times. Your account is locked for two hours.");
                    break;
                default:
            }
        }
    });
});

router.route("/").get(passport.authenticate('jwt', { session: false }), (req, res) => {
    User.find()
        .then((users) => res.json(users))
})

router.route("/:id").get(passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.params.id)
        .then((user) => res.json(user))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete(passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json("User deleted."))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/user/:id/permissions").get(passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.params.id)
        .then((user) => res.json(user.permissions))
        .catch((err) => res.status(400).json("Error: " + err));
})

router.route("/user/:id/grant/:permission").put(passport.authenticate('jwt', { session: false }), (req, res) => {
    const permission = req.params.permission
    if (permissionIsValid(permission)) {
        User.findByIdAndUpdate(req.params.id).then((user) => {
            user.permissions.push(permission)
            user.save()
                .then(() => res.json("Permission " + permission + " granted to " + user.firstname + " " + user.lastname))
                .catch((err) => res.status(400).json("Error: " + err));
        });
    }
    else {
        res.status(500).json("Permission is not valid ")
    }
})

router.route("/user/:id/revoke/:permission").put(passport.authenticate('jwt', { session: false }), (req, res) => {
    const permission = req.params.permission
    if (permissionIsValid(permission)) {
        User.findByIdAndUpdate(req.params.id).then((user) => {
            user.permissions.splice(user.permissions.indexOf(permission), 1)
            user.save()
                .then(() => res.json("Permission " + permission + " revoked from& " + user.firstname + " " + user.lastname))
                .catch((err) => res.status(400).json("Error: " + err));
        });
    }
    else {
        res.status(500).json("Permission is not valid ")
    }
})

function permissionIsValid(permission) {
    return ['Read', 'Write', 'Execute', 'None'].includes(permission);
}

module.exports = router;
