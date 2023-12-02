import { CognitoUserPool } from "amazon-cognito-identity-js";

/* The `poolData` constant is an object that contains the configuration data for the Cognito user pool. */
const poolData = {
	UserPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
	ClientId: import.meta.env.VITE_AWS_CLIENT_ID,
};

export default new CognitoUserPool(poolData);
