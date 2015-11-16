var express = require('express');
var router = express.Router();
var User = require("../models/index").User;
var Tweet = require("../models/index").Tweet;
// could use one line instead: var router = require('express').Router();

router.get('/', function(req, res) {
    Tweet.findAll({ include: [User]})
    	.then(function(tweets){
    		res.render("index", {tweets:tweets});
    	});
});


router.get('/users/:name', function(req, res){
	var id = (req.params.name);
	 // where: User.id === id
	Tweet.findAll({ include: [User], where: {UserId: id}})
    	.then(function(tweets){
    		// console.log(JSON.stringify(tweets));
    		res.render("index", {tweets:tweets});
    	});
});
router.get('/users/:name/tweets/:id', function(req, res){
	var id = (req.params.id);
	 // where: User.id === id
	Tweet.findAll({ include: [User], where: {id: id}})
    	.then(function(tweets){
    		res.render("index", {tweets:tweets});
    	});
});

// note: this is not very REST-ful. We will talk about REST in the future.

//check if user in db
// if not, create user
// then create tweet with UserId = user.id
router.post('/submit', function(req, res) {
    var name = req.body.name;
    var text = req.body.text;
    // console.log("this is a tweet: ")
    // console.log(Tweet)
    // console.log("this is no longer a tweet");

    User.findOne({where: {name: name}})
    .then(function(user){
    	// if this user exists 
    	if (user) return user; 
    	else return User.create({name: name})
    })
    .then(function(user){
    	return Tweet.create({tweet: text, UserId: user.id})
    })
    .then(function(){
    	res.redirect('/');
    })
});

module.exports = router;
