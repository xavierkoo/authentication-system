const fetch = require('node-fetch');
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(express.json()); // Enable JSON parsing for POST requests
app.use(cors()); // Enable CORS for all requests

app.post('/auth_userprofile', async (req, res) => {
	const {accessToken} = req.body;
	console.log(req.body);

	if (!accessToken) {
		return res.status(400).json({error: 'Access token is missing.'});
	}
	try {
		const url = 'https://smurnauth-production.fly.dev/oauth/userinfo';
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			method: 'GET',
		});

		if (response.ok) {
			const data = await response.json();
			console.log('this is a successful endpoint');
			res.status(200).json(data);
		} else {
			console.error(
				`Failed to fetch data. Status code: ${response.status}`
			);
			res.status(400).json({error: 'ERROR FETCHING'});
		}
	} catch (error) {
		res.status(500).json({error: 'Failed to retrieve user data.'});
	}
});

exports.handler = serverless(app);
