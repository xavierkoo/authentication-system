import {FaAt, FaCalendar} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';

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
						/>
					</div>
				</div>
				<div>
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
						or <Link to="/">Sign In with SSO</Link>
					</p>
				</div>
				<button
					className="defaultBtn"
					onClick={() => navigate('/password', {state: {isChangePassword:false,isVerified:false}})}
				>
					Sign Up!
				</button>
			</div>
		</>
	);
};

export default RegisterContainer;
