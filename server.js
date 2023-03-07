const express = require('express');
const app = express();
const { Restaurant } = require('./models/index');
const { sequelize } = require('./db');

const port = 3000;

//TODO: Create your GET Request Route Below:
app.get('/restaurants', async (req, res) => {
	try {
		await Restaurant.findAll()
			.then((restaurants) => {
				res.status(200).json(restaurants);
			})
			.catch((err) => {
				res.status(404).json({ message: 'No restaurants found' });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error' });
	}
});

app.get('/restaurants/:id', async (req, res) => {
	try {
		await Restaurant.findByPk(req.params.id)
			.then((restaurant) => {
				res.status(200).json(restaurant);
			})
			.catch((err) => {
				res.status(404).json({ message: 'Restaurant not found' });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error' });
	}
});

app.listen(port, () => {
	sequelize.sync();
	console.log('Your server is listening on port ' + port);
});
