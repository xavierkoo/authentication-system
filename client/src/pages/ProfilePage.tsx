import {useState, useContext, useEffect} from 'react';
import NavBar from '../components/navigation/NavBar';
import {AiOutlineClose} from 'react-icons/ai';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {AccountContext} from '../services/Account';
import {useCookies} from 'react-cookie';
import SignInPopUp from '../components/SignInPopup';
import UserLogoutPopup from '../components/UserLogout';
import {maskPhone} from '../utils/maskPhone';
interface UserDataProps {
	sub: string;
	name: string;
	email: string;
	given_name: string;
	family_name: string;
	birthdate: string;
	gender: string;
	phone_number: string;
}

const ProfilePage = () => {
	const [searchParams] = useSearchParams();
	const [userData, setUserData] = useState<UserDataProps>();
	const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false);
	const [showChangeConfirmPopup, setShowChangeConfirmPopup] = useState(false);
	const [cookie, setCookie, removeCookie] = useCookies();
	const [currentUserSub, setCurrentUserSub] = useState<string>('');
	const [showSignInPopUp, setShowSignInPopUp] = useState(false);
	const [isCognitoUser, setIsCognitoUser] = useState(false);
	const [mfaPreference, setMfaPreference] = useState('');
	const [mfaEnabled, setMfaEnabled] = useState(false);
	const [isPhoneVerified, setIsPhoneVerified] = useState(false);
	const [changePassword, setChangePassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {getSession, logout} = useContext(AccountContext) || {};
	const fullUrl = window.location.href;

	const urlObj = new URL(fullUrl);
	const baseUrl = urlObj.protocol + '//' + urlObj.host + urlObj.pathname;

	const navigate = useNavigate();

	const handleDeleteButtonClick = () => {
		setShowDeleteConfirmPopup(true);
	};

	const handleChangeButtonClick = () => {
		setShowChangeConfirmPopup(true);
	};

	const handleDeleteConfirmButtonClick = () => {
		setShowSignInPopUp(true);
	};

	const handleChangeConfirmButtonClick = () => {
		setChangePassword(true);
	};

	const closePopup = () => {
		setShowSignInPopUp(false);
		setShowDeleteConfirmPopup(false);
		setShowChangeConfirmPopup(false);
	};

	const handleLogout = () => {
		if (logout) {
			logout();
			sessionStorage.clear();
			localStorage.clear();
			removeCookie('userData');
			navigate('/');
		}
	};

	const checkForData = () => {
		const allKeys = Object.keys(localStorage);
		const isCognitoKeyPresent = allKeys.some((key) =>
			key.startsWith('CognitoIdentityServiceProvider')
		); // Check if any key matches the pattern used by Cognito Identity Service Provider
		setIsCognitoUser(isCognitoKeyPresent);

		if (getSession) {
			getSession()
				.then(async (sessionData: any) => {
					// const accessToken = sessionData.accessToken.jwtToken;
					setCurrentUserSub(sessionData.sub);
					setMfaEnabled(sessionData.mfaEnabled);
					setMfaPreference(sessionData.preferredMFA);
					setIsPhoneVerified(
						sessionData.phone_number_verified === 'true'
					);

					setUserData({
						sub: sessionData.sub,
						name:
							sessionData.given_name +
							' ' +
							sessionData.family_name,
						email: sessionData.email,
						given_name: sessionData.given_name,
						family_name: sessionData.family_name,
						birthdate: sessionData.birthdate,
						gender: '',
						phone_number: maskPhone(sessionData.phone_number),
					});
				})
				.catch(() => {
					// if no accessToken then user is not logged in
					// console.error('Error while getting access token:', error);
					if (cookie.userData) {
						setUserData(cookie.userData);
					} else if (searchParams.get('code') != null) {
						getUserData();
					} else {
						//NOT LOGGED IN IN ANY WAY
						navigate('/');
					}
				});
		}
	};

	const getUserData = async () => {
		setIsLoading(true);
		//get data from session
		if (searchParams.get('code') === null) return;
		if (userData != undefined) return;
		try {
			const response = await fetch(
				'https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/g2t4_auth_token',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						code: searchParams.get('code'),
						url: baseUrl,
					}),
				}
			);
			if (response.ok) {
				const data = await response.json();
				try {
					const verifyTokenResponse = await fetch(
						'https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/g2t4-verifytoken',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								token: data.access_token,
							}),
						}
					);
					if (!verifyTokenResponse.ok) {
						alert('Invalid Token');
						setIsLoading(false);
					} else {
						sessionStorage.setItem(
							'access_token',
							data.access_token
						);
						try {
							const response2 = await fetch(
								'https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/auth_userprofile',
								{
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({
										accessToken: data.access_token,
									}),
								}
							);
							if (response2.ok) {
								const userData = await response2.json();
								setIsLoading(false);
								setUserData({
									...userData,
									phone_number: maskPhone(
										userData['phone_number']
									),
								});
								setCookie('userData', userData, {
									path: '/',
									maxAge: 3600,
								});
							}
							setIsLoading(false);
						} catch (error) {
							setIsLoading(false);
						}
					}
				} catch {
					setIsLoading(false);
				}
			} else {
				console.error(
					`Failed to fetch access token. Status code: ${response.status}`
				);
				setIsLoading(false);
			}
		} catch (error) {
			console.error('Error while fetching access token:', error);
			setIsLoading(false);
		}
		setIsLoading(false);
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
			});
		}
	};

	const initialFetch = async () => {
		await getUserData();
		setIsLoading(false);
		checkForData();
	};

	useEffect(() => {
		initialFetch();
	}, []);

	return (
		<>
			<UserLogoutPopup />
			<NavBar />
			<div
				className={`overlay ${
					showSignInPopUp ||
					showDeleteConfirmPopup ||
					showChangeConfirmPopup
						? 'active'
						: ''
				}`}
			></div>

			<div className="container bg-light shadow-sm mt-4 p-4">
				<div className="row p-3">
					<div className="col-md-4 col-4">
						<h2>Profile</h2>
					</div>
					<div className="col-8 d-flex justify-content-end">
						<Link to="/">
							<button
								className="defaultBtn"
								style={{width: 'auto'}}
								onClick={handleLogout}
							>
								Log Out
							</button>
						</Link>
					</div>
				</div>
				{isLoading ? (
					<div className="d-flex justify-content-center text-center w-100">
						<h2>Loading...</h2>
					</div>
				) : (
					<table className="table h-50 text-center">
						<tbody>
							<tr>
								<th className="text-start p-3">Full Name</th>
								<td className="text-start p-3">
									{userData?.name}
								</td>
							</tr>
							<tr>
								<th className="text-start p-3">Email</th>
								<td className="text-start p-3">
									{userData?.email}
								</td>
							</tr>
							<tr>
								<th className="text-start p-3">Phone Number</th>
								<td className="text-start p-3">
									{userData?.phone_number
										? userData.phone_number
										: 'Not Set'}

									{isCognitoUser && !isPhoneVerified && (
										<span>
											&nbsp; &nbsp; &nbsp;
											<a href="/mfa">Finish Set-up</a>
										</span>
									)}
								</td>
							</tr>
							<tr>
								<th className="text-start p-3">Birth Date</th>
								<td className="text-start p-3">
									{userData?.birthdate &&
									new Date(userData.birthdate).toString() !==
										'Invalid Date'
										? new Date(
												userData.birthdate
										  ).toLocaleDateString('en-GB')
										: userData?.birthdate}
								</td>
							</tr>
						</tbody>
					</table>
				)}
				{isCognitoUser && (
					<div className="row justify-content-end">
						<div className="col-12 col-lg-8 text-md-end">
							<button
								className="defaultBtn me-3"
								style={{width: 'auto'}}
								onClick={handleChangeButtonClick}
							>
								Change Password
							</button>
							<button
								className="cancelBtn me-3"
								onClick={handleDeleteButtonClick}
								style={{width: 'auto'}}
							>
								Delete Account
							</button>
						</div>
					</div>
				)}
			</div>

			{/* MFA Preference Section */}
			{isCognitoUser && mfaEnabled && isPhoneVerified && (
				<div className="container bg-light shadow-sm mt-4 p-4">
					<div className="row p-3">
						<div className="col-md-4 col-12">
							<h2>MFA Preference</h2>
						</div>

						<div className="col-8 d-flex justify-content-end">
							<button
								className="defaultBtn"
								style={{width: 'auto'}}
								onClick={() => updateMfaPreference()}
							>
								Update
							</button>
						</div>
					</div>
					<div className="row px-3">
						<div className="pb-3">
							<div>
								To secure your login identities, we will use OTP
								verification
							</div>
							<div>Where would you like to receive it?</div>
						</div>

						<div className="my-2">
							<div className="form-check pb-2">
								<input
									className="form-check-input"
									type="radio"
									name="mfa-preference-selector"
									id="sms-radio"
									value="SMS_MFA"
									onChange={(event) =>
										setMfaPreference(event.target.value)
									}
									checked={mfaPreference === 'SMS_MFA'}
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
									checked={
										mfaPreference === 'SOFTWARE_TOKEN_MFA'
									}
								/>
								<label
									className="form-check-label"
									htmlFor="totp-radio"
								>
									TOTP
								</label>
							</div>
						</div>
					</div>
				</div>
			)}

			{showDeleteConfirmPopup && (
				<div className="popup d-flex justify-content-center align-items-center">
					<div className="popup-content text-center">
						<h5>Delete Account</h5>
						<p>Are you sure you want to delete your Account?</p>
						<button
							className="defaultBtn me-2"
							style={{width: 'auto'}}
							onClick={handleDeleteConfirmButtonClick}
						>
							Yes
						</button>
						<button
							className="cancelBtn"
							style={{width: 'auto'}}
							onClick={closePopup}
						>
							No
						</button>
					</div>
				</div>
			)}

			{showChangeConfirmPopup && (
				<div className="popup d-flex justify-content-center align-items-center">
					<div className="popup-content text-center">
						<h5>Change Password</h5>
						<p>Are you sure you want to change your Password?</p>
						<button
							className="defaultBtn me-2"
							style={{width: 'auto'}}
							onClick={handleChangeConfirmButtonClick}
						>
							Yes
						</button>
						<button
							className="cancelBtn"
							style={{width: 'auto'}}
							onClick={closePopup}
						>
							No
						</button>
					</div>
				</div>
			)}

			{showSignInPopUp && (
				<div className="popup">
					<div className="col-3">
						<button className="cancelBtn" onClick={closePopup}>
							<AiOutlineClose />
						</button>
					</div>
					<div className="popup-content">
						<div className="my-5">
							<SignInPopUp
								currentUserSub={currentUserSub}
								targetSub=""
								role="user"
								updateCustomers=""
								closePopup={closePopup}
								isDeleteAccount={true}
							/>
						</div>
					</div>
				</div>
			)}

			{changePassword && (
				<div className="popup">
					<div className="col-3">
						<button className="cancelBtn" onClick={closePopup}>
							<AiOutlineClose />
						</button>
					</div>
					<div className="popup-content">
						<div className="my-5">
							<SignInPopUp
								currentUserSub={currentUserSub}
								targetSub=""
								role="user"
								updateCustomers=""
								closePopup={closePopup}
								isChangePassword={true}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ProfilePage;
