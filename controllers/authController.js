///require node_modules///
const express 			= require('express');
const router 			= express.Router();
const mongoose 			= require('mongoose');
const methodOverride 	= require('method-override');
const bodyParser 		= require('body-parser');
const bcrypt 			= require('bcrypt');
const session 			= require('express-session');
const User 				= require('../models/user.js');
const Comment = require('../models/comment.js')
const Restaurant = require('../models/restaurant.js')

/////auth GET route --- checks for user in DB//////
router.get('/', async (req, res, next) => {
	try {
		const user = await User.findOne({userName: req.body.userName})
///I changed this to a GET ROUTE, and switched the mongoose method ot findOne
///instead of create, now this route checks to see if req.body matches the dbentry
///and sends res.json() accordingly.
		if (user.userName === req.body.userName){
			res.json({
				status: 200,
				data: 'user has been found'
			});
			console.log(res.json);
		} else {
			req.session.logged === false;
			res.json({
				status: 400,
				data: 'no user has been found'
			});
			console.log(res.json);
		}
	}catch (err){
		console.error(err);
		next(err);
	}
});
/////END OF auth/ GET route --- checks for user in DB//////
///could i maybe use this route to validate the current user and THEN hit the below endpoint???///


///this route returns all comments made by a user's session... except there is no session... why?!////
router.get('/usercomments', async (req, res, next) => {
	try{
		if (req.session.logged === true){
			console.log('==================');
			console.log(req.session);
			console.log('This is req.session');
			console.log('==================');
			const foundUser = await User.findOne({userName: req.session.userName})
			console.log('==================');
			console.log(foundUser);
			console.log('This is found User');
			console.log('==================');
			if (foundUser){
				const foundRestaurants = await Restaurant.find({userName: req.session.userName});
				const foundComments = await Comment.find({commentAuthor: req.session.userName})
				console.log(foundRestaurants);
				console.log(foundComments);
				res.json({
					status: 200,
					data: foundRestaurants, foundComments
				});
			} else {
				res.json({
					status: 400,
					data: 'no data found'
				});
			}
		} else {
			res.json({
				status: 400,
				data: 'no user session found'
			})
		}
	}catch(err){
		console.error(err);
		next(err);
	}
});
///end of auth/get/usercomments GET route - WHY ISN'T THIS WORKING???


/// POST auth/login --> login user that isn't already logged in///
router.post('/login', async (req, res, next) => {
	console.log('hitting POST ROUTE AUTH/LOGIN');
	const foundUser = await User.findOne({userName: req.body.userName});
	if(foundUser) {
		console.log('User has been found: ', foundUser);
		console.log(req.session);
		const passwordMatch = bcrypt.compareSync(req.body.password, foundUser.password)
		if (passwordMatch){
				req.session.message = '',
				req.session.logged = true;
				req.session.userName = req.body.userName;
				req.session.message = 'Username and password matches';
				res.json({
					status: 200,
					data: foundUser,
					success: true
				})
				console.log(req.body.userName + " has logged in successfully");
				console.log(req.session.message);
		} else {
			req.session.message = "Username or password were incorrect";
			res.json({
				status: 400,
				data: "Login failed. Username or password were incorrect",
				success: false
			})
			console.log(res.json);
		}
	} else {
		req.session.message = "There were no users under that username. Please register.",
		res.json({
			status: 200,
			data: "There were no users under that username. Please register.",
			success: false
		})
		console.log(res.json);
		console.log(req.session.message);
	}
});
/////////END of POST auth/login///////



///////// POST /auth/register --> sees if user exists and creates new one//////
router.post('/register', async (req, res, next) => {
	try {
		console.log('hitting POST route auth/register');
		const userCheck = await User.findOne({userName: req.body.userName});
		if(userCheck) {
			req.session.message = '';
			req.session.message = "This username is already in use.";
			console.log(req.session.message);
			console.log("This username is already in use.");
		} else {
			req.session.message = '';
			const password = req.body.password;
			console.log(password);
			const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
			console.log(passwordHash);
			const userEntry = {};
			userEntry.userName = req.body.userName;
			userEntry.password = passwordHash;
			userEntry.email = req.body.email
			const user = await User.create(userEntry);
			console.log(user);
			req.session.userName = req.body.userName;
			req.session.logged = true;
			req.session.message = "New user" + req.body.userName + "has been registered registered.";
			username = JSON.stringify(user);
			res.json({
				status: 200,
				data: user,
				registered: true
			})
		}
	} catch(err) {
		next(err)
	}
});
/// END of POST auth/register route///



/// GET auth/logout route (destroy session) ///
router.get('/logout', (req, res, next) => {
	req.session.destroy((err) => {
		if(err) {
			next(err)
		} else {
			res.json({
				status:200,
				data: 'Logout successful',
				loggedout: true
			})
			console.log("User has successfully logged out");
		}
	})	
});
/// END of auth/logout route (destroy session) ///


module.exports = router;