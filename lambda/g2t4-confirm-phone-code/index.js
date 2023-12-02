const AWS = require("aws-sdk");

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
	region: "ap-southeast-1",
});

const verifyPhoneNumberCode = async (code, accessTokenJWT) => {
	//implement verifyUserAttribute

	const params = {
		AttributeName: "phone_number",
		AccessToken: accessTokenJWT,
		Code: code,
	};

	try {
		await cognitoIdentityServiceProvider
			.verifyUserAttribute(params)
			.promise();
	} catch (err) {
		console.error(err);
		return {
			statusCode: 400,
			body: "Invalid code",
		};
	}

	return {
		statusCode: 200,
		body: "Phone number verified successfully",
	};
};

const main = async (event) => {
	const accessTokenJWT = event.accessToken;

	const params = {
		AccessToken: accessTokenJWT,
	};

	try {
		// Verify token and check if the user is an admin, if not, return error
		const response = await cognitoIdentityServiceProvider
			.getUser(params)
			.promise();
	} catch (err) {
		console.error(err);
		// If token is invalid, return error
		return {
			statusCode: 400,
			body: "Invalid token",
		};
	}

	// Update user role
	const response = await verifyPhoneNumberCode(event.code, accessTokenJWT);
	return response;
};

exports.handler = main;
