const express			= require('express');
const app				= express();
const bodyParser		= require('body-parser');
const cors				= require('cors');
const session			= require('express-session');

require('./db/db.js');

app.use(session({
	secret: 'asdlkfjastiuqewap4oihjaskflkdsfjlahgkjhgl',
	resave: false,
	saveUninitialized: false
}));

//// SET UP MIDDLEWARE, ANY CLIENT CAN MAKE REQUEST TO SERVER///
app.use(bodyParser.urlencoded({
	extended: false
	}));

app.use(bodyParser.json());

const corsOptions = {
	origin: 'http://localhost:3001',
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));






const restaurantController = require('./controllers/restaurantController.js');
const authController = require('./controllers/authController.js');

app.use('/restaurants', restaurantController);
app.use('/auth', authController);




app.listen(process.env.PORT || 9000, () => {
	console.log('BOOM!!! listening on port 9000');
});

module.exports = app;