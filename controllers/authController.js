const express 			= require('express');
const router 			= express.Router();
const mongoose 			= require('mongoose');
const methodOverride 	= require('method-override');
const bodyParser 		= require('body-parser');
const ejs 				= require('ejs');
// const pathfinderUI 		= require('pathfinder-ui');
const bcrypt 			= require('bcryptjs');
const session 			= require('express-session');
const User 				= require('../models/user.js');


/// MAKE A login route that will simulate or actually be a user login
router.get('/login', (req, res) => {
	res.render('./auth/login.ejs', {
		message: req.session.message
	})
});
///END OF LOGIN GET USER ROUTE

/// REGISTRATION GET USER ROUTE
router.get('/register', (req, res) => {
		res.render('./auth/register.ejs', {
			message: req.session.message
		})	
});
/// END OF REGISTRATION GET USER ROUTE

/// REGISTRATION POST USER ROUTE
router.post('/register', async (req, res, next) => {
	console.log("req.body is: ", req.body);
	const queriedUserName = await User.findOne({
		userName: req.body.userName
	});
	console.log(queriedUserName);
	if (queriedUserName){
		console.log(`${queriedUserName} ALREADY EXISTS!!!`);
		res.redirect('/auth/login');
	} else {
		const password = req.body.password;
		const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		const userDbEntry = {};
		userDbEntry.userName = req.body.userName;
		userDbEntry.password = passwordHash;
	 try{	
		const createdUser = await User.create(userDbEntry);
		console.log("=================");
		console.log(`${createdUser} <======= user has been created in REGISTER POST USER ROUTE`);
		console.log("=================");
		console.log(req.session);
		req.session.logged = true;
		req.session.usersDbId = createdUser._id;
		res.redirect('/auth/login');  ///not sure about redirect site
	}catch(err){
		next(err);
		res.send(err);
	}}
});
/// END OF REGISTRATION POST USER ROUTE



/// POST USER LOGIN ROUTE
/// make the form in login.ejs make a request to this
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
/// END OF POST USER LOGIN ROUTE





/// GET LOGOUT USER ROUTE (DESTROY)
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
/// END OF LOGOUT USER ROUTE (DESTROY)



module.exports = router;