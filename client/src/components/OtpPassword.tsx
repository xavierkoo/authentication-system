import {useState, useRef, useEffect, useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useNavigate} from 'react-router-dom';
import {
	faMobileScreen,
	faEnvelopeOpenText,
} from '@fortawesome/free-solid-svg-icons';
import Notifications from './Notifications';
import UserPool from '../services/UserPool';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {AccountContext} from '../services/Account';

type OtpProps = {
	otpType: string; // email or phone
	email: string;
	password: string;
};

const OtpPassword = ({otpType, email, password}: OtpProps) => {
	const {authenticate} = useContext(AccountContext) || {};

	const isEmail = otpType === 'email' ? true : false; // check if OTP is sent to email or phone
	const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digit OTP
	const inputRefs = useRef<Array<HTMLInputElement | null>>(
		Array(6).fill(null)
	); // to store references to the 6 input fields
	const [time, setTime] = useState(300); // 5 minutes timer
	const [msg, setMsg] = useState(''); // message to be displayed
	const [error, setError] = useState(false); // true if error, false if not
	const [maskedEmail, setMaskedEmail] = useState(''); // masked email to be displayed
	const [isLoading, setIsLoading] = useState(false); // true if loading, false if not

	// get the user
	const getUser = () => {
		return new CognitoUser({
			Username: email.toLowerCase(),
			Pool: UserPool,
		});
	};

	useEffect(() => {
		let timer: NodeJS.Timeout; // to store the timer
		// if time is greater than 0, decrement time by 1 every second
		if (time > 0) {
			timer = setTimeout(() => setTime(time - 1), 1000);
		}

		// Mask the email
		const splitEmail = email.split('@');
		const maskedEmail =
			splitEmail[0].slice(0, 1) + '******@' + splitEmail[1];
		setMaskedEmail(maskedEmail);

		return () => clearTimeout(timer); // clear the timer and update the masked email when the component unmounts
	}, [time, email]);

	/**
	 * The `formatTime` function takes a number of seconds and returns a formatted string representing the
	 * time in minutes and seconds.
	 * @param {number} seconds - The `seconds` parameter in the `formatTime` function represents the total
	 * number of seconds that you want to format.
	 * @returns The function `formatTime` returns a string in the format "mm:ss", where "mm" represents the
	 * minutes and "ss" represents the remaining seconds.
	 */
	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		return `${String(minutes).padStart(2, '0')}:${String(
			remainingSeconds
		).padStart(2, '0')}`;
	};

	const navigate = useNavigate();

	/**
	 * The `handleInputChange` function is used to handle the input change event for an OTP (One-Time
	 * Password) input field in a React component, validating the input and updating the OTP value
	 * accordingly.
	 * @param e - The `e` parameter is of type `React.ChangeEvent<HTMLInputElement>`, which represents the
	 * event object for the input change event. It contains information about the event, such as the target
	 * element and the new value of the input field.
	 * @param {number} index - The `index` parameter represents the index of the input field in the OTP
	 * (One-Time Password) array. It is used to identify which input field is being changed and update the
	 * corresponding value in the OTP array.
	 */
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const value = e.target.value;

		// check if value is a number and length of value is 1 (1 digit per input field)
		if (/^[0-9]*$/.test(value) && value.length <= 1) {
			// copy all the current OTP values into a new array
			const updatedOtp = [...otp];

			// update the OTP value at the given index with the new value
			updatedOtp[index] = value;
			setOtp(updatedOtp);

			// if value is not empty and the index is less than 5 and the next input field exists, focus on the next input field
			if (value !== '' && index < 5 && inputRefs.current[index + 1]) {
				inputRefs.current[index + 1]?.focus();
				// if value is empty and the index is greater than 0 and the previous input field exists, focus on the previous input field
			} else if (
				value === '' &&
				index > 0 &&
				inputRefs.current[index - 1]
			) {
				inputRefs.current[index - 1]?.focus();
			}
		}
	};

	/**
	 * The handleLogin function checks if the OTP is valid and if it is, it confirms the password and logs
	 * the user in, then creates an API key and navigates to the MFA page.
	 */
	const handleLogin = () => {
		setIsLoading(true);
		// if time is less than or equal to 0, set message to "OTP is invalid" and set error to true
		if (time <= 0) {
			setMsg('OTP is invalid');
			setIsLoading(false);
			setError(true);
		}
		// if otp contains any empty string, set message to "OTP is invalid" and set error to true
		if (otp.includes('')) {
			setMsg('OTP is invalid');
			setIsLoading(false);
			setError(true);
		}

		const otpJoined = otp.join('');
		if (otpJoined.length === 6) {
			getUser().confirmPassword(otpJoined, password, {
				onSuccess: () => {
					if (authenticate) {
						authenticate(email, password)
							.then((data: any) => {
								const sub = data.accessToken.payload.sub;
								const API =
									'https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/g2t4-create-api-key';
								const URI = `${API}?sub=${sub}`;

								// create an API key and assign to the user
								fetch(URI, {
									method: 'POST',
								}).then(() => {
									//set delay to 1.5 second to allow time for the api key to be created
									setIsLoading(false);
									navigate('/mfa');
								});
							})
							.catch((err: any) => {
								console.error(err);
								setIsLoading(false);
							});
					}
				},
				onFailure: (err) => {
					console.error('onFailure:', err);
					setMsg('OTP is invalid');
					setIsLoading(false);
					setError(true);
				},
			});
		}
	};

	const resendOTP = () => {
		getUser().forgotPassword({
			onSuccess: () => {},
			onFailure: (err) => {
				console.error('onFailure:', err);
			},
		});
	};

	return (
		<div>
			<h1 aria-label="OTP Verification">OTP Verification</h1>
			{isEmail && (
				<>
					<FontAwesomeIcon
						icon={faEnvelopeOpenText}
						size="3x"
						fade
						aria-label="Envelope Icon"
					/>
					<p id="otp-text" className="my-3">
						A one-time password has been sent to {maskedEmail}.
						{/* to be replaced with user's email */}
					</p>
				</>
			)}
			{!isEmail && (
				<>
					<FontAwesomeIcon
						icon={faMobileScreen}
						size="3x"
						fade
						aria-label="Mobile Screen Icon"
					/>
					<p id="otp-text" className="my-3">
						A one-time password has been sent to +65 **** 5432.{' '}
						{/* to be replaced with user's phone number */}
					</p>
				</>
			)}
			<div className="container text-center">
				<div className="mx-auto" style={{maxWidth: '400px'}}>
					{otp.map((value, index) => (
						<div
							key={index}
							style={{
								display: 'inline-block',
								marginRight: '10px',
								marginBottom: '10px',
							}}
						>
							<input
								type="text"
								className="form-control text-center"
								value={value}
								onChange={(e) => handleInputChange(e, index)}
								maxLength={1}
								style={{
									height: '50px',
									width: '40px',
									borderBottom: '1px solid #000',
								}}
								ref={(input) =>
									(inputRefs.current[index] = input)
								}
								aria-label={`Digit ${index + 1}`}
							/>
						</div>
					))}
				</div>
				<p
					id="otp-text"
					className="my-3"
					aria-labelledby="email-description"
				>
					OTP is only valid for {formatTime(time)} seconds.
				</p>
				<p id="otp-text" className="my-3">
					Did not receive the OTP?{' '}
					<a href="" onClick={resendOTP} aria-label="Resend OTP">
						Resend OTP
					</a>
				</p>
				<button
					className="btn defaultBtn"
					id="login"
					onClick={() => {
						handleLogin();
					}}
					aria-label="Login"
				>
					<span className="btn-text">
						{isLoading ? 'Loading...' : 'Verify'}
					</span>
				</button>
			</div>
			<div className="container text-center">
				{msg && <Notifications message={msg} isError={error} />}
			</div>
		</div>
	);
};

export default OtpPassword;
