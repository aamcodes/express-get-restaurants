const express = require('express');
const app = express();
const { sequelize } = require('./db');
const restaurantRouter = require('./router/index');

const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Use Router
app.use('/restaurants', restaurantRouter);

app.listen(port, () => {
	sequelize.sync();
	console.log('Your server is listening on port ' + port);
});
