const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');

//Load User model
require('../models/User');
const User = mongoose.model('users');

//login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//registration route
router.get('/register', (req, res) => {
    res.render('users/register');
});

//post register route
router.post('/register', (req, res) => {
    let errors = [];
    
    if(req.body.password.length < 4) {
        errors.push({text:'Password must be atleast 4 characters'});
    }

    if(req.body.password != req.body.password2) {
        errors.push({text:'Passwords do not match'});
    }

    if(errors.length > 0) {
        res.render('/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }

    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    User.findOne({
        email: newUser.email
    })
        .then((user) => {
            if(user) {
            req.flash('error_msg', 'Email id already Registered');
            res.redirect('/users/login');
            }
            else {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {     
                if(err) throw err;
                newUser.password = hash;
                new User(newUser)
                .save()
                .then(user => {
                    req.flash('success_msg', 'User Registered successfully and can login now');
                    res.redirect('/users/login');
                })
                .catch(err => {
                    console.log(err);
                    return;
                });
                });
            });
        }   
    })
});

//post login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect : '/users/login',
        failureFlash: true
    })(req, res, next);
})


//logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are Logged Out');
    res.redirect('/users/login');
});

module.exports = router;
