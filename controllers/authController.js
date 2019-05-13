
const express 			= require('express');
const router 			= express.Router();
const mongoose 			= require('mongoose');
const methodOverride 	= require('method-override');
const bodyParser 		= require('body-parser');
const bcrypt 			= require('bcrypt');
const session 			= require('express-session');
const User 				= require('../models/user.js');





router.post('/', async (req, res, next) => {
	console.log(req.body, ' this is session');
	try {
		const user = await User.create(req.body);

		req.session.logged = true;
		req.session.username = req.body.username;

		res.json({
			status: 200,
			data: 'login successful'
		});
	}catch (err){
		console.log(err);
		res.next(err);
	}
})

/// POST auth/register login user that isn't already logged in///
router.post('/login', async (req, res) => {
	const foundUser = await User.findOne({userName: req.body.userName});
	if(foundUser) {
		if(bcrypt.compareSync(req.body.password, foundUser.password)) {
			req.session.userName = req.body.userName;
			req.session.logged = true;
			req.session.message = undefined
			res.json({
				status: 200,
				data: foundUser
			})
		} else {
			req.session.message = "Username or password were incorrect"
			res.json({
				status: 400,
				data: "Login failed. Username or password were incorrect"
			})
		}
	} else {
		req.session.message = "There were no users under that username. Please register."
		res.json({
			status: 200,
			data: "There were no users under that username. Please register."
		})

	}
});
///END of POST auth/login///



/// POST /auth/register --> sees if user exists and creates new one
router.post('/register', async (req, res, next) => {
	try {
		console.log('hitting route');
		const userCheck = await User.findOne({userName: req.body.userName});
		if(userCheck) {
			req.session.message = "This username is already in use. Please select another"
			console.log("This username is already in use. Please select another");
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
				data: user
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
})
/// END of auth/logout route (destroy session) ///


module.exports = router;