import {FaAt, FaCalendar} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {formatDate} from '../utils/formatDate';
import {validateEmailFormat, validateDateFormat} from '../utils/validateFormat';

type RegisterContainerProps = {
	handleSignIn: () => void;
};

const RegisterContainer = ({handleSignIn}: RegisterContainerProps) => {
	let navigate = useNavigate();
	var today = new Date();
	var dd = today.getDate();
	var mm = String(today.getMonth() + 1).padStart(2, '0');
	var yyyy = today.getFullYear();
	var maxDate = yyyy + '-' + mm + '-' + dd;

	const [email, setEmail] = useState('');
	const [dob, setDob] = useState('');
	const [errors, setErrors] = useState<string[]>([]);
	const [isConsent, setIsConsent] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * The function `verify()` sends a POST request to an API endpoint to validate a user's email and
	 * birthdate, and based on the response, either logs an error message or navigates to a password page.
	 */
	function verify() {
		setIsLoading(true);
		const API =
			'https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/validate';

		const uri = `${API}?email=${email}&birthdate=${dob}`;
		fetch(uri, {
			method: 'POST',
		})
			.then((data) => data.json())
			.then((result) => {
				// if result has a errorType, then the user is not verified
				if (result.success === false) {
					setErrors(['Email or Date of Birth is incorrect']);
					setIsLoading(false);
					return;
				}

				// else, navigate to password page
				setIsLoading(false);
				navigate('/password', {
					state: {
						isChangePassword: false,
						isVerified: false,
						email: email,
					},
				});
			});
	}

	return (
		<>
			<div
				id="registerContainer"
				className="col-md-6 col-12 d-flex align-items-center flex-column justify-content-center"
			>
				<h1 className="mb-3">Register</h1>
				<div className="d-flex flex-column gap-3 w-100 align-items-center justify-content-center">
					<div className="input-group mb-3 w-75">
						<span className="input-group-text" id="register-email">
							<FaAt />
						</span>
						<input
							type="email"
							className="form-control"
							placeholder="Email"
							aria-label="Email"
							aria-describedby="register-email"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="input-group mb-3 w-75">
						<span className="input-group-text" id="register-dob">
							<FaCalendar />
						</span>
						<input
							type="date"
							className="form-control"
							placeholder="Date of Birth"
							aria-label="dob"
							aria-describedby="register-dob"
							max={maxDate}
							onChange={(e) => setDob(formatDate(e.target.value))}
						/>
					</div>
				</div>
				<div className="text-center">
					{/* Display error messages */}
					{errors.map((error, index) => (
						<p className="text-danger" key={index}>
							{error}
						</p>
					))}

					{/*  Consent checkbox */}
					<div className="">
						<div className="form-check">
							<input
								className="form-check-input"
								type="checkbox"
								value=""
								id="consent"
								onChange={(event) =>
									setIsConsent(event.target.checked)
								}
							/>
							<label
								className="form-check-label caption"
								htmlFor="consent"
							>
								I consent to the use of my personal data for
								authentication purposes.
							</label>
						</div>
					</div>
					<br />

					<h5 className="caption">Already have an account?</h5>
					<p className="caption">
						Login
						<span
							className="text-primary cursor-pointer"
							onClick={handleSignIn}
						>
							{' '}
							here!
						</span>
					</p>
					<p className="caption">
						or <Link to="/">Sign in with SSO</Link>
					</p>
				</div>
				<button
					className={`defaultBtn ${
						validateEmailFormat(email) &&
						validateDateFormat(dob) &&
						isConsent
							? ''
							: 'disabled'
					}`}
					onClick={() => verify()}
					disabled={
						!validateEmailFormat(email) || !validateDateFormat(dob)
					}
				>
					{isLoading ? 'Loading...' : 'Activate'}
				</button>
			</div>
		</>
	);
};

export default RegisterContainer;
