const express			= require('express');
const app				= express();
const bodyParser		= require('body-parser');
const cors				= require('cors');
const sessions			= require('express-session');

require('./db/db.js');

app.use(session({
	secret: 'as;dlkfjas;tiuqewap4oihjaskflkdsfj;laSJFDA'
	resave: false,
	saveUninitialized: false
}));

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyParser.json());

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

const restaurantController = require('./controllers/restaurantController');
const authController = require('./controllers/authController');

app.listen(process.env.PORT || 9000, () => {
	console.log('listening on port 9000');
});