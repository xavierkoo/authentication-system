const AWS = require("aws-sdk");

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
	region: "ap-southeast-1",
});

const updateRole = async (sub, role) => {
	const params = {
		UserPoolId: "ap-southeast-1_crimtf1ce",
	};

	if (role !== "admin" && role !== "user" && role !== "super_admin") {
		return {
			statusCode: 400,
			body: "Invalid role",
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
						Name: "custom:role",
						Value: role,
					},
				],
			})
			.promise();

		return {
			statusCode: 200,
			body: "User attribute updated successfully",
		};
	} catch (err) {
		console.error(err);
		return {
			statusCode: 500,
			body: "Error updating user attribute",
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
		if (event.role === "super_admin" && initatorRole !== "super_admin") {
			return {
				statusCode: 403,
				body: "Forbidden",
			};
		}

		// Only super_admin can update admin role
		if (event.role === "admin" && initatorRole !== "super_admin") {
			return {
				statusCode: 403,
				body: "Forbidden",
			};
		}

		// Only admin and super_admin can update user role
		if (
			event.role === "user" &&
			initatorRole !== "admin" &&
			initatorRole !== "super_admin"
		) {
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
	const response = await updateRole(event.sub, event.role);
	console.log(response);

	return response;
};

exports.handler = main;
