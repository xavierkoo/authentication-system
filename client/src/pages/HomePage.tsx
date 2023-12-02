import NavBar from '../components/navigation/NavBar';
import {useNavigate} from 'react-router-dom';
import UserLogoutPopup from '../components/UserLogout';
import {useCookies} from 'react-cookie';
import {AccountContext} from '../services/Account';
import {useState, useContext, useEffect} from 'react';

const HomePage = () => {
	const [cookies] = useCookies();
	const [userData, setUserData] = useState(cookies['userData']);
	const {getSession} = useContext(AccountContext) || {};

	const checkForData = () => {
		if (!userData) {
			if (getSession) {
				getSession()
					.then(async (sessionData) => {
						// const accessToken = sessionData.accessToken.jwtToken;
						setUserData({
							sub: sessionData.sub,
							name:
								sessionData.given_name +
								' ' +
								sessionData.family_name,
							email: sessionData.email,
							given_name: sessionData.given_name,
							family_name: sessionData.family_name,
							birthdate: sessionData.birthdate,
							gender: '',
							phone_number: sessionData.phone_number,
						});
					})
					.catch((error) => {
						// if no accessToken then user is not logged in
						console.error(
							'Error while getting access token:',
							error
						);
					});
			}
		}
	};

	useEffect(() => {
		checkForData();
	}, []);

	const navigate = useNavigate();
	return (
		<>
			<UserLogoutPopup />
			<NavBar />
			<div className="container bg-light shadow-sm mt-4">
				<div className="row p-3">
					<div className="col-md-4 col-12 text-start">
						<h5>Welcome Back</h5>
						<h4>{userData?.name}</h4>
						<br></br>
						<h6>
							Would you like to personalise your name?{' '}
							<a href="">Yes</a> or <a href="">No</a>
						</h6>
						<br></br>
						<h6>
							Your last login was 10:58 PM on Tuesday 5th
							September 2023 (Singapore)
						</h6>
						<br></br>
						<h6>
							<b>There are </b>
							<a href="" className="text-secondary">
								no new message for you
							</a>
							<b> for you</b>
						</h6>
					</div>
					<div className="col pt-5 pt-md-0">
						<div className="row mb-5">
							<div className="col-6 text-start">
								<h4>Your Financial Overview</h4>
								<small className="text-secondary">
									September 2023
								</small>
							</div>
							<div className="col-6 text-end">
								<button
									className="btn defaultBtn"
									onClick={() => navigate('/profile')}
								>
									View Account
								</button>
							</div>
						</div>
						<table className="w-100 text-secondary h-25 border-bottom">
							<tbody>
								<tr>
									<th>Cash & Investments </th>
									<td> S$1,020,010,000.01</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div className="container bg-light shadow-sm mt-4 pb-5">
				<div className="row p-3">
					<div className="col-lg-4 col-md-12 col-sm-12 col-12 text-start">
						<h2>Deposits</h2>
					</div>
					<div className="col pt-md-0 text-md-end text-md-start text-start">
						<button className="btn mt-xl-2 mt-lg-2 btn-secondary mx-2">
							View Bank & Earn Summary
						</button>
						<button className="btn mt-xl-2 mt-lg-2 mt-md-0 mt-3 btn-secondary mx-2">
							Set Account Nickname
						</button>
						<button className="btn mt-xl-2 mt-lg-2 mt-3 btn-secondary mx-2">
							View Account
						</button>
					</div>
				</div>
				<table className="table table-bordered h-50 text-center">
					<tbody>
						<tr>
							<th className="text-start">
								POSB Passbook Savings Accounts{' '}
							</th>
							<td className="text-start">234-23455-6</td>
							<td>
								{' '}
								S$1,020,010,000.01
								<h6>Available Balance</h6>
							</td>
						</tr>
						<tr>
							<th className="text-start">DBS Multiplier </th>
							<td className="text-start">454-234455-7</td>
							<td>
								{' '}
								S$54,020,010,000.01
								<h6>Available Balance</h6>
							</td>
						</tr>
					</tbody>
				</table>
				<h5 className="text-end pt-4 pe-4">
					{' '}
					Total Available Balance S$55,040,020,000.02
				</h5>
			</div>
		</>
	);
};

export default HomePage;
