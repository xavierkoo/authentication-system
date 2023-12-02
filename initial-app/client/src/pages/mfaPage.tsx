import {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import MFASetupPrompt from '../components/mfaSetupSteps/MFASetupPrompt';
import Setup from '../components/mfaSetupSteps/Setup';
import Otp from '../components/Otp';
import MultiFactAuth from '../components/MultiFactAuth';

const MfaPage = () => {
	const location = useLocation();
	const [steps, setSteps] = useState(location.state.step);
	const navigate = useNavigate();

	const email = location.state.email;
	const logoURL = location.state.logoURL;
	// if logoURL is provided, use that, otherwise use "../src/assets/logo.png"
	const logoData = logoURL || '../src/assets/posb.svg';

	const handleSteps = (step: number) => {
		setSteps(step);
	};

	const handleRedirectToHomePage = () => {
		// Redirect the user to the homepage
		navigate('/home');
	};

	const renderComponents = () => {
		switch (steps) {
			case 0:
				return (
					<div className="my-5 text-center">
						<MultiFactAuth
							handleSteps={handleSteps}
							email={email}
						/>
					</div>
				);

			case 1:
				return (
					<div className="my-5">
						<MFASetupPrompt
							stateChanger={setSteps}
							email={email}
							logoURL={logoURL}
						/>
					</div>
				);

			case 2:
				return (
					<div className="my-5">
						<Setup
							requireSetup={true}
							stateChanger={setSteps}
							logoURL={logoURL}
						/>
					</div>
				);

			case 3:
				return (
					<div className="my-5">
						<div
							className="container text-start"
							style={{backgroundColor: 'white'}}
						>
							<div className="row">
								<div className="col-md-1"></div>
								<div className="col mx-2 my-2">
									<img
										src={logoData}
										style={{width: '150px'}}
										alt="Logo"
									/>
									<h3>Setup Complete!</h3>
									<p>
										You have successfully set up MFA for
										your account.
									</p>
									<p>
										Click the button below to go back to the
										login page.
									</p>
									<button
										className="btn defaultBtn"
										onClick={handleRedirectToHomePage}
									>
										Continue
									</button>
								</div>
								<div className="col-md-1"></div>
							</div>
						</div>
					</div>
				);
			case 4:
				return (
					<div className="my-5 text-center">
						<Otp
							otpType="email"
							stateChanger={setSteps}
							step={1}
							email={email}
						/>
					</div>
				);
			case 5:
				handleRedirectToHomePage();
				return null;
			default:
				return null; // Handle unexpected steps or provide a default case
		}
	};

	return <>{renderComponents()}</>;
};

export default MfaPage;
