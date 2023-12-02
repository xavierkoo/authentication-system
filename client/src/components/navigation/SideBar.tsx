import {Link} from 'react-router-dom';
import {GiHamburgerMenu, GiPriceTag} from 'react-icons/gi';
import {PiUserSquareFill} from 'react-icons/pi';
import {BiSolidShoppingBags} from 'react-icons/bi';
import {useEffect, useState} from 'react';

type SideBarProps = {
	handleClick: () => void;
	isSuper?: boolean;
};

const Sidebar = ({handleClick}: SideBarProps) => {
	const [bankLogo, setBankLogo] = useState<any>(null);
	const bankName = import.meta.env.VITE_BANK_NAME;

	useEffect(() => {
		const fetchBankLogo = async () => {
			const logo = await import(`../../assets/${bankName}.svg`);
			setBankLogo(logo.default);
		};

		fetchBankLogo();
	}, [bankName]);

	return (
		<div className="sidebar">
			<button className="close-button" onClick={handleClick}>
				<GiHamburgerMenu
					style={{fontSize: '25px', marginRight: '5px'}}
				/>
			</button>
			<img src={bankLogo} alt="bank-logo" width={150} />
			<ul className="ms-3">
				<li>
					<Link to="/cm-dashboard" style={{textDecoration: 'none'}}>
						<div className="nav-link-sideBar">
							<PiUserSquareFill
								style={{
									fontSize: '25px',
									marginRight: '9px',
									marginBottom: '7px',
								}}
							/>
							<h5 style={{display: 'inline', margin: '0'}}>
								Users
							</h5>
						</div>
					</Link>
				</li>
				<li className="mt-5">
					<Link to="/cm-pricing" style={{textDecoration: 'none'}}>
						<div className="nav-link-sideBar">
							<GiPriceTag
								style={{
									fontSize: '25px',
									marginRight: '9px',
									marginBottom: '7px',
								}}
							/>
							<h5 style={{display: 'inline', margin: '0'}}>
								Pricing
							</h5>
						</div>
					</Link>
				</li>
				<li className="mt-5">
					<Link to="/cm-orders" style={{textDecoration: 'none'}}>
						<div className="nav-link-sideBar">
							<BiSolidShoppingBags
								style={{
									fontSize: '25px',
									marginRight: '9px',
									marginBottom: '7px',
								}}
							/>
							<h5 style={{display: 'inline', margin: '0'}}>
								Orders
							</h5>
						</div>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
