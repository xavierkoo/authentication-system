import { FaLock, FaRegEye, FaRegEyeSlash, FaAt } from "react-icons/fa";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../services/Account";

type SignInContainerProps = {
	currentUserSub: string;
	targetSub: string;
	role: string;
	updateCustomers: any;
	closePopup: any;
	isDeleteAccount?: boolean;
	isChangePassword?: boolean;
};

const SignInPopUp = ({
	currentUserSub,
	targetSub,
	role,
	updateCustomers,
	closePopup,
	isDeleteAccount = false,
	isChangePassword = false,
}: SignInContainerProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const { authenticate, getSession, deleteAccount, deleteSelectedAccount } =
		useContext(AccountContext) || {};
	const navigate = useNavigate();

	/**
	 * The function `validateEmail` checks if an email address is valid by ensuring it has a non-empty
	 * local part and domain part separated by an '@' symbol.
	 * @param {string} email - The email parameter is a string that represents an email address.
	 * @returns a boolean value. It returns true if the email is valid (contains exactly one '@' symbol and
	 * has non-empty strings before and after the '@' symbol), and false otherwise.
	 */
	function validateEmail(email: string) {
		var emailCheck = email.split("@");
		return (
			emailCheck.length === 2 &&
			emailCheck[0].length > 0 &&
			emailCheck[1].length > 0
		);
	}

	/**
	 * The function `requireMFASetup` is an asynchronous function that handles the authentication process
	 * and verifies if the user is an admin before updating their role and retrieving user data.
	 * @returns The function does not explicitly return anything.
	 */
	async function requireMFASetup() {
		if (isChangePassword) {
			if (authenticate) {
				try {
					const data: any = await authenticate(email, password);
					// data is supposed to be the cognito user
					if (data.accessToken.payload.sub !== currentUserSub) {
						alert("You are not the current user!");
						closePopup();
						return;
					} else {
						navigate("/password", {
							state: {
								isChangePassword: true,
								isVerified: false,
								email: email,
							},
						});
						return;
					}
				} catch (err) {
					console.error("Failed to login!", err);
				}
			}
		}
		if (isDeleteAccount) {
			if (deleteSelectedAccount && targetSub !== "") {
				const response = await deleteSelectedAccount(
					email,
					password,
					currentUserSub,
					targetSub
				);
				if (response) {
					updateCustomers(response);
					closePopup();
					alert("Account deleted successfully!");
				} else {
					alert("Error deleting account!");
				}
			} else if (deleteAccount) {
				await deleteAccount(email, password, currentUserSub);
				window.localStorage.clear();
				window.sessionStorage.clear();
				navigate("/");
			}
			return;
		}
		if (authenticate && !isChangePassword) {
			try {
				const data: any = await authenticate(email, password);
				// data is supposed to be the cognito user
				if (data.accessToken.payload.sub !== currentUserSub) {
					alert("You are not the current user!");
					closePopup();
					return;
				}

				//verify if user is admin
				if (getSession) {
					const { headers } = await getSession();
					const accessToken = data.accessToken.jwtToken;
					const API =
						"https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/validateAdmin";
					const uri = `${API}?accessToken=${accessToken}`;
					try {
						const response = await fetch(uri, { headers });

						if (!response.ok) {
							throw new Error("Network response was not ok");
						}
						const data = await response.json();

						if (
							data.role === "admin" ||
							data.role === "super_admin"
						) {
							//if isAdmin is true and isSuperAdmin is false, role equals to admin. if isAdmin is false and isSuperAdmin is true, role equals to super_admin. if both are false, role equals to user
							const API =
								"https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/update-role";
							//try catch to invoke the api with method patch and send headers and requst body
							try {
								let sub = targetSub;
								const response = await fetch(API, {
									method: "PATCH",
									headers: headers,
									body: JSON.stringify({
										sub,
										role,
										accessToken,
									}),
								});

								if (response.ok) {
									const API =
										"https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/retrieveuser";
									const uri = `${API}?accessToken=${accessToken}`;
									try {
										const response = await fetch(uri, {
											headers,
										});
										if (response.ok) {
											const data = await response.json();
											updateCustomers(data.users.data);
											closePopup();

											// setAdminType(data.statusCode);
										} else {
											// Handle the error
											console.error(
												"Error while retrieving user data"
											);
										}
									} catch (error) {
										console.error(
											"Error while validating admin:",
											error
										);
									}
								}
							} catch (error) {
								console.error(
									"Error while validating admin:",
									error
								);
							}
						} else {
							//go to home if user is not admin
							alert("You are not an admin!");
							navigate("/");
						}
					} catch (error) {
						// Handle errors here
						console.error(error);
					}
				}
			} catch (err) {
				console.error("Failed to login!", err);
			}
		}
	}

	return (
		<>
			<div
				id="signInContainer"
				className="col-md-12 col-12 d-flex align-items-center flex-column justify-content-center"
			>
				<h1 className="mb-3">Sign In</h1>
				<div className="d-flex flex-column gap-3 w-100 align-items-center justify-content-center">
					<div className="input-group mb-3 w-75">
						<span className="input-group-text" id="signin-email">
							<FaAt />
						</span>
						<input
							type="email"
							className="form-control"
							placeholder="Email"
							aria-label="email"
							aria-describedby="signin-email"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="input-group mb-3 w-75">
						<span className="input-group-text" id="basic-addon2">
							<FaLock />
						</span>
						<input
							type={showPassword ? "text" : "password"}
							className="form-control"
							placeholder="Password"
							aria-label="Password"
							aria-describedby="basic-addon2"
							onChange={(event) =>
								setPassword(event.target.value)
							}
						/>
						<button
							className="input-group-text"
							id="seePasswordBtn"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
						</button>
					</div>
				</div>
				<button
					className={`defaultBtn ${
						validateEmail(email) ? "" : "disabled"
					}`}
					onClick={() => validateEmail(email) && requireMFASetup()}
					disabled={!validateEmail(email)}
				>
					Sign In
				</button>{" "}
			</div>
		</>
	);
};

export default SignInPopUp;
