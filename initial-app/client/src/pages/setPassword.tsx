// TODO: rework password logic, dont verify on change only, on click of button need to verify too
import {FaLock, FaRegEye, FaRegEyeSlash, FaAt} from 'react-icons/fa';
import {useState, useEffect} from 'react';	
import { useLocation,useNavigate} from 'react-router-dom';
import OtpPassword from '../components/OtpPassword';
import Notifications from '../components/Notifications';
import MFAPassword from '../components/MFAPassword';

const SetPassword = () => {
	const [password, setPassword] = useState('');
  	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword,setShowPasswordStatus] = useState(false);
	const [showConfirmPassword,setShowConfirmPasswordStatus] = useState(false);
	const[lengthCheck,setLengthCheck]=useState(false);
	const[passwordStrengthCheck,setPasswordStrengthCheck]=useState(false);
	const[passwordValid,setPasswordValidStatus]=useState(false);
	const[isSuccessful,setIsSuccessful]=useState(false);
	const[isSubmitted,setIsSubmitted]=useState(false);
	const [showErrorNotification, setShowErrorNotification] = useState(false);
	const navigate = useNavigate();
	const location = useLocation()
	const isChange = location.state.isChangePassword
	const isVerified = location.state.isVerified

	useEffect(() => {
		if (!isSuccessful && isSubmitted) {
		  setShowErrorNotification(true);
	
		  // Set a timeout to hide the error notification after 3 seconds
		  const timeout = setTimeout(() => {
			setShowErrorNotification(false);
			setIsSubmitted(false);
		  }, 5000);
	
		  // Clear the timeout when the component is unmounted or when isSubmitted becomes false
		  return () => {
			clearTimeout(timeout);
		  };
		}
	}, [isSuccessful, isSubmitted]);


	const handlePasswordChange = (e: any) => {
		setIsSubmitted(false);
		const newPassword = e.target.value;
		const lengthValid = newPassword.length >= 14 && newPassword.length <= 64;
		
		const uppercaseValid = /[A-Z]/.test(newPassword);
		const lowercaseValid = /[a-z]/.test(newPassword);
		const numberValid = /[0-9]/.test(newPassword);
		const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
	  
		const isStrengthValid = [uppercaseValid, lowercaseValid, numberValid, specialCharValid].filter(Boolean).length >= 3;
		const isPasswordValid = lengthValid && isStrengthValid;
	  
		setLengthCheck(lengthValid);
		setPasswordStrengthCheck(isStrengthValid);
		setPasswordValidStatus(isPasswordValid);
	  
		setPassword(newPassword);
	};

	const handleConfirmPasswordChange = (e:any) => {
		setIsSubmitted(false);
		const newConfirmPassword = e.target.value;
		setConfirmPassword(newConfirmPassword);
	};
	
	const handleSetPassword = () => {
		
		setIsSubmitted(true);
		if (password === confirmPassword && passwordValid) {
			setIsSuccessful(!isSuccessful);
		}else{
			setShowErrorNotification(true)
		}

		
	};

	return (
		<div className=" container-fluid h-100">
			<div className="passwordDesign row p-0">
				<div className="d-none d-md-block col-md-7 p-0"></div>
				<div className="heightDesign col-md-5 d-flex justify-content-center align-items-center px-3">
					<div className="container">
						<div className="boxInput row d-flex justify-content-center align-items-center">
							<div className="text-center p-2 rounded">
								<img
								className="mb-5"
								src="https://internet-banking.dbs.com.sg/IB/posb/images/desktoplogo.png"
								alt=""
								/>
								{(isChange && !isVerified)? (
								<div>
									<MFAPassword isChange={isChange}/>
								</div>
								):(null)}
								{(!isChange && !isVerified)? (
								<div>
									<OtpPassword otpType='email' isChange={false} />
								</div>
								):(null)}
								{( ((!isChange && isVerified) || (isChange && isVerified)) && !isSuccessful) ? (
								<div>
									<div className="text-start">Password must:</div>
									<ul className="text-start">
										<li
											style={{ color: password ? (lengthCheck ? "green" : "red") : "black"  }}
										>
											Be between 14-64 characters
										</li>
										<div style={{ color: password ? (passwordStrengthCheck ? "green" : "red") : "black" }}>
											<li>
												Include at least three of the following:
											</li>
											<ul>
												<li>An uppercase character</li>
												<li>A lowercase character</li>
												<li>A number</li>
												<li>A special character</li>
											</ul>
										</div>
									</ul>
									<div className="input-group mb-3 w-100">
										<input
											type={showPassword ? 'text' : 'password'}
											className="form-control"
											placeholder="Password"
											aria-label="Password"
											aria-describedby="basic-addon2"
											value={password}
          									onChange={handlePasswordChange}
										/>
										<button
											className="input-group-text"
											onClick={() => setShowPasswordStatus(!showPassword)}
											>
											{showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
										</button>
									</div>
									<div className="input-group mb-3 w-100">
										<input
											type={showConfirmPassword ? 'text' : 'password'}
											className="form-control"
											placeholder="Confirm Password"
											aria-label="Password"
											aria-describedby="basic-addon2"
											value={confirmPassword}
         									onChange={handleConfirmPasswordChange}
										/>
										<button
											className="input-group-text"
											onClick={() => setShowConfirmPasswordStatus(!showConfirmPassword)}
										>
											{showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
										</button>
									</div>
									<button 
										className="btn btn-sm defaultBtn mt-2"
										onClick={handleSetPassword}
									>
										Set Password
									</button>
								</div>
								):(null)}
								{(isSuccessful)?(
									<div>
										<Notifications message={"Password set successfully!"} isError={!isSuccessful}/>
										<button className='defaultBtn mt-3' onClick={isChange ? () => navigate('/profile') : () => navigate('/')}>Continue</button>
									</div>
								):(null)}
								<div className='notification'>
									{(showErrorNotification && !isSuccessful && isSubmitted) ? (
										<Notifications message={"Invalid password or passwords do not match"} isError={!isSuccessful} />
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SetPassword;
