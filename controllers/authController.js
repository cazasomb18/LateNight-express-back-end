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



///////auth GET route --- checks for user in DB//////
router.get('/', async (req, res, next) => {
	console.log(req.session, ' <======= this is session');
	console.log(req.session.userName);
	console.log('^--- This is the req.session.username');
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
				data: 'user has not been found'
			});
			console.log(res.json);
		}
	}catch (err){
		console.log(err);
		console.error(err);
		next(err);
	}
});
///////END OF registration GET route --- checks for user in DB//////


///this route returns all comments made by a user's session
router.get('/usercomments', async (req, res, next) => {
	try{
		console.log(req.session);
		if (req.session){
			console.log(req.session);
			const foundUser = await User.findOne({userName: req.session.userName})
			console.log(foundUser);
			if (foundUser){
				console.log('foundUser?');
				const foundComments = await Comment.find({commentAuthor: req.session.userName});
				res.json({
					status: 200,
					data: foundComments
				});
			} else {
				res.json({
					status: 400,
					data: 'no comments found'
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

/// POST auth/login --> login user that isn't already logged in///
router.post('/login', async (req, res, next) => {
	console.log('hitting POST ROUTE AUTH/LOGIN');
	const foundUser = await User.findOne({userName: req.body.userName});
	if(foundUser) {
		// if (bcrypt.compareSync(req.body.password, foundUser.password)) {
		console.log('User has been found: ', foundUser);
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

///YOU WERE CONSIDERING CHANGING ABOVE  ^^^ (req.body.password, foundUser.password)////////
			// foundUser = JSON.stringify(foundUser);
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
		console.log("There were no users under that username. Please register.");

	}
});
/////////END of POST auth/login///////



///////// POST /auth/register --> sees if user exists and creates new one//////
router.post('/register', async (req, res, next) => {
	try {
		// const thisUser;
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
				success: false
	///created success to try to keep track of user data in React///
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
				data: 'Logout successful'
			})
			console.log("User has successfully logged out");
		}
	})	
});
/// END of auth/logout route (destroy session) ///


module.exports = router;