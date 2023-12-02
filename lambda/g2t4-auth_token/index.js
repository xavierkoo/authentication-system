import fetch from 'node-fetch';
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(express.json()); // Enable JSON parsing for POST requests
app.use(cors()); // Enable CORS for all requests
const port = 8000;

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

app.post('/g2t4_auth_token', async (req, res) => {
	const {code, url} = req.body;
	if (!code) {
		return res.status(400).json({error: 'Access token is missing.'});
	}
	try {
		const response = await fetch(
			'https://smurnauth-production.fly.dev/oauth/token',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					client_id: process.env.CLIENT_ID,
					client_secret: process.env.CLIENT_SECRET,
					grant_type: 'authorization_code',
					code: code,
					redirect_uri: url,
				}),
			}
		);
		if (!response.ok) {
			throw new Error(`Request failed with status: ${response.status}`);
		}
		const data = await response.json();
		console.log('this is output in line 80', data);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({error: error.message}); // sending the actual error message for debugging
	}
});

export const handler = serverless(app);
