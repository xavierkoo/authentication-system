const AWS = require("aws-sdk");
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  region: "ap-southeast-1",
});

const validateEmailAndBirthdate = (emailParam, birthdateParam) => {
  const params = {
    UserPoolId: "ap-southeast-1_crimtf1ce",
    Username: emailParam, // Assuming the email is the username
  };

  return new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.adminGetUser(params, (err, userData) => {
      if (err) {
        console.error("Error while fetching user data:", err);
        reject({
          success: false,
          message: "Email or birthdate verification failed.",
        });
      } else {
        const emailAttribute = userData.UserAttributes.find(
          (attr) => attr.Name === "email"
        );
        const birthdateAttribute = userData.UserAttributes.find(
          (attr) => attr.Name === "birthdate"
        );

        if (
          emailAttribute &&
          birthdateAttribute &&
          emailAttribute.Value === emailParam &&
          birthdateAttribute.Value === birthdateParam
        ) {
          console.log(
            `User: ${userData.Username}, Email: ${emailAttribute.Value}, Date of Birth: ${birthdateAttribute.Value}`
          );
          resolve({ success: true, message: "Email and birthdate match." });
        } else {
          reject({
            success: false,
            message: "Email or birthdate verification failed.",
          });
        }
      }
    });
  });
};

const main = async (event) => {
  console.log("Event:", event);
  try {
    const result = await validateEmailAndBirthdate(
      event.email,
      event.birthdate
    );
    return result;
  } catch (error) {
    return error;
  }
};

exports.handler = main;
