const express			= require('express');
const app				= express();
const bodyParser		= require('body-parser');
const cors				= require('cors');
const session			= require('express-session');

require('dotenv').config();

const apiKey = process.env.API_KEY;


require('isomorphic-fetch');
require('es6-promise').polyfill();


require('./db/db.js');

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));


//// SET UP MIDDLEWARE, ANY CLIENT CAN MAKE REQUEST TO SERVER///
app.use(bodyParser.urlencoded({
	extended: false
}));


app.use((req, res, next) => {
	console.log("\n you just tried to :" + req.path);
	console.log("\n and here is req.session:");
	console.log(req.session);
	next()
})


app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.HEROKU_URL, // when you deploy your react app, this is where you put the address,
  credentials: true, // allowing cookies to be sent with requests from the client (session cookie),
  optionsSuccessStatus: 200 // some legacy browsers IE11 choke on a 204, and options requests
}

// const urlList = [process.env.BACKEND_URL,process.env.HEROKU_BACKEND_URL, process.env.HEROKU_URL]


// const corsOptions = {
// 	origin: function (origin, callback){
// 		if (urlList.indexOf(origin) !== -1){
// 			callback(null, true)
// 		} else {
// 			callback(Error('Not allowed by CORS'))
// 		}
// 	},
// 	credentials: true,
// 	optionsSuccessStatus: 200
// };

app.use(cors(corsOptions));


const restaurantController = require('./controllers/restaurantController.js');
const authController = require('./controllers/authController.js');
const commentController = require('./controllers/commentController.js');

app.use('/restaurants', restaurantController);
app.use('/auth', authController);
app.use('/comment', commentController);


app.listen(process.env.PORT, () => {
	console.log('BOOM!!! listening on PORT: ---- ');
});

module.exports = app;