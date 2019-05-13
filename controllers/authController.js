const express 		= require('express');
const router 		= express.Router();
// const mongoose 	= require('mongoose');
// const session 	= require('express-session');
// const bcrypt		= require('bcryptjs');

///require user model///
const User 			= require('../models/user.js');

// router.get('/login', (req, res) => {
// 	res.render('login.ejs', {
// 		message: req.session.message
// 	})
// });

// router.get('/register', (req, res) => {
// 	res.render('register.ejs', {
// 		message: req.session.message
// 	})
// });


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
});






module.exports = router;