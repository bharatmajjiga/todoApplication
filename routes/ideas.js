const express = require('express');
const mongoose = require('mongoose');
var router = express.Router()

//Load Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');


// Add idea Form
router.get('/add', (req, res) => {
    res.render('ideas/add');
})

//idea index page
router.get('/', (req, res) => {
    Idea.find({
        user: req.user.id
    })
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// Edit idea Form
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id) {
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        }
        else {
            res.render('ideas/edit', {
                idea: idea
            });            
        }
    });
});

// Update idea Form
router.put('/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
            .then(idea => {
                req.flash('success_msg', 'Web Project Idea updated');
                res.redirect('/ideas');
            })
    });
});

// Delete idea
router.delete('/:id', (req, res) => {
    Idea.deleteOne({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg', 'Web Project Idea removed');
        res.redirect('/ideas');
    })
});

// Process Form
router.post('/', (req, res) => {
    let errors = [];

    if(!req.body.title) {
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details) {
        errors.push({text:'Please enter details'});
    }

    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })  
    }
    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then(Idea => {
                req.flash('success_msg', 'Web Project Idea added');
                res.redirect('/ideas');
            })
    }
})


module.exports = router;