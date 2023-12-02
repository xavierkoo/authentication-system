import {useState, useRef, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
	faMobileScreen,
	faEnvelopeOpenText,
} from '@fortawesome/free-solid-svg-icons';
import Notifications from './Notifications';

type OtpProps = {
	otpType: string; // email or phone
	stateChanger: (value: number) => void;
	step?: number;
	navigateTo?: string;
	email?: string;
};

const Otp = ({otpType, stateChanger, step, navigateTo, email}: OtpProps) => {
	const isEmail = otpType === 'email' ? true : false; // check if OTP is sent to email or phone
	const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digit OTP
	const inputRefs = useRef<Array<HTMLInputElement | null>>(
		Array(6).fill(null)
	); // to store references to the 6 input fields
	const [time, setTime] = useState(300); // 5 minutes timer
	const [msg, setMsg] = useState(''); // message to be displayed
	const [error, setError] = useState(false); // true if error, false if not
	const navigate = useNavigate();

	const adminEmails = ['superAdmin@gmail.com', 'admin@gmail.com'];

	if (email && adminEmails.includes(email)) {
		navigateTo = '/cm-dashboard';
	}

	useEffect(() => {
		let timer: NodeJS.Timeout; // to store the timer

		// if time is greater than 0, decrement time by 1 every second
		if (time > 0) {
			timer = setTimeout(() => setTime(time - 1), 1000);
		}

		return () => clearTimeout(timer); // clear the timer when the component unmounts
	}, [time]);

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		return `${String(minutes).padStart(2, '0')}:${String(
			remainingSeconds
		).padStart(2, '0')}`;
	};

	// handle input change of OTP
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

	const handleVerify = () => {
		// if time is less than or equal to 0, set message to "OTP is invalid" and set error to true
		if (time <= 0) {
			setMsg('OTP is invalid');
			setError(true);
		}
		// if otp contains any empty string, set message to "OTP is invalid" and set error to true
		if (otp.includes('')) {
			setMsg('OTP is invalid');
			setError(true);
		}
		//TODO: check if OTP is valid and change adminType accordingly
		if (navigateTo) {
			navigate(navigateTo, {
				state: {adminType: email?.split('@')[0]},
			});
		}
		stateChanger(step ? step : 5);
	};

	const handleResend = () => {};

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
						A one-time password has been sent to
						xav******@gmail.com.
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
					<a onClick={handleResend} aria-label="Resend OTP">
						Resend OTP
					</a>
				</p>
				<button
					className="btn defaultBtn"
					id="login"
					onClick={handleVerify}
					aria-label="Login"
				>
					<span className="btn-text">Verify</span>
				</button>
			</div>
			<div className="container text-center">
				{msg && <Notifications message={msg} isError={error} />}
			</div>
		</div>
	);
};

export default Otp;
