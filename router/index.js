const express = require('express');
const router = express.Router();
const { Restaurant } = require('../models/index');
const { check, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
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

router.get('/:id', async (req, res) => {
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

router.post(
	'/',
	[
		check(['name', 'location', 'cuisine']).not().isEmpty().trim(),
		check('name').isLength({ min: 10, max: 30 }),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.status(400).json({ error: errors.array() });
			} else {
				let { name, location, cuisine } = req.body;
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
	}
);

router.put('/:id', async (req, res) => {
	try {
		let { id } = req.params;
		let { name, location, cuisine } = req.body;
		if (!name || !location || !cuisine) {
			res.status(400).json({ message: 'All fields are required' });
		}
		await Restaurant.findByPk(id)
			.then((restaurant) => {
				restaurant.set({
					name,
					location,
					cuisine,
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

router.delete('/:id', async (req, res) => {
	try {
		let { id } = req.params;
		await Restaurant.findByPk(id)
			.then((restaurant) => {
				restaurant.destroy();
				res.status(201).json({ removed: restaurant });
			})
			.catch((err) => {
				res.status(404).json({ message: 'No restaurant found' });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error' });
	}
});

module.exports = router;
