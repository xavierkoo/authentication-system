const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  region: "ap-southeast-1",
});

const validateAdmin = async (token) =>
  await new Promise((resolve, reject) => {
    const userJWT = {
      AccessToken: token,
    };
    cognitoidentityserviceprovider.getUser(userJWT, (err, data) => {
      if (err) {
        console.error("Error while getting user attributes:", err.message);
        reject({
          status: 402,
        });
      } else {
        try {
          const userAttributes = data.UserAttributes;
          const customRoleAttribute = userAttributes.find(
            (attribute) => attribute.Name === "custom:role"
          );
          if (
            customRoleAttribute.Value == "admin" ||
            customRoleAttribute.Value == "super_admin"
          ) {
            resolve({
              status: 200,
              role: customRoleAttribute.Value,
            });
          } else {
            resolve({
              status: 200,
              role: "user",
            });
          }
        } catch (err) {
          reject({
            status: 403,
          });
        }
      }
    });
  });

// exports.handler = main;
const main = async (event) => {
  try {
    let accessToken = "";
    if (
      event.queryStringParameters &&
      event.queryStringParameters.accessToken
    ) {
      accessToken = event.queryStringParameters.accessToken;
    }

    // If not found in queryStringParameters, check event.accessToken
    if (!accessToken && event.accessToken) {
      accessToken = event.accessToken;
    }

    const status = await validateAdmin(accessToken);

    const response = {
      statusCode: status.status,
      body: status.status === 200 ? "success" : "Access Denied",
      role: status.role,
      headers: {
        "Content-Type": "application/json", // You can customize content type
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Allow these HTTP methods
        "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow these headers in requests
        "Access-Control-Allow-Credentials": true, // Allow credentials (cookies, HTTP authentication)
        // Add any other custom headers as needed
      },
    };

    return response;
  } catch (err) {
    console.error("Error in Lambda function:", err);
    return {
      statusCode: 500,
      body: "Internal Server Error",
      headers: {
        "Content-Type": "application/json", // You can customize content type
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Allow these HTTP methods
        "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow these headers in requests
        "Access-Control-Allow-Credentials": true, // Allow credentials (cookies, HTTP authentication)
        // Add any other custom headers for error responses
      },
    };
  }
};

exports.handler = main;
