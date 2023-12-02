import SignInContainer from '../components/SignInContainer';
import RegisterContainer from '../components/RegisterContainer';
import {useState} from 'react';
import bankLogo from '../assets/posb.svg'; // TODO: Dynamic logo import

const LoginPage = () => {
	const [showSignIn, setShowSignIn] = useState(true);

	const handleSignIn = () => {
		setShowSignIn(!showSignIn);
	};

	return (
		<div className="container-fluid d-flex vh-80">
			<div className="col-md-6 align-items-center flex-column justify-content-center d-md-flex d-none">
				<img src={bankLogo} alt="bank-logo" className="bank-logo" />
				<h1 className='bank-name'>Welcome to POSB</h1> {/*TODO: Dynamic client name*/}
				<p className="fst-italic bank-slogan">
					Neighbors first, bankers second {/*TODO: Dynamic slogan*/}
				</p>
			</div>
			{showSignIn ? (
				<SignInContainer handleSignIn={handleSignIn} />
			) : (
				<RegisterContainer handleSignIn={handleSignIn} />
			)}
		</div>
	);
};

export default LoginPage;
