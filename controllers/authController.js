
const express 			= require('express');
const router 			= express.Router();
const mongoose 			= require('mongoose');
const methodOverride 	= require('method-override');
const bodyParser 		= require('body-parser');
const bcrypt 			= require('bcrypt');
const session 			= require('express-session');
const User 				= require('../models/user.js');




///////registration post route --- creates a new user in DB//////
router.post('/', async (req, res, next) => {
	console.log(req.session, ' <======= this is session');
	try {
		const user = await User.create(req.body);

		req.session.logged = true;
		req.session.userName = req.body.userName;

		res.json({
			status: 200,
			data: 'register successful'
		});
	}catch (err){
		console.log(err);
		next(err);
	}
});
///////END OF registration POST route --- creates a new user in DB//////

/// POST auth/login --> login user that isn't already logged in///
router.post('/login', async (req, res, next) => {
	console.log('hitting POST ROUTE AUTH/LOGIN');
	//this should be find by id//
	const foundUser = await User.findOne({userName: req.body.userName});
	if(foundUser) {
		if(bcrypt.compareSync(req.body.password, foundUser.password)) {
			console.log('User has been found: ', foundUser);
///YOU WERE CONSIDERING CHANGING ABOVE  ^^^ (req.body.password, foundUser.password)////////
			req.session.userName = req.body.userName;
			req.session.logged = true;
			req.session.message = undefined
			res.json({
				status: 200,
				data: foundUser,
				success: true
			})
			console.log('hitting POST ROUTE AUTH/LOGIN');
			console.log(res.json);
		} else {
			req.session.message = "Username or password were incorrect"
			res.json({
				status: 400,
				data: "Login failed. Username or password were incorrect",
				success: false
			})
		}
	} else {
		req.session.message = "There were no users under that name. Please register.",
		res.json({
			status: 200,
			data: "There were no users under that username. Please register.",
			success: false
		})

	}
});
///END of POST auth/login///



/// POST /auth/register --> sees if user exists and creates new one
router.post('/register', async (req, res, next) => {
	try {
		console.log('hitting POST route auth/register');
		const userCheck = await User.findOne({userName: req.body.userName});
		if(userCheck) {
			req.session.message = "This username is already in use.";
			console.log(req.session.message);
			console.log("This username is already in use.");
		} else {
			const password = req.body.password;
			console.log(password);			
			const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
			const userEntry = {};
			userEntry.userName = req.body.userName;
			userEntry.password = passwordHash;
			userEntry.email = req.body.email
			const user = await User.create(userEntry);
			console.log(user);
			req.session.userName = req.body.userName;
			req.session.logged = true;
			req.session.message = undefined;
			res.json({
				status: 200,
				data: user,
				success: false
			})
		}
	} catch(err) {
		next(err)
	}
});
/// END of POST auth/login route///



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
		}
	})	
});
/// END of auth/logout route (destroy session) ///


module.exports = router;