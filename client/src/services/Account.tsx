import {createContext, ReactNode} from 'react';
import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import {CognitoIdentityProvider} from '@aws-sdk/client-cognito-identity-provider';
import Pool from './UserPool';
import {CognitoJwtVerifier} from 'aws-jwt-verify';

// Define the type for the context value
type AccountContextValue = {
	authenticate: (Username: string, Password: string) => Promise<unknown>;
	getSession: () => Promise<any>;
	logout: () => void;
	deleteAccount: (
		Username: string,
		Password: string,
		CurrentUserSub: string
	) => void;
	deleteSelectedAccount: (
		Username: string,
		Password: string,
		CurrentUserSub: string,
		targetSub: string
	) => Promise<any>;
};

// Create a new instance of the Cognito JWT Verifier
const verifier = CognitoJwtVerifier.create({
	userPoolId: Pool.getUserPoolId(),
	tokenUse: 'access',
	clientId: Pool.getClientId(),
});

// Create a new instance of the Cognito Identity Service Provider
const cognito = new CognitoIdentityProvider({
	region: 'ap-southeast-1',
});

// Initialize the context
const AccountContext = createContext<AccountContextValue | undefined>(
	undefined
);

const Account: React.FC<{children: ReactNode}> = (props) => {
	/**
	 * The `getSession` function retrieves the user session, verifies the access token, retrieves user
	 * attributes, checks if MFA is enabled, and returns the necessary data for authentication.
	 */
	const getSession = async () =>
		await new Promise<void>((resolve, reject) => {
			const user = Pool.getCurrentUser();

			if (user) {
				// Get the session from the user
				user.getSession(async (err: any, session: any) => {
					if (err) {
						reject();
					} else {
						/* Verifying the validity of the access token (JWT) obtained from the user's session. */
						const accessToken = session.accessToken.jwtToken;
						try {
							verifier.verify(
								accessToken // the JWT as string
							);
							console.log('Token is valid!');
						} catch {
							console.log('Token not valid!');
						}

						/*  It uses the `getUserAttributes` method of the `CognitoUser` object to get the attributes. */
						const attributes = await new Promise<
							Record<string, string>
						>((resolve, reject) => {
							user.getUserAttributes((err, attributes) => {
								if (err) {
									reject(err);
								} else {
									const results: Record<string, string> = {};

									for (let attribute of attributes || []) {
										const {Name, Value} = attribute;
										results[Name] = Value;
									}

									resolve(results);
								}
							});
						});

						/* Checking whether Multi-Factor Authentication (MFA) is enabled for the user. */
						const mfaEnabled = await new Promise((resolve) => {
							cognito.getUser(
								{
									AccessToken: accessToken,
								},
								(err: any, data: any) => {
									if (err) resolve(false);
									else
										resolve(
											data.UserMFASettingList &&
												data.UserMFASettingList.includes(
													'SOFTWARE_TOKEN_MFA'
												)
										);
								}
							);
						});

						/* Checking whether Multi-Factor Authentication (MFA) is enabled for the user. */
						const preferredMFA = await new Promise((resolve) => {
							cognito.getUser(
								{
									AccessToken: accessToken,
								},
								(err: any, data: any) => {
									if (err) resolve(false);
									else resolve(data.PreferredMfaSetting);
								}
							);
						});

						/* Retrieving the JSON Web Token (JWT) from the session's ID token. */
						const token = session.getIdToken().getJwtToken();

						resolve({
							user,
							accessToken,
							mfaEnabled,
							preferredMFA,
							headers: {
								'x-api-key': attributes['custom:apikey'],
								Authorization: token,
							},
							...session,
							...attributes,
						});
					}
				});
			} else {
				reject();
			}
		});

	/**
	 * The `authenticate` function is used to authenticate a user with a username and password, using AWS
	 * Cognito, and handles scenarios such as new password requirement and multi-factor authentication.
	 * @param {string} Username - The `Username` parameter is a string that represents the username of
	 * the user trying to authenticate. It is used to create a new `CognitoUser` object.
	 * @param {string} Password - The `Password` parameter is a string that represents the user's
	 * password. It is used to authenticate the user's credentials when calling the `authenticateUser`
	 * method of the `CognitoUser` object.
	 */

	const authenticate = (Username: string, Password: string) => {
		return new Promise((resolve, reject) => {
			const userState = new CognitoUser({Username, Pool});
			const authDetailState = new AuthenticationDetails({
				Username,
				Password,
			});

			userState.authenticateUser(authDetailState, {
				onSuccess: (data) => {
					resolve(data);
				},

				onFailure: (err) => {
					console.error('onFailure:', err);
					reject(err);
				},

				newPasswordRequired: (data) => {
					// Handle the new password requirement here
					// For now, we are resolving it, but you should prompt the user for a new password
					resolve(data);
				},

				totpRequired: () => {
					alert('Please check your phone for the Authenticator code');
					const token = prompt(
						'Please enter your 6-digit code from your OAUTH token'
					);
					if (token) {
						userState.sendMFACode(
							token,
							{
								onSuccess: (data) => {
									resolve(data);
								},
								onFailure: (e) => {
									console.error('onFailure:', e);
									alert('Incorrect code!');
									reject(e);
								},
							},
							'SOFTWARE_TOKEN_MFA'
						);
					}
				},

				mfaRequired: () => {
					alert('Please check your phone for a 6-digit code');
					const token = prompt(
						'Please enter your 6-digit code from your phone'
					);
					if (token) {
						userState.sendMFACode(
							token,
							{
								onSuccess: (data) => {
									resolve(data);
								},
								onFailure: (e) => {
									console.error('onFailure:', e);
									alert('Incorrect code!');
									reject(e);
								},
							},
							'SMS_MFA'
						);
					}
				},
			});
		});
	};

	/**
	 * The `logout` function signs out the current user if there is one.
	 */
	const logout = () => {
		const user = Pool.getCurrentUser();
		if (user) {
			window.localStorage.clear();
			window.sessionStorage.clear();
			user.signOut();
		}
	};

	/**
	 * The `deleteAccount` function deletes the current user if there is one.
	 */
	const deleteAccount = async (
		Username: string,
		Password: string,
		CurrentUserSub: string
	) => {
		await new Promise(async (resolve, reject) => {
			try {
				const cognitoUser = new CognitoUser({
					Username,
					Pool,
				});
				const authDetailState = new AuthenticationDetails({
					Username,
					Password,
				});
				cognitoUser.authenticateUser(authDetailState, {
					onSuccess: () => {},
					onFailure: (err) => {
						console.error('onFailure:', err);
						reject(err);
					},

					totpRequired: () => {
						const token = prompt(
							'Please enter your 6-digit OAUTH token'
						);
						if (token) {
							cognitoUser.sendMFACode(
								token,
								{
									onSuccess: (data: any) => {
										if (
											data.accessToken.payload.sub !==
											CurrentUserSub
										) {
											alert(
												'You are not the current user!'
											);
											logout();
											resolve(true);
											return;
										}
										cognitoUser.deleteUser((err, data) => {
											if (err) {
												console.error(
													'Error deleting user:',
													err.message ||
														JSON.stringify(err)
												);
											} else {
												resolve(data);
											}
										});
									},
									onFailure: (e) => {
										console.error('onFailure:', e);
										alert('Incorrect code!');
										reject(e);
									},
								},
								'SOFTWARE_TOKEN_MFA'
							);
						}
					},

					mfaRequired: () => {
						const token = prompt(
							'Please enter your 6-digit MFA passcode'
						);
						if (token) {
							cognitoUser.sendMFACode(
								token,
								{
									onSuccess: (data: any) => {
										if (
											data.accessToken.payload.sub !==
											CurrentUserSub
										) {
											alert(
												'You are not the current user!'
											);
											logout();
											resolve(true);
											return;
										}
										cognitoUser.deleteUser((err, data) => {
											if (err) {
												console.error(
													'Error deleting user:',
													err.message ||
														JSON.stringify(err)
												);
											} else {
												resolve(data);
											}
										});
									},
									onFailure: (e) => {
										console.error('onFailure:', e);
										alert('Incorrect code!');
										reject(e);
									},
								},
								'SMS_MFA'
							);
						}
					},
				});
			} catch (err) {
				console.error('Authentication failed:', err);
				reject(err);
			}
		});
	};

	const AUTH_BASE_URL =
		'https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev';

	const authenticateUser = async (
		username: string,
		password: string
	): Promise<any> => {
		const result = await authenticate(username, password);
		if (!result) {
			throw new Error('Authentication failed');
		}
		return result;
	};

	const verifyCurrentUser = (
		accessTokenSub: string,
		currentUserSub: string
	): void => {
		if (accessTokenSub !== currentUserSub) {
			alert('You are not the current user!');
			logout();
			throw new Error('Current user mismatch');
		}
	};

	const deleteSelectedAccount = async (
		username: string,
		password: string,
		currentUserSub: string,
		targetSub: string
	): Promise<any> => {
		try {
			const authResult = await authenticateUser(username, password);
			verifyCurrentUser(
				authResult.accessToken.payload.sub,
				currentUserSub
			);

			const sessionRes: any = await getSession();
			const headers = sessionRes.headers;
			const accessToken = authResult.accessToken.jwtToken;

			const validationResponse = await fetch(
				`${AUTH_BASE_URL}/validateAdmin?accessToken=${accessToken}`,
				{headers}
			);
			if (!validationResponse.ok) {
				throw new Error('Failed to validate admin status');
			}
			const {role} = await validationResponse.json();

			if (role === 'super_admin') {
				const deleteResponse = await fetch(
					`${AUTH_BASE_URL}/delete-user`,
					{
						method: 'DELETE',
						headers,
						body: JSON.stringify({targetSub, role, accessToken}),
					}
				);

				if (!deleteResponse.ok) {
					throw new Error('Failed to delete user');
				}

				const retrieveResponse = await fetch(
					`${AUTH_BASE_URL}/retrieveuser?accessToken=${accessToken}`,
					{headers}
				);
				if (!retrieveResponse.ok) {
					console.error('Error while retrieving user data');
					throw new Error(
						'Failed to retrieve user data after deletion'
					);
				}

				const usersData = await retrieveResponse.json();
				return usersData.users.data;
			} else {
				alert('You are not an admin!');
				throw new Error('Unauthorized access: User is not an admin');
			}
		} catch (error) {
			console.error('An error occurred in deleteSelectedAccount:', error);
			throw error;
		}
	};

	return (
		<AccountContext.Provider
			value={{
				authenticate,
				getSession,
				logout,
				deleteAccount,
				deleteSelectedAccount,
			}}
		>
			{props.children}
		</AccountContext.Provider>
	);
};

export {Account, AccountContext};
