import {Link} from 'react-router-dom';
import '../../styles/_variable.scss';
import {CgProfile} from 'react-icons/cg';
import {IoMdLogOut} from 'react-icons/io';
import {GiHamburgerMenu} from 'react-icons/gi';
import Sidebar from '../../components/navigation/SideBar';
import SideBarSuper from '../../components/navigation/SideBarSuper';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import {useState, useContext, useEffect} from 'react';
import {AccountContext} from '../../services/Account';

type adminNavBarProps = {
	adminType?: string;
	userName?: string;
};

const AdminNavBar = (adminNavBarProps: adminNavBarProps) => {
	const [, , removeCookie] = useCookies();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [bankLogo, setBankLogo] = useState<any>(null);
	const {logout} = useContext(AccountContext) || {};
	const isSuper = adminNavBarProps.adminType === 'super_admin';
	const userName = adminNavBarProps.userName;

	const bankName = import.meta.env.VITE_BANK_NAME;

	useEffect(() => {
		const fetchBankLogo = async () => {
			const logo = await import(`../../assets/${bankName}.svg`);
			setBankLogo(logo.default);
		};

		fetchBankLogo();
	}, [bankName]);

	const handleLogout = () => {
		if (logout) {
			logout();
			localStorage.clear();
			sessionStorage.clear();
			removeCookie('userData');
			navigate('/');
		}
	};

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className="navbar navbar-expand">
			<div className="container d-flex justify-content-between">
				<div className="d-flex">
					<div
						onClick={handleClick}
						style={{cursor: 'pointer'}}
						className="d-flex align-items-center justify-content-center"
					>
						<GiHamburgerMenu
							style={{
								fontSize: '25px',
								color: 'white',
								marginRight: '5px',
							}}
						/>
					</div>
					<Link to="/cm-dashboard">
						<img
							src={bankLogo}
							alt="bank-logo"
							height={75}
							width={100}
							className="navbar-brand"
						/>
					</Link>
				</div>

				<ul className="navbar-nav">
					<li className="nav-item me-4">
						<Link className="nav-link" to="/cm-profile">
							<CgProfile
								style={{
									marginRight: '5px',
									marginBottom: '3px',
								}}
							/>
							{userName}
						</Link>
					</li>
					<li className="nav-item me-4">
						<Link
							className="nav-link"
							to="/"
							onClick={handleLogout}
						>
							<IoMdLogOut
								style={{
									marginRight: '5px',
									marginBottom: '3px',
								}}
							/>
							Logout
						</Link>
					</li>
				</ul>
			</div>
			<div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
				{isSuper ? (
					<SideBarSuper handleClick={handleClick} />
				) : (
					<Sidebar handleClick={handleClick} />
				)}
			</div>
		</nav>
	);
};

export default AdminNavBar;
