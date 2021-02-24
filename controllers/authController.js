const express 			= require('express');
const compression		= require('compression');
const router 			= express.Router();
const mongoose 			= require('mongoose');
const methodOverride 	= require('method-override');
const bodyParser 		= require('body-parser');
const bcrypt 			= require('bcrypt');
const session 			= require('express-session');
require('isomorphic-fetch');
require('es6-promise').polyfill();
const User 				= require('../models/user.js');
const Comment = require('../models/comment.js')
const Restaurant = require('../models/restaurant.js')

/////auth GET route --- checks for user in DB against req.body//////
router.get('/', async (req, res, next) => {
	try {
		const user = await User.findOne({ userName: req.body.userName })

		if (user.userName === req.body.userName){
			res.json({
				status: 200,
				data: 'user has been found'
			});
			console.log(res.json);
		} if (user.userName !== req.body.userName) {
			res.json({
				status: 400,
				data: 'no user was been found'
			});
			console.log(res.json);
		}
	}catch(err){
		console.error(err);
		next(err);
	}
});
/////END OF auth/ GET route --- checks for user in DB//////


///this route returns all comments made by a user///
router.get('/usercomments/:_id', async (req, res, next) => {
	try{
		if (req.session.id ) {
			const foundUser = await User.findOne({ _id: req.params._id });
			if (foundUser){
				const foundRestaurants = await Restaurant.find({ userName: foundUser.userName }).populate('comments').exec();
				const foundComments = await Comment.find({ commentAuthor: foundUser.userName }).populate('restaurants').exec();
				console.log("\n COMMENTS AND RESTAURANTS FOUND!");
				res.status(200).json({
					data: {
						restaurants: foundRestaurants, 
						comments: foundComments
					}
				});
			}
			if (!foundUser) {
				message = "No user found!"
				res.status(400).json({
					data: message
				});
				console.log(message);
			}
		}
		if (!req.session.id) {
			message = 'Session id could not be found!';
			res.status(400).json({
				data: message
			})
			console.log(message);
		}
	}catch(err){
		console.error(next(err));
	}
});
///end of auth/get/usercomments THIS IS RETURNING ALL USER DATA BUT NOT ALL OF IT... 


/// POST auth/login --> login user that isn't already logged in///
router.post('/login', async (req, res, next) => {
	const foundUser = await User.findOne({ userName: req.body.userName });
	if(foundUser) {
		const passwordMatch = bcrypt.compareSync(req.body.password, foundUser.password);
		if (passwordMatch){
				req.session.message = 'Username and password matches';
				res.json({
					status: 200,
					data: foundUser,
					success: true
				})
				console.log(req.body.userName + " has logged in successfully");
		} if (!passwordMatch) {
			req.session.message = "Login failed. Username or password were incorrect";
			res.json({
				status: 400,
				data: req.session.message,
				success: false
			})
			console.log(req.session.message);
		}
	} if(!foundUser) {
		req.session.message = "There were no users under that username. Please register."
		res.json({
			status: 400,
			data: req.session.message,
			success: false
		})
		console.log(req.session.message);
	}
});
/////////END of POST auth/login///////



///////// POST /auth/register --> sees if user exists and creates new one//////
router.post('/register', async (req, res, next) => {
	try {
		const userCheck = await User.findOne({ userName: req.body.userName });
		const emailCheck = await User.findOne({ email: req.body.email });
		req.session.message = '';
		if(userCheck || emailCheck) {
			req.session.message = "This username or email is already in use.";
			console.log(req.session.message);
			res.json({
				status: 400,
				data: req.session.message
			})
		} else {
			const password = req.body.password;
			const passwordHash = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
			const userEntry = {};
			userEntry.userName = req.body.userName;
			userEntry.password = passwordHash;
			userEntry.email = req.body.email;
			const user = await User.create(userEntry);
			console.log(user);
			req.session.message = "New user" + req.body.userName + " has been registered registered.";
			newUser = JSON.stringify(user);
			res.json({
				status: 200,
				data: newUser,
				registered: true
			})
			console.log(req.session.message);
		}
	}catch(err) {
		console.error(next(err));
	}
});
/// END of POST auth/register route///



/// GET auth/logout route (destroy session) ///
router.get('/logout', (req, res, next) => {
	req.session.destroy((err) => {
		if(err) {
			console.error(next(err));
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