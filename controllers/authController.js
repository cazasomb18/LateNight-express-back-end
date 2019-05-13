const express 		= require('express');
const router 		= express.Router();
const mongoose 		= require('mongoose');
const session 		= require('express-session');
const bcrypt		= require('bcryptjs');

///require user model///
const User 			= require('../models/user.js');


// router.get('/login', async (req, res) => {
// 	// ({
// 		message: req.session.message;
// 	// })
// });

router.post('/', async (req, res) => {
	console.log(req.body, 'this is session');
	try {
		const user = await User.create(req.body);
		req.session.logged = true;
		req.session.username = req.body.username;
		res.json({
			status: 200,
			data: 'login successful'
		})
	}catch(err){
		console.error(err);
		res.send(err);
	}
});

router.post('/register', async (req, res, next) => {
	try{
		const user = await User.findOne({username: req.body.username});
		console.log(queriedUserName);
		if (queriedUserName){
			console.log(`${queriedUserName} ALREADY EXISTS!!!`);
		}try {
			const createdUser = await User.create(userDbEntry);
			console.log("=========================");
			console.log(`${createdUser} <========== user has been created in REGISTER POST ROUTE`);
			console.log("=========================");
			req.session.logged = true;
			req.session.usersDbId = createdUser._id;
			console.log(req.session);
		}catch(err){
			// console.log(err);
			// console.error(err);
			next(err);
		}else {
			const password = req.body.password;
			const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
			const userDbEntry = {};
			userDbEntry.username = req.body.username;
			userDbEntry.password = passwordHash;
		}
	}catch(err){
		next(err);
}});





module.exports = router;