import {useState, useContext, useEffect} from 'react';
import {AiFillEdit, AiOutlineClose} from 'react-icons/ai';
import {MdRemoveCircle} from 'react-icons/md';
import Pagination from 'react-bootstrap/Pagination';
import Switch from 'react-switch';
import {AccountContext} from '../../services/Account';
import SignInPopup from '../../components/SignInPopup';
import UserLogoutPopup from '../../components/UserLogout';
import AdminNavBar from '../../components/navigation/AdminNavBar';
const bankName = import.meta.env.VITE_BANK_NAME;

const CmDashboard = () => {
	const {getSession} = useContext(AccountContext) || {};

	const [adminType, setAdminType] = useState('');
	const [userName, setUserName] = useState<string>('');
	const [userSub, setUserSub] = useState<string>('');
	const [currentUserSub, setCurrentUserSub] = useState<string>('');
	const [isDeleteAccount, setIsDeleteAccount] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// For MFA Popups
	const [showMfaPopup, setShowMfaPopup] = useState<boolean>(false);
	const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
	const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] =
		useState<boolean>(false);

	const closePopup = () => {
		setShowMfaPopup(false);
		setShowDeleteConfirmPopup(false);
		setShowEditPopup(false);
	};

	// Handles the customers data
	const [customers, setCustomers] = useState([]);
	const updateCustomers = (updatedCustomers: any) => {
		setCustomers(updatedCustomers);
	};

	// Handle Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const customersPerPage = 12;
	const startIndex = (currentPage - 1) * customersPerPage; // Calculate the startIndex and endIndex based on the current page number
	const endIndex = startIndex + customersPerPage;
	const customersToDisplay = customers.slice(startIndex, endIndex); // Slice the customersData to get the customers for the current page
	const paginate = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	// For Edit Popup
	const [isAdmin, setIsAdmin] = useState(false);
	const [isSuperAdmin, setIsSuperAdmin] = useState(false);

	/**
	 * The function toggleAdmin toggles the value of isAdmin and sets isSuperAdmin to false if it is true.
	 */
	const toggleAdmin = () => {
		setIsAdmin(!isAdmin);
		if (isSuperAdmin) {
			setIsSuperAdmin(false);
		}
	};

	/**
	 * The function `toggleSuperAdmin` toggles the value of `isSuperAdmin` and sets `isAdmin` to `false` if
	 * it was previously `true`.
	 */
	const toggleSuperAdmin = () => {
		setIsSuperAdmin(!isSuperAdmin);
		if (isAdmin) {
			setIsAdmin(false);
		}
	};

	// For Delete Popup
	const handleDeleteButtonClick = (userSub: string) => {
		setUserSub(userSub);
		setShowDeleteConfirmPopup(true);
		setIsDeleteAccount(true);
	};

	const handleDeleteConfirmButtonClick = () => {
		setShowMfaPopup(true);
	};

	// For Edit Popup
	const handleEditButtonClick = (userSub: string, userRole: string) => {
		setShowEditPopup(true);
		setIsDeleteAccount(false);
		setUserSub(userSub); //userSub of selected user
		if (userRole == 'Super Admin') {
			setIsSuperAdmin(true);
			setIsAdmin(false);
		} else if (userRole == 'Admin') {
			setIsAdmin(true);
			setIsSuperAdmin(false);
		}
	};
	const handleEditConfirmButtonClick = () => {
		setShowMfaPopup(true);
	};

	const formatDate = (inputDate: any) => {
		const date = new Date(inputDate);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	};

	useEffect(() => {
		setIsLoading(true);
		if (getSession) {
			getSession()
				.then(async (sessionData) => {
					// Sets the current user's details
					// Calls the api to retrieve all users
					setCurrentUserSub(sessionData.sub);
					setUserName(
						sessionData.given_name + ' ' + sessionData.family_name
					);
					const accessToken = sessionData.accessToken.jwtToken;
					//workaround to get bankName without using real bank names
					const bankIdentifier =
						bankName === 'BLUE' ? 'POSB' : 'OCBC'; // 'POSB' or 'OCBC
					const headers = sessionData.headers;
					const API =
						'https://nu0bf8ktf0.execute-api.ap-southeast-1.amazonaws.com/dev/retrieveuser';
					const uri = `${API}?accessToken=${accessToken}&bankIdentifier=${bankIdentifier}`;
					try {
						const response = await fetch(uri, {headers});

						if (response.ok) {
							const data = await response.json();
							setAdminType(data.statusCode);
							setCustomers(data.users.data);
							setIsLoading(false);
						} else {
							console.error('Error retrieving user data');
							setIsLoading(false);
						}
					} catch (error) {
						console.error('Error while validating admin:', error);
						setIsLoading(false);
					}
				})
				.catch((error) => {
					console.error('Error while getting access token:', error);
					setIsLoading(false);
				});
		}
	}, [showMfaPopup]);

	return (
		<>
			<UserLogoutPopup />
			{isLoading ? (
				<div className="d-flex flex-column vh-100 justify-content-center align-items-center align-self-center text-align-center">
					<div className="spinner-container">
						<div
							className="loading-spinner"
							style={{
								width: '50px',
								height: '50px',
								border: '10px solid #f3f3f3',
								borderTop: '10px solid #383636',
								borderRadius: '50%',
								animation: 'spinner 1.5s linear infinite',
							}}
						></div>
					</div>
					<h2>Loading...</h2>
				</div>
			) : (
				<div>
					<div
						className={`overlay ${
							showMfaPopup || showDeleteConfirmPopup
								? 'active'
								: ''
						}`}
					></div>
					<AdminNavBar adminType={adminType} userName={userName} />

					<div className="container bg-light shadow-sm my-4 p-4">
						<h2 className="">User Management</h2>
						<div className="table-responsive">
							<table
								className="table mt-4"
								style={{border: '1px solid lightgrey'}}
							>
								<thead>
									<tr>
										<th
											className="table-header"
											scope="col"
										>
											Name
										</th>
										<th
											className="table-header"
											scope="col"
										>
											Email
										</th>
										<th
											className="table-header"
											scope="col"
										>
											Status
										</th>
										<th
											className="table-header"
											scope="col"
										>
											User Role
										</th>
										<th
											className="table-header"
											scope="col"
										>
											Created At
										</th>
										<th
											className="table-header"
											scope="col"
										>
											Updated At
										</th>
										<th
											className="table-header"
											scope="col"
										>
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{customersToDisplay &&
										customersToDisplay.map(
											(customer: any) => (
												<tr key={customer.Username}>
													<td>
														{customer.given_name}{' '}
														{customer.family_name}
													</td>
													<td>{customer.email}</td>
													<td>
														{customer.UserStatus}
													</td>
													<td>{customer.UserRole}</td>
													<td>
														{formatDate(
															customer.UserCreateDate
														)}
													</td>
													<td>
														{formatDate(
															customer.UserLastModifiedDate
														)}
													</td>
													{adminType ===
													'super_admin' ? (
														<td>
															<button
																className="defaultBtn"
																style={{
																	width: 'auto',
																}}
																onClick={() =>
																	handleEditButtonClick(
																		customer.Username,
																		customer.UserRole
																	)
																}
															>
																<AiFillEdit />
															</button>
															<button
																className="cancelBtn ms-2"
																style={{
																	width: 'auto',
																}}
																onClick={() =>
																	handleDeleteButtonClick(
																		customer.Username
																	)
																}
															>
																<MdRemoveCircle />
															</button>
														</td>
													) : (
														<td>-</td>
													)}
												</tr>
											)
										)}
								</tbody>
							</table>
						</div>

						<Pagination className="my-pagination justify-content-center mt-4">
							<Pagination.Prev
								onClick={() => paginate(currentPage - 1)}
								disabled={currentPage === 1}
							/>
							{Array(
								Math.ceil(customers.length / customersPerPage)
							)
								.fill(undefined)
								.map((_, index) => (
									<Pagination.Item
										key={index + 1}
										active={index + 1 === currentPage}
										onClick={() => paginate(index + 1)}
									>
										{index + 1}
									</Pagination.Item>
								))}
							<Pagination.Next
								onClick={() => paginate(currentPage + 1)}
								disabled={
									currentPage ===
									Math.ceil(
										customers.length / customersPerPage
									)
								}
							/>
						</Pagination>
					</div>

					{/* This is the Edit User Popup Modal */}
					{showEditPopup && (
						<div className="popup d-flex justify-content-center align-items-center">
							<div className="popup-content text-center">
								<h1 className="mb-4">Edit User</h1>
								<table>
									<tbody>
										<tr>
											<td>
												<span className="me-3">
													Admin (Restricted &
													Read-Only)
												</span>
											</td>
											<td>
												<Switch
													checked={isAdmin}
													onChange={toggleAdmin}
													disabled={isSuperAdmin}
													onColor="#0078CE"
													offColor="#ccc"
												/>
											</td>
										</tr>
										<tr>
											<td>
												<span className="me-3">
													Super Admin (Unrestricted &
													Read/Write/Delete)
												</span>
											</td>
											<td>
												<Switch
													checked={isSuperAdmin}
													onChange={toggleSuperAdmin}
													disabled={isAdmin}
													onColor="#0078CE"
													offColor="#ccc"
												/>
											</td>
										</tr>
									</tbody>
								</table>
								<div className="button-container">
									<button
										className="defaultBtn me-2"
										style={{width: 'auto'}}
										onClick={handleEditConfirmButtonClick}
									>
										Save
									</button>
									<button
										className="cancelBtn"
										style={{width: 'auto'}}
										onClick={closePopup}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					)}

					{/* This is the Delete User Popup Modal */}
					{showDeleteConfirmPopup && (
						<div className="popup d-flex justify-content-center align-items-center">
							<div className="popup-content text-center">
								<h1>Deactivate User</h1>
								<h6>
									Are you sure you want to deactivate this
									user?
								</h6>
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

					{/* This is the MFA Popup Modal */}
					{showMfaPopup && (
						<div className="popup">
							<div className="col-6">
								<button
									className="cancelBtn"
									onClick={closePopup}
								>
									<AiOutlineClose />
								</button>
							</div>
							<div className="popup-content">
								<div className="my-5">
									<SignInPopup
										currentUserSub={currentUserSub}
										targetSub={userSub}
										role={
											isAdmin
												? 'admin'
												: isSuperAdmin
												? 'super_admin'
												: 'user'
										}
										updateCustomers={updateCustomers}
										closePopup={closePopup}
										isDeleteAccount={isDeleteAccount}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default CmDashboard;
