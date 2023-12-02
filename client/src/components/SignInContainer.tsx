import {FaLock, FaRegEye, FaRegEyeSlash, FaAt} from 'react-icons/fa';
import {useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AccountContext} from '../services/Account';
import {
	validateEmailFormat,
	validatePasswordFormat,
} from '../utils/validateFormat';

type SignInContainerProps = {
	handleSignIn: () => void;
};

const SignInContainer = ({handleSignIn}: SignInContainerProps) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const {authenticate, getSession} = useContext(AccountContext) || {};
	const navigate = useNavigate();
	const fullUrl = window.location.href;

	const urlObj = new URL(fullUrl);
	const baseUrl = urlObj.protocol + '//' + urlObj.host + '/profile';

	/**
	 * The function `requireMFASetup` checnpom ks if the user is authenticated, sets tokens in sessionStorage,
	 * verifies if the user is an admin, and navigates to the appropriate page based on the user's role.
	 * @returns The function `requireMFASetup` does not have an explicit return statement. However, it may
	 * implicitly return a Promise if the conditions in the code are met.
	 */
	async function login() {
		setIsLoading(true);
		if (authenticate) {
			try {
				const data: any = await authenticate(email, password);
				// data is supposed to be the cognito user

				// Sets the tokens into sessionStorage for activity/expriry prompt
				sessionStorage.setItem(
					'access_token',
					data.accessToken.jwtToken
				);
				sessionStorage.setItem(
					'refresh_token',
					data.refreshToken.token
				);

				// Verify if user role is admin
				if (getSession) {
					const {headers, accessToken, mfaEnabled} =
						await getSession();

					if (!mfaEnabled) {
						setIsLoading(false);
						return navigate('/mfa');
					}

					const accessTokens = accessToken.jwtToken;

					const API =
						'https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/validateAdmin';
					const uri = `${API}?accessToken=${accessTokens}`;
					try {
						const response = await fetch(uri, {headers});

						// Throw error if response is not ok
						if (!response.ok) {
							setIsLoading(false);
							throw new Error('Network response was not ok');
						}

						const data = await response.json();

						// Go to admin dashboard if user is admin or super admin
						if (
							data.role === 'admin' ||
							data.role === 'super_admin'
						) {
							setIsLoading(false);
							return navigate('/cm-dashboard');
						}

						// Go to home if user is not admin
						setIsLoading(false);
						navigate('/home');
					} catch (error: any) {
						setIsLoading(false);
						setErrors([error.message]);
					}
				}
			} catch (err: any) {
				setIsLoading(false);
				setErrors([err.message]);
			}
		}
	}

	return (
		<>
			<div
				id="signInContainer"
				className="col-md-6 col-12 d-flex align-items-center flex-column justify-content-center"
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
							type={showPassword ? 'text' : 'password'}
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
				<div className="text-center">
					{/* Display error messages */}
					{errors.map((error, index) => (
						<p className="text-danger" key={index}>
							{error}
						</p>
					))}

					<h5 className="caption">Haven't activated your account?</h5>
					<p className="caption">
						Get activated
						<span
							className="text-primary cursor-pointer"
							onClick={handleSignIn}
						>
							{' '}
							here!
						</span>
					</p>
					<p className="caption">
						or{' '}
						<Link
							to={`https://smurnauth-production.fly.dev/oauth/authorize?client_id=${
								import.meta.env.VITE_CLIENT_ID
							}&redirect_uri=${baseUrl}&response_type=code&scope=openid+profile`}
						>
							Sign in with SSO
						</Link>
					</p>
				</div>
				<button
					className={`defaultBtn ${
						validateEmailFormat(email) &&
						validatePasswordFormat(password)
							? ''
							: 'disabled'
					}`}
					onClick={() => login()}
					disabled={
						!validateEmailFormat(email) ||
						!validatePasswordFormat(password)
					}
				>
					{isLoading ? 'Loading...' : 'Sign In'}
				</button>{' '}
			</div>
		</>
	);
};

export default SignInContainer;
