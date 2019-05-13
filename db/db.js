const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/lateNight', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});

mongoose.connection.on('connected', () => {
	console.log('MONGOOSE IS CONNECTED');
});

mongoose.connection.on('error', (err) => {
	console.error(err, 'MONGOOSE HAS EXPERIENCED AN ERROR');
});

mongoose.connection.on('disconnected', (err) => {
	console.log(`${err} MONGOOSE IS DISCONNECTED`);
});