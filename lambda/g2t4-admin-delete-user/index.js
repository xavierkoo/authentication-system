const AWS = require("aws-sdk");

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
	region: "ap-southeast-1",
});

const deleteUser = async (username) => {
	const params = {
		UserPoolId: "ap-southeast-1_crimtf1ce",
        Username: username,
	};


    try {
        await cognitoIdentityServiceProvider.adminDeleteUser(params).promise();
        console.log(`User ${username} deleted successfully.`);
        // Return a success response
        return {
            statusCode: 200,
            body: JSON.stringify('User deleted successfully.'),
        };
    } catch (error) {
        console.error('Error deleting user:', error);
        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify('Error deleting user.'),
        };
    }
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

		const initatorRole = response.UserAttributes.find(
			(attribute) => attribute.Name === "custom:role"
		).Value;

		// Only super_admin can update super_admin role
		if (initatorRole !== "super_admin") {
			return {
				statusCode: 403,
				body: "Forbidden",
			};
		}

	} catch (err) {
		console.error(err);
		// If token is invalid, return error
		return {
			statusCode: 400,
			body: "Invalid token",
		};
	}

	// Update user role
    console.log(event);
    console.log(event.targetSub);
	const response = await deleteUser(event.targetSub);
	console.log(response);

	return response;
};

exports.handler = main;
