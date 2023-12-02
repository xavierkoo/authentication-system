import {FaPhoneAlt, FaUserSecret} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import {AccountContext} from '../services/Account';

const MfaPage = () => {
	const navigate = useNavigate();
	const {getSession, logout} = useContext(AccountContext) || {};

	const [bankLogo, setBankLogo] = useState<any>(null);
	const bankName = import.meta.env.VITE_BANK_NAME;

	//fetch bank details
	useEffect(() => {
		const fetchBankLogo = async () => {
			const logo = await import(`../assets/${bankName}.svg`);
			setBankLogo(logo.default);
		};

		fetchBankLogo();
	}, [bankName]);

	// For Step 1
	const [isNumberInput, setIsNumberInput] = useState(false);
	const [isVerifiedPhone, setIsVerifiedPhone] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState('');
	const [confirmationCode, setConfirmationCode] = useState('');
	const [optOut, setOptOut] = useState(false);

	// For Step 2
	const [userCode, setUserCode] = useState('');
	const [enabled, setEnabled] = useState(false);
	const [image, setImage] = useState('');
	const [showImage, setShowImage] = useState(false);

	// For Step 3
	const [mfaPreference, setMfaPreference] = useState('SOFTWARE_TOKEN_MFA');

	const [, , removeCookie] = useCookies();

	const handleLogout = () => {
		if (logout) {
			logout();
			sessionStorage.clear();
			localStorage.clear();
			removeCookie('userData');
			navigate('/');
		}
	};

	//* Phone MFA
	/**
	 * The function `updatePhoneNumber` is used to update a phone number by making a PATCH request to an
	 * API endpoint.
	 */
	const updatePhoneNumber = () => {
		const API =
			'https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/mfa-phone';

		if (getSession) {
			getSession().then(({accessToken, headers}) => {
				if (typeof accessToken !== 'string') {
					accessToken = accessToken.jwtToken;
				}

				try {
					fetch(API, {
						headers,
						method: 'PATCH',
						body: JSON.stringify({phoneNumber, accessToken}),
					}).then((data) => {
						if (data.status === 200) {
							setIsNumberInput(true);
							setPhoneNumber('');
						}
					});
				} catch (err) {}
			});
		}
		// Clear the input box
		setPhoneNumber('');
	};

	/**
	 * The function `verifyPhoneNumberCode` is used to verify a phone number by making a POST request to an
	 * API with a confirmation code and access token.
	 */
	const verifyPhoneNumberCode = () => {
		const API =
			'https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/mfa-phone';

		if (getSession) {
			getSession().then(({accessToken, headers}) => {
				if (typeof accessToken !== 'string') {
					accessToken = accessToken.jwtToken;
				}

				try {
					fetch(API, {
						headers,
						method: 'POST',
						body: JSON.stringify({
							code: confirmationCode,
							accessToken: accessToken,
						}),
					}).then((data) => {
						if (data.status === 200) {
							setIsVerifiedPhone(true);
							setConfirmationCode('');
						}
					});
				} catch (err) {}
			});
		}

		// Clear the input box
		setConfirmationCode('');
	};

	//* TOTP MFA
	const MAX_RETRIES = 20; // Set the maximum number of retries
	let retryCount = 0;

	/**
	 * The function `getQRCode` makes a request to an API to retrieve a QR code image, and retries the
	 * request if it receives a 403 status code.
	 */
	const getQRCode = () => {
		const API =
			'https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/mfa';

		if (getSession) {
			getSession().then(({accessToken, headers}) => {
				if (typeof accessToken !== 'string') {
					accessToken = accessToken.jwtToken;
				}
				const uri = `${API}?accessToken=${accessToken}`;
				const fetchWithRetry = () => {
					try {
						fetch(uri, {
							headers,
						})
							.then((data) => {
								if (data.status === 403) {
									if (retryCount < MAX_RETRIES) {
										retryCount++;
										setTimeout(fetchWithRetry, 1000); // Retry after a delay (1 second in this example)
									}
								} else {
									retryCount = 0; // Reset retry count on success \
									setShowImage(true);
									data.json().then(setImage);
								}
							})
							.catch(() => {});
					} catch (err) {}
				};
				fetchWithRetry(); // Initial fetch
			});
		}
	};

	/**
	 * The above function enables multi-factor authentication (MFA) for a user by making a POST request
	 * to an API endpoint with the user's access token and user code.
	 * @param {any} event - The `event` parameter is an object that represents the event that triggered
	 * the function. It is typically an event object that is passed to an event handler function. In this
	 * case, the function is an event handler for a form submission, so the `event` object would contain
	 * information about the form submission
	 */
	const enableMFA = (event: any) => {
		event.preventDefault();
		const API =
			'https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/mfa';

		if (getSession) {
			getSession().then(({user, accessToken, headers}) => {
				if (typeof accessToken !== 'string') {
					accessToken = accessToken.jwtToken;
				}

				const uri = `${API}?accessToken=${accessToken}&userCode=${userCode}`;

				/* Enable the MFA (TOTP) setting for the user */
				fetch(uri, {
					method: 'POST',
					headers,
				})
					.then((data) => data.json())
					.then((result) => {
						if (result.Status && result.Status === 'SUCCESS') {
							setEnabled(true); // Set state to enabled

							const settings = {
								PreferredMfa: true,
								Enabled: true,
							};

							user.setUserMfaPreference(null, settings, () => {}); // set the MFA Setting on Cognito to enabled and assign to TOTP Preferred

							alert('MFA Enabled!');

							if (optOut) {
								navigate('/cm-dashboard');
							}
						} else {
							// Handle errors alert if the user enters the wrong code
							if (
								result.errorType ===
								'EnableSoftwareTokenMFAException'
							) {
								alert('Incorrect 6-digit code!');
							} else if (
								result.errorType === 'InvalidParameterException'
							) {
								alert('Please provide a 6-digit number');
							}
						}
					})
					.catch(console.error);
			});
		}
	};

	/**
	 * The function `updateMfaPreference` updates the user's multi-factor authentication preference based
	 * on the selected option.
	 */
	const updateMfaPreference = () => {
		if (getSession) {
			getSession().then(({user}) => {
				let smsMfaPreferred = false;
				let softwareTokenMfaPreferred = false;

				if (mfaPreference === 'SMS_MFA') {
					smsMfaPreferred = true;
					softwareTokenMfaPreferred = !smsMfaPreferred;
				}

				if (mfaPreference === 'SOFTWARE_TOKEN_MFA') {
					softwareTokenMfaPreferred = true;
					smsMfaPreferred = !softwareTokenMfaPreferred;
				}

				const smsSettings = {
					PreferredMfa: smsMfaPreferred,
					Enabled: true,
				};

				const totpSettings = {
					PreferredMfa: softwareTokenMfaPreferred,
					Enabled: true,
				};

				user.setUserMfaPreference(smsSettings, totpSettings, () => {});

				alert('MFA Preference Updated!');

				navigate('/cm-dashboard');
			});
		}
	};

	useEffect(() => {
		if (getSession) {
			getSession().then(({mfaEnabled, phone_number_verified}) => {
				setEnabled(mfaEnabled);
				setIsVerifiedPhone(phone_number_verified === 'true');
			});
		}
	}, []);

	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-light nav-default">
				<div className="container">
					<img src={bankLogo} alt="bank-logo" width={100} />

					<Link
						className="nav-link"
						style={{color: 'black'}}
						to="/"
						onClick={handleLogout}
					>
						Logout
					</Link>
				</div>
			</nav>

			<div className="row justify-content-center align-items-center">
				<div className="col-1 col-md-3" />
				<div className="col col-md-6">
					<div className="row justify-content-center align-items-center">
						<div className="col">
							<h1 className="mt-5 ">
								Multi-Factor Authentication
							</h1>
						</div>
					</div>

					{/* Step 1 */}
					<div
						id="set-up-phone-number"
						className="row justify-content-center align-items-center border my-5 "
					>
						<h2
							className={
								isVerifiedPhone
									? 'py-3 px-3 card-success'
									: 'py-3 px-3 card-header'
							}
						>
							Step 1: Set up Phone Number MFA
						</h2>

						{!isVerifiedPhone && !optOut ? (
							<div>
								<div id="enter-phone-number">
									{/* Step 1A: Enter in Phone Number */}
									<div className="pt-3">
										Enter your phone number to set up MFA
										via SMS
									</div>
									{/* input box for tel */}
									<div className="input-group py-3">
										<span
											className="input-group-text"
											id="phone-number-input"
										>
											<FaPhoneAlt />{' '}
										</span>
										<input
											type="tel"
											className="form-control"
											placeholder="Phone Number"
											value={phoneNumber}
											onChange={(e) =>
												setPhoneNumber(e.target.value)
											}
										/>
										<button
											className="btn btn-primary"
											onClick={updatePhoneNumber}
										>
											Update
										</button>
									</div>
								</div>

								{isNumberInput && (
									<div id="verify-phone-number" className="">
										{/* Step 1B: Verify the Phone Number */}
										<div className="pt-3">
											Verify the Phone Number
										</div>
										<div className="input-group py-3">
											<span
												className="input-group-text"
												id="phone-confirmation-code"
											>
												<FaUserSecret />{' '}
											</span>
											<input
												type="text"
												className="form-control"
												placeholder="Enter 6-digit code"
												value={confirmationCode}
												onChange={(event) =>
													setConfirmationCode(
														event.target.value
													)
												}
											/>
											<button
												className="btn btn-primary"
												onClick={verifyPhoneNumberCode}
											>
												Verify
											</button>
										</div>
									</div>
								)}

								{/* Checkbox to opt out of SMS MFA */}
								<div className="">
									<div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											value=""
											id="opt-out"
											onChange={(event) =>
												setOptOut(event.target.checked)
											}
										/>
										<label
											className="form-check-label"
											htmlFor="opt-out"
										>
											I would like to opt out of SMS MFA
											for now
										</label>
									</div>
								</div>
							</div>
						) : (
							<div>
								{/* Display Phone Number MFA Opt out */}
								{optOut ? (
									<>
										<div
											id="phone-number-mfa-opt-out"
											className="pt-3"
										>
											<p className="">
												SMS Phone Number MFA Opt Out
											</p>
										</div>

										{/* Checkbox to opt out of SMS MFA */}
										<div className="">
											<div className="form-check">
												<input
													className="form-check-input"
													type="checkbox"
													value=""
													id="opt-out"
													onChange={(event) =>
														setOptOut(
															event.target.checked
														)
													}
													checked
												/>
												<label
													className="form-check-label"
													htmlFor="opt-out"
												>
													I would like to opt out of
													SMS MFA
												</label>
											</div>
										</div>
									</>
								) : (
									// Display Phone Number MFA Verified
									<div id="phone-number-verified">
										<p className="">
											SMS Phone Number Verified
										</p>
									</div>
								)}
							</div>
						)}

						{/* ----End of Step 1 */}
					</div>

					{/* Step 2 */}
					<div
						id="set-up-totp"
						className="row justify-content-center align-items-center border my-5"
					>
						<h2
							className={
								enabled
									? 'py-3 px-3 card-success'
									: 'py-3 px-3 card-header'
							}
						>
							Step 2: Set up TOTP MFA
						</h2>

						<div id="enter-totp">
							{!enabled && (
								<div>
									<div className="pt-3">
										Scan TOTP Setup QR Code to set up MFA
									</div>
									<ol>
										<li>Download Google Authenticator</li>
										<li>Click the Generate Setup QR</li>
										<li>
											Scan the Setup QR through your
											Google Authenticator
										</li>
										<li>
											Key code in the G2T4 Authenticator
											associated to confirm
										</li>
									</ol>
								</div>
							)}

							{enabled ? (
								<div>
									<p>Time-based OTP MFA is set up</p>
								</div>
							) : showImage ? (
								<div>
									<img src={image} />

									{/* Step 2B: Submit TOTP Confirmation Code */}
									<form onSubmit={enableMFA}>
										<div className="input-group">
											<input
												className="form-control"
												placeholder="Enter 6-digit code"
												value={userCode}
												onChange={(event) =>
													setUserCode(
														event.target.value
													)
												}
												required
											/>
											<button
												className="btn btn-primary"
												type="submit"
											>
												Confirm Code
											</button>
										</div>
									</form>
								</div>
							) : (
								<button
									className="btn btn-primary"
									onClick={getQRCode}
								>
									{/* Step 2A: Generate TOTP QR */}
									Enable MFA
								</button>
							)}
						</div>

						{/* ----End of Step 2 */}
					</div>

					{optOut && enabled && (
						<div>
							<button
								className="btn btn-primary defaultBtn"
								onClick={() => {
									navigate('/cm-dashboard');
								}}
							>
								Confirm
							</button>
						</div>
					)}

					{/* Step 3 */}
					{!optOut && enabled && isVerifiedPhone && (
						<div
							id="select-mfa-preference"
							className="row justify-content-center align-items-center border my-5 pb-5"
						>
							<h2 className="py-3 px-3 card-header">
								Step 3: Choose MFA Preference
							</h2>

							{/* Step 3A: Select Preference */}
							<div id="select-preference">
								<p className="">
									To secure your login identities, we will use
									OTP verification
								</p>
								<p className="">
									Where would you like to receive it?
								</p>

								{/* 2 Radio buttons for selection between SMS or TOTP box */}
								<div className="form-check">
									<input
										className="form-check-input"
										type="radio"
										name="mfa-preference-selector"
										id="sms-radio"
										value="SMS_MFA"
										onChange={(event) =>
											setMfaPreference(event.target.value)
										}
									/>
									<label
										className="form-check-label"
										htmlFor="sms-radio"
									>
										SMS
									</label>
								</div>
								<div className="form-check">
									<input
										className="form-check-input"
										type="radio"
										name="mfa-preference-selector"
										id="totp-radio"
										value="SOFTWARE_TOKEN_MFA"
										onChange={(event) =>
											setMfaPreference(event.target.value)
										}
										defaultChecked
									/>
									<label
										className="form-check-label"
										htmlFor="totp-radio"
									>
										TOTP
									</label>
								</div>

								<button
									className="btn btn-primary defaultBtn"
									onClick={() => updateMfaPreference()}
								>
									Update
								</button>
							</div>

							{/* ----End of Step 3 */}
						</div>
					)}
				</div>
				<div className="col-1 col-md-3" />
			</div>
		</>
	);
};

export default MfaPage;
