import {useState} from 'react';
import NavBar from '../components/NavBar';
import MultiFactAuth from '../components/MultiFactAuth';
import {AiOutlineClose} from 'react-icons/ai';
import {Link, useNavigate} from 'react-router-dom';

const ProfilePage = () => {
	const [showMfaPopup, setShowMfaPopup] = useState(false);
	const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false);
	const [showChangeConfirmPopup, setShowChangeConfirmPopup] = useState(false);
	const navigate = useNavigate();

	const handleDeleteButtonClick = () => {
		setShowDeleteConfirmPopup(true);
	};

	const handleChangeButtonClick = () => {
		setShowChangeConfirmPopup(true);
	};

	const handleDeleteConfirmButtonClick = () => {
		setShowMfaPopup(true);
	};

	const handleChangeConfirmButtonClick = () => {
		navigate('/password', {
			state: {isChangePassword: true, isVerified: false},
		});
	};

	const closePopup = () => {
		setShowMfaPopup(false);
		setShowDeleteConfirmPopup(false);
		setShowChangeConfirmPopup(false);
	};

	const handleLogout = () => {
		window.location.href = '/';
	};

	return (
		<>
			<NavBar />
			<div
				className={`overlay ${
					showMfaPopup ||
					showDeleteConfirmPopup ||
					showChangeConfirmPopup
						? 'active'
						: ''
				}`}
			></div>
			<div className="container bg-light shadow-sm mt-4 p-4">
				<div className="row p-3">
					<div className="col-md-4 col-12">
						<h2>Profile</h2>
					</div>
					<div className="col-md-8 col-12 d-flex justify-content-end">
						<div className="col-3 text-end">
							<Link to="/">
								<button
									className="defaultBtn"
									style={{width: 'auto'}}
									onClick={handleLogout}
								>
									Log Out
								</button>
							</Link>
						</div>
					</div>
				</div>
				<table className="table table-bordered h-50 text-center">
					<tr>
						<th className="text-start p-3">Full Name</th>
						<td className="text-start p-3">Dennis</td>
					</tr>
					<tr>
						<th className="text-start p-3">ID</th>
						<td className="text-start p-3">9392020</td>
					</tr>
					<tr>
						<th className="text-start p-3">Email</th>
						<td className="text-start p-3">user@gmail.com</td>
					</tr>
					<tr>
						<th className="text-start p-3">Phone Number</th>
						<td className="text-start p-3">839292849</td>
					</tr>
					<tr>
						<th className="text-start p-3">Birth Date</th>
						<td className="text-start p-3">20-0-2000</td>
					</tr>
				</table>
				<div className="row justify-content-end">
					<div className="col-12 col-lg-4 text-md-end">
						<button
							className="defaultBtn me-3"
							style={{width: 'auto'}}
							onClick={handleChangeButtonClick}
						>
							Change Password
						</button>
						<button
							className="cancelBtn me-3"
							onClick={handleDeleteButtonClick}
							style={{width: 'auto'}}
						>
							Delete Account
						</button>
					</div>
				</div>
			</div>


			{showDeleteConfirmPopup && (
				<div className="popup d-flex justify-content-center align-items-center">
					<div className="popup-content text-center">
						<h1>Delete Account</h1>
						<h6>Are you sure you want to delete your Account?</h6>
						<button
							className="defaultBtn me-2"
							style={{width: 'auto'}}
							onClick={handleDeleteConfirmButtonClick}
						>
							Yes
						</button>
						<button
							className="cancelBtn"
							style={{width: 'auto'}}
							onClick={closePopup}
						>
							No
						</button>
					</div>
				</div>
			)}

			{showChangeConfirmPopup && (
				<div className="popup d-flex justify-content-center align-items-center">
					<div className="popup-content text-center">
						<h1>Change Password</h1>
						<h6>Are you sure you want to change your Password?</h6>
						<button
							className="defaultBtn me-2"
							style={{width: 'auto'}}
							onClick={handleChangeConfirmButtonClick}
						>
							Yes
						</button>
						<button
							className="cancelBtn"
							style={{width: 'auto'}}
							onClick={closePopup}
						>
							No
						</button>
					</div>
				</div>
			)}

			{showMfaPopup && (
				<div className="popup">
					<div className="col-3">
						<button className="cancelBtn" onClick={closePopup}>
							<AiOutlineClose />
						</button>
					</div>
					<div className="popup-content">
						<div className="my-5">
							<MultiFactAuth
								navigateTo="/"
								handleSteps={() => 5}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ProfilePage;
