import SignInContainer from '../components/SignInContainer';
import RegisterContainer from '../components/RegisterContainer';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import type {BankConfig} from '../utils/types';

const LoginPage = () => {
	const [showSignIn, setShowSignIn] = useState(true);
	const [bankLogo, setBankLogo] = useState<any>(null);
	const [bankSlogan, setBankSlogan] = useState<any>(null);
	const navigate = useNavigate();
	const bankName = import.meta.env.VITE_BANK_NAME;

	//fetch bank details
	useEffect(() => {
		import(`../../config/${bankName}.json`)
			.then((module: {default: BankConfig}) => {
				const bankConfig = module.default;
				setBankSlogan(bankConfig.slogan);
			})
			.catch((error) => {
				console.error('Failed to load bank config', error);
			});
	}, []);

	useEffect(() => {
		const fetchBankLogo = async () => {
			const logo = await import(`../assets/${bankName}.svg`);
			setBankLogo(logo.default);
		};

		fetchBankLogo();
	}, [bankName]);

	const handleSignIn = () => {
		setShowSignIn(!showSignIn);
	};

	const checkLoggedInUser = async () => {
		if (sessionStorage.getItem('access_token') != null) {
			navigate('/cm-dashboard');
		}
	};

	useEffect(() => {
		checkLoggedInUser();
	}, []);

	return (
		<>
			<div className="container-fluid d-flex vh-80">
				{/* Left */}
				<div className="col-md-6 align-items-center flex-column justify-content-center d-md-flex d-none">
					<img src={bankLogo} alt="bank-logo" width={250} />
					<h1 className="bank-name">Welcome to {bankName}</h1>
					<p className="fst-italic bank-slogan">{bankSlogan}</p>
				</div>

				{/* Right */}
				{showSignIn ? (
					<SignInContainer handleSignIn={handleSignIn} />
				) : (
					<RegisterContainer handleSignIn={handleSignIn} />
				)}
			</div>
		</>
	);
};

export default LoginPage;
