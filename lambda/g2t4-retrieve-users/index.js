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
          }
        } catch (err) {
          reject({
            status: 403,
          });
        }
      }
    });
  });

const retrieveUsers = async (bankIdentifier) =>
  await new Promise((resolve, reject) => {
    const params = {
      UserPoolId: "ap-southeast-1_crimtf1ce",
    };
    cognitoidentityserviceprovider.listUsers(params, (err, data) => {
      if (err) {
        console.error("Error while listing users:", err.message);
        reject({
          success: false,
          message: "No users found.",
        });
      } else {
        try {
          const filteredUsers = data.Users.filter((user) => {
            const bankNameAttribute = user.Attributes.find(
              (attr) => attr.Name === "custom:bank_name"
            );
            return (
              bankNameAttribute && bankNameAttribute.Value === bankIdentifier
            );
          });

          const usersData = filteredUsers.map((user) => {
            const emailAttribute = user.Attributes.find(
              (attr) => attr.Name === "email"
            );
            const givenNameAttribute = user.Attributes.find(
              (attr) => attr.Name === "given_name"
            );
            const familyNameAttribute = user.Attributes.find(
              (attr) => attr.Name === "family_name"
            );
            const role = user.Attributes.find(
              (attr) => attr.Name === "custom:role"
            );
            const status = user.Attributes.find(
              (attr) => attr.Name === "custom:account_status"
            );

            let userStatus = "";
            if (status.Value == "pending") {
              userStatus = "Pending";
            } else {
              userStatus = "Active";
            }

            let roleStatus = "";
            if (!role) {
              roleStatus = "User";
            } else {
              roleStatus =
                role.Value === "super_admin"
                  ? "Super Admin"
                  : role.Value === "admin"
                  ? "Admin"
                  : "User";
            }

            return {
              Username: user.Username,
              email: emailAttribute.Value ? emailAttribute.Value : "",
              given_name: givenNameAttribute.Value
                ? givenNameAttribute.Value
                : "",
              family_name: familyNameAttribute.Value
                ? familyNameAttribute.Value
                : "",
              UserStatus: userStatus ? userStatus : "",
              UserRole: roleStatus ? roleStatus : "",
              UserCreateDate: user.UserCreateDate ? user.UserCreateDate : "",
              UserLastModifiedDate: user.UserLastModifiedDate
                ? user.UserLastModifiedDate
                : "",
            };
          });

          resolve({
            success: true,
            message: "User data retrieved successfully.",
            data: usersData,
          });
        } catch (err) {
          console.error("Error while processing user data:", err);
          reject({
            success: false,
            message: "No users found.",
          });
        }
      }
    });
  });

const main = async (event) => {
  let accessToken = "";
  if (event.queryStringParameters && event.queryStringParameters.accessToken) {
    accessToken = event.queryStringParameters.accessToken;
  }

  // If not found in queryStringParameters, check event.accessToken
  if (!accessToken && event.accessToken) {
    accessToken = event.accessToken;
  }

  let bankIdentifier = "";
  if (
    event.queryStringParameters &&
    event.queryStringParameters.bankIdentifier
  ) {
    bankIdentifier = event.queryStringParameters.bankIdentifier;
  }

  if (!bankIdentifier && event.bankIdentifier) {
    bankIdentifier = event.bankIdentifier;
  }

  const status = await validateAdmin(accessToken);
  const users = await retrieveUsers(bankIdentifier);
  const response = {
    statusCode: status.role,
    users: users,
  };
  return response;
};

exports.handler = main;
