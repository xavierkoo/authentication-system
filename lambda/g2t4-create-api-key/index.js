const { APIGateway, CognitoIdentityServiceProvider } = require("aws-sdk");

const API = new APIGateway({ region: "ap-southeast-1" });
const cognito = new CognitoIdentityServiceProvider({
  region: "ap-southeast-1",
});

const generateApiKey = async (sub) => {
  return await new Promise((resolve, reject) => {
    const params = {
      name: `g2t4-auth-api-${sub}`, //need change based on API Gateway name
      generateDistinctId: true,
      enabled: true,
      stageKeys: [
        {
          restApiId: "nu0bf8ktf0",
          stageName: "dev",
        },
      ],
    };

    API.createApiKey(params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const addToPlan = async (keyId) => {
  return await new Promise((resolve, reject) => {
    const params = {
      keyId,
      keyType: "API_KEY",
      usagePlanId: "o9fufq",
    };

    API.createUsagePlanKey(params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const saveApiKey = async (sub, apikey) => {
  return await new Promise((resolve, reject) => {
    const params = {
      UserAttributes: [
        {
          Name: "custom:apikey",
          Value: apikey,
        },
      ],
      Username: sub,
      UserPoolId: "ap-southeast-1_crimtf1ce",
    };

    cognito.adminUpdateUserAttributes(params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const main = async (event) => {
  console.log("Event:", event);

  const sub = event.sub;
  const { id, value: apikey } = await generateApiKey(sub);
  await addToPlan(id);
  await saveApiKey(sub, apikey);
  // }

  return event;
};

exports.handler = main;
