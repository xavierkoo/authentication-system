import {Link} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import '../../styles/_variable.scss';
import {AccountContext} from '../../services/Account';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';

const NavBar = () => {
	const [bankLogo, setBankLogo] = useState<any>(null);
	const {logout} = useContext(AccountContext) || {};
	const [, , removeCookie] = useCookies();
	const navigate = useNavigate();

	const bankName = import.meta.env.VITE_BANK_NAME;

	useEffect(() => {
		const fetchBankLogo = async () => {
			const logo = await import(`../../assets/${bankName}.svg`);
			setBankLogo(logo.default);
		};

		fetchBankLogo();
	}, [bankName]);

	const handleToggleClick = () => {
		const navbarNavDropdown = document.getElementById('navbarNavDropdown');
		navbarNavDropdown?.classList.toggle('show');
	};

	const handleLogout = () => {
		if (logout) {
			logout();
			sessionStorage.clear();
			localStorage.clear();
			removeCookie('userData');
			navigate('/');
		}
	};

	return (
		<nav className="navbar navbar-expand">
			<div className="container">
				<Link to="/home">
					<img
						src={bankLogo}
						alt="bank-logo"
						height={75}
						width={100}
						className="navbar-brand"
					/>
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					onClick={handleToggleClick}
				></button>
				<div
					className="collapse navbar-collapse"
					id="navbarNavDropdown"
				>
					<ul className="navbar-nav">
						<li className="nav-item">
							<Link className="nav-link" to="/profile">
								Profile
							</Link>
						</li>

						<li className="nav-item">
							<Link
								className="nav-link"
								to="/"
								onClick={handleLogout}
							>
								Logout
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
