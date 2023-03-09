const express = require('express');
const app = express();
const { Restaurant } = require('./models/index');
const { sequelize } = require('./db');

const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

app.post('/restaurants', async (req, res) => {
	try {
		let { name, location, cuisine } = req.body;
		if (!name || !location || !cuisine) {
			res.status(400).json({ message: 'All fields are required' });
		} else {
			await Restaurant.create({ name, location, cuisine })
				.then((restaurant) => {
					res.status(201).json(restaurant);
				})
				.catch((err) => {
					res.status(500).json({
						message: 'Database Internal Error',
					});
				});
		}
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error' });
	}
});

app.put('/restaurants/:id', async (req, res) => {
	try {
		let { id } = req.params;
		let { name, location, cuisine } = req.body;
		if (!name || !location || !cuisine) {
			res.status(400).json({ message: 'All fields are required' });
		}
		let restaurant;
		await Restaurant.findByPk(id)
			.then((existingRestaurant) => {
				restaurant = existingRestaurant;
				restaurant.set({
					name: name,
					location: location,
					cuisine: cuisine,
				});
				restaurant.save();
				res.status(201).json(restaurant);
			})
			.catch((err) => {
				res.status(404).json({ message: 'Restaurant not found' });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error' });
	}
});

app.delete('/restaurants/:id', async (req, res) => {
	try {
		let { id } = req.params;
		await Restaurant.findByPk(id)
			.then((foundRestaurant) => {
				foundRestaurant.destroy();
				res.status(201).json({ removed: foundRestaurant });
			})
			.catch((err) => {
				res.status(404).json({ message: 'No restaurant found' });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error' });
	}
});

app.listen(port, () => {
	sequelize.sync();
	console.log('Your server is listening on port ' + port);
});
