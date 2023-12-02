import {useLocation, useNavigate} from 'react-router-dom';
import {AccountContext} from '../services/Account';
import {useContext, useEffect, useRef, useState} from 'react';
import Pool from '../services/UserPool';
import {jwtDecode} from 'jwt-decode';
import {CognitoRefreshToken} from 'amazon-cognito-identity-js';

const UserLogoutPopup = () => {
	const messageRef = useRef(false);
	const [showPopup, setShowPopup] = useState(false);
	const {logout} = useContext(AccountContext) || {};
	const navigate = useNavigate();
	const user = Pool.getCurrentUser();
	const popupTimout = 120000;
	const RefreshToken = sessionStorage.getItem('refresh_token');

	useEffect(() => {
		messageRef.current = showPopup;
	}, [showPopup]);

	function scheduleTokenExpiryCheck(): void {
		if (messageRef.current) return;
		const accessToken = sessionStorage.getItem('access_token');
		if (accessToken) {
			const payload = jwtDecode(accessToken);

			const exp = payload.exp ? payload.exp * 1000 : Date.now() + 300;
			const timeToExpiry = exp - Date.now();

			if (!RefreshToken) {
				if (timeToExpiry <= 0) {
					handleLogout('Token has expired');
				} else {
					setTimeout(() => {
						handleLogout('Token has expired');
					}, timeToExpiry);
				}
				return;
			}

			if (timeToExpiry <= 0) {
				if (!showPopup) setShowPopup(true);
				setTimeout(() => {
					if (!messageRef.current || useLocation().pathname === '/')
						return;
					handleLogout('Token has expired');
				}, popupTimout);
				return;
			}

			setTimeout(() => {
				if (messageRef.current) return;
				if (messageRef.current) return;
				setShowPopup(true);

				setTimeout(() => {
					if (!messageRef.current) return;
					handleLogout('Token has expired');
				}, popupTimout);
			}, timeToExpiry);
		}
	}

	function handleLogout(_e: any) {
		alert('You have been logged out');
		if (logout) logout();
		localStorage.clear();
		sessionStorage.clear();
		navigate('/');
	}

	function refreshUser(_e: any) {
		if (user && RefreshToken) {
			const token = new CognitoRefreshToken({RefreshToken});

			user.refreshSession(token, (err, session) => {
				if (err) {
					handleLogout('Error refreshing session');
				} else {
					sessionStorage.setItem(
						'access_token',
						session.getAccessToken().getJwtToken()
					);
					sessionStorage.setItem(
						'refresh_token',
						session.getRefreshToken().getToken()
					);

					setShowPopup(false);
				}
			});
		}
	}

	scheduleTokenExpiryCheck();

	return showPopup ? (
		<>
			<div className={`overlay active`}></div>
			{true && (
				<div className="popup d-flex justify-content-center align-items-center">
					<div className="popup-content text-center">
						<h5>
							Your session is about to expire due to inactivity.{' '}
							<br />
							Would you like to continue your session?{' '}
						</h5>
						<p>
							Please click 'Yes' to continue, or 'No' to log out.
						</p>
						<button
							className="defaultBtn mx-4"
							style={{width: 'auto'}}
							onClick={refreshUser}
						>
							Yes
						</button>
						<button
							className="cancelBtn"
							style={{width: 'auto'}}
							onClick={handleLogout}
						>
							No
						</button>
					</div>
				</div>
			)}
		</>
	) : (
		<></>
	);
};

export default UserLogoutPopup;
