import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(express.json()); // Enable JSON parsing for POST requests
app.use(cors()); // Enable CORS for all requests
const port = 8000;

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

app.post('/g2t4-verifytoken', async (req, res) => {
	const publicKey = fs.readFileSync('./bank_public_key.pem', 'utf8');
	const {token} = req.body;

	let trustedIssuers = ['Bank App'];

	function verify(token) {
		const decodedToken = jwt.decode(token, {complete: true});
		console.log(decodedToken);

		if (!decodedToken) {
			throw new Error('Token decode failed, syntax error');
		}

		if (!trustedIssuers.includes(decodedToken.payload.iss)) {
			throw new Error('The token issuer is not trusted');
		}

		jwt.verify(token, publicKey);

		return decodedToken;
	}

	const isTokenValid = verify(token);
	if (isTokenValid) {
		res.status(200).json({message: 'Token is valid'});
		console.log('sent');
	} else {
		res.status(400).json({message: 'Token is not valid'});
	}
});

export const handler = serverless(app);
