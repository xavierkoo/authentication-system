const AWS = require("aws-sdk");

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
	region: "ap-southeast-1",
});

const updatePhoneNumber = async (sub, phoneNumber) => {
	const params = {
		UserPoolId: "ap-southeast-1_crimtf1ce",
	};

	//TODO - Add code to validate phone number (e.g. "+6598765432": string length, starts with "+")
	// take in a phonenumber string and check if it has starts with "+" and has a total of 11 characters

	phoneNumber = phoneNumber.trim(); //trim any whitespace

	if (phoneNumber.charAt(0) !== "+") {
		//check if it starts with "+"
		return {
			statusCode: 400,
			body: "Phone number must start with '+'",
		};
	}
	//check if it has 11 characters
	if (phoneNumber.length !== 11) {
		return {
			statusCode: 400,
			body: "Phone number must have 11 characters",
		};
	}

	// Check if user exists
	try {
		await cognitoIdentityServiceProvider
			.adminGetUser({
				...params,
				Username: sub,
			})
			.promise();
	} catch (err) {
		console.error(err);
		return {
			statusCode: 400,
			body: "User does not exist",
		};
	}

	try {
		await cognitoIdentityServiceProvider
			.adminUpdateUserAttributes({
				...params,
				Username: sub,
				UserAttributes: [
					{
						Name: "phone_number",
						Value: phoneNumber,
					},
				],
			})
			.promise();

		return {
			statusCode: 200,
			body: "Phone number attribute updated successfully",
		};
	} catch (err) {
		console.error(err);
		return {
			statusCode: 500,
			body: "Error updating Phone number attribute",
		};
	}
};

const sendVerificationCode = async (accessTokenJWT) => {
	// implement GetUserAttributeVerificationCode
	const params = {
		AttributeName: "phone_number",
		AccessToken: accessTokenJWT,
	};

	try {
		await cognitoIdentityServiceProvider
			.getUserAttributeVerificationCode(params)
			.promise();
	} catch (err) {
		console.error(err);
		return {
			statusCode: 500,
			body: "Error sending verification code",
		};
	}

	return {
		statusCode: 200,
		body: "Verification code sent successfully",
	};
};

const main = async (event) => {
	const accessTokenJWT = event.accessToken;
	let sub = "";
	const params = {
		AccessToken: accessTokenJWT,
	};

	try {
		// Verify token and check if the user is an admin, if not, return error
		const response = await cognitoIdentityServiceProvider
			.getUser(params)
			.promise();

		// get the user sub from the response
		sub = response.UserAttributes.find((attr) => attr.Name === "sub").Value;
	} catch (err) {
		console.error(err);
		// If token is invalid, return error
		return {
			statusCode: 400,
			body: "Invalid token",
		};
	}

	// Update user role
	const response = await updatePhoneNumber(sub, event.phoneNumber);
	console.log(response);
	if (response.statusCode === 200) {
		const verificationResponse = await sendVerificationCode(accessTokenJWT);
		console.log(verificationResponse);
		return verificationResponse;
	}
	

	return response;
};

exports.handler = main;
