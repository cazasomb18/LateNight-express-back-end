const compression		= require('compression');
const express			= require('express');
const app				= express();
const bodyParser		= require('body-parser');
const cors				= require('cors');
const session			= require('express-session');

require('dotenv').config();
require('isomorphic-fetch');
require('es6-promise').polyfill();




require('./db/db.js');

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));


//// SET UP MIDDLEWARE, ANY CLIENT CAN MAKE REQUEST TO SERVER///
app.use(compression());

app.use((req, res, next) => {
	console.log("\n you just tried to :" + req.path);
	next();
})


app.use(bodyParser.urlencoded({
	extended: false
}));


app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.HEROKU_URL,
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));


const restaurantController = require('./controllers/restaurantController.js');
const authController = require('./controllers/authController.js');
const commentController = require('./controllers/commentController.js');

app.use('/restaurants', restaurantController);
app.use('/auth', authController);
app.use('/comment', commentController);


app.listen(process.env.PORT, () => {
	console.log('BOOM!! listening on PORT: ---- ');
});

module.exports = app;