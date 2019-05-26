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
	secret: 'asdlkfjastiuqewap4oihjaskflkdsfjlahgkjhgl',
	resave: false,
	saveUninitialized: false
}));


//// SET UP MIDDLEWARE, ANY CLIENT CAN MAKE REQUEST TO SERVER///
app.use(bodyParser.urlencoded({
	extended: false
}));


app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

const fetchOne = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=' + process.env.API_KEY + '&input=late%20night%20restaurants&inputtype=textquery&locationbias=ipbias';


const urlList = ['http://localhost:3000', fetchOne];

const corsOptions = {
	origin: function (origin, callback){
		if (urlList.indexOf(origin) !== -1){
			callback(null, true)
		} else {
			callback(Error('Not allowed by CORS'))
		}
	}
};

// app.use(cors(corsOptions));
app.use(cors({
	corsOptions,
	optionsSuccessStatus: 200,
	credentials: true
}));


// app.use(cors({
// 	origin: function(origin, callback){
// 		if(urlList.indexOf(origin) !== -1){
// 			callback(null, true)
// 		} else{
// 			callback(new Error('URL not authorized by cors'))
// 		}

// 	},
// 	optionsSuccessStatus: 200,
// 	credentials: true
// }));







const restaurantController = require('./controllers/restaurantController.js');
const authController = require('./controllers/authController.js');
const commentController = require('./controllers/commentController.js');

app.use('/restaurants', restaurantController);
app.use('/auth', authController);
app.use('/comment', commentController);


app.listen(process.env.PORT || 9000, () => {
	console.log('BOOM!!! listening on port 9000');
});

module.exports = app;