const express 			= require('express');
const router 			= express.Router();
const mongoose 			= require('mongoose');
const methodOverride 	= require('method-override');
const bodyParser 		= require('body-parser');
const ejs 				= require('ejs');
const bcrypt 			= require('bcrypt');
const session 			= require('express-session');
const User 				= require('../models/user.js');


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
})

// router.post('/register', async (req, res, next) => {
// 	console.log("req.body is: ", req.body);
// 	const queriedUserName = await User.findOne({
// 		userName: req.body.userName
// 	});
// 	console.log(queriedUserName);
// 	if (queriedUserName){
// 		console.log(`${queriedUserName} ALREADY EXISTS!!!`);
// 	} else {
// 		const password = req.body.password;
// 		const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
// 		const userDbEntry = {};
// 		userDbEntry.userName = req.body.userName;
// 		userDbEntry.password = passwordHash;
// 		req.session.message ="Registration successful."
// 		res.json({
// 			status: 200,
// 			data: userDbEntry
// 		});
// 	 try{	
// 		const createdUser = await User.create(userDbEntry);
// 		console.log("=================");
// 		console.log(`${createdUser} <======= user has been created in REGISTER POST USER ROUTE`);
// 		console.log("=================");
// 		console.log(req.session);
// 		req.session.logged = true;
// 		req.session.usersDbId = createdUser._id;
// 		res.json({
// 			status: 200,
// 			data: createdUser
// 		})
// 	}catch(err){
// 		next(err);
// 	}}
// });
/// END of POST auth/register route///



/// POST auth/login route ///
router.post('/login', async (req, res, next) => {
    try {
        const foundUser = await User.findOne({'userName': req.body.userName});
        if (!foundUser) {
            console.log("User not found)")
            res.redirect('/auth/register')
        } else if (foundUser) {
            const passwordMatch = bcrypt.compareSync(req.body.password, foundUser.password)
            if (passwordMatch === true) {
                req.session.message = '';
                req.session.logged = true;
                req.session.username = req.body.username;
                req.session.usersDbId = foundUser._id;
                console.log(`${req.session} <===== SUCCESSFUL LOGIN!`);
                res.redirect('/restaurants') 
            } else if (passwordMatch === false) {
                req.session.message = "Username or password is incorrect";
                console.log("User with that username exists but password incorrect")
                res.redirect('/auth/login')
            }
        };
    } catch (err) {
    	next(err);
        res.send(err)
    }
});
/// END of POST/auth/login ROUTE///





/// GET auth/logout route (destroy session) ///
router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			next(err)
			res.send(err)
		} else {
			res.redirect('/auth/login')
		}
	})	
});
/// END of auth/logout route (destroy session) ///



module.exports = router;