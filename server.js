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

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));




app.use(cors(corsOptions));

const restaurantController = require('./controllers/restaurantController');
const authController = require('./controllers/authController');

// app.use('/restaurants', restaurantController);

app.use('/auth', authController);

app.listen(process.env.PORT || 9000, () => {
	console.log('listening on port 9000');
});

module.exports = app;