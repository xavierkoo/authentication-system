import { useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillExclamationCircle, AiFillEdit, AiOutlineClose } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { IoMdLogOut } from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdRemoveCircle} from 'react-icons/md';
import bankLogo from "../assets/posb.svg";
import Sidebar from "../components/SideBar";
import SideBarSuper from "../components/SideBarSuper";
import MultiFactAuth from '../components/MultiFactAuth';
import { CustomerData } from "../utils/types";
import customersData from "../utils/customer_data.json";
import Pagination from 'react-bootstrap/Pagination';
import Switch from 'react-switch';

const CmDashboard = () => {
    const location = useLocation();
    if (location.state) {
        window.localStorage.setItem('adminType', location.state.adminType);
    }
    const [adminType, setAdminType] = useState(window.localStorage.getItem("adminType")); //TODO: for demo of different admin types use protected routes and checking of tokens to determine admin type for actual implementation
    // isSuperAdmin is true if adminType is superAdmin from local storage
    const isSuper = adminType === 'superAdmin';
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showMfaPopup, setShowMfaPopup] = useState<boolean>(false);
    const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
    const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState<boolean>(false);
    const [customers, setCustomers] = useState(customersData);
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 12;
    // Calculate the startIndex and endIndex based on the current page
    const startIndex = (currentPage - 1) * customersPerPage;
    const endIndex = startIndex + customersPerPage;
    // Slice the customersData to get the customers for the current page
    const customersToDisplay = customersData.slice(startIndex, endIndex);

    // For Edit Popup
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    // toggle admin by allowing only one of the two to be true
    const toggleAdmin = () => {
        // set isAdmin to the opposite of its current value
        setIsAdmin(!isAdmin);
        // if isSuperAdmin is true, set it to false
        if (isSuperAdmin) {
            setIsSuperAdmin(false);
        }
    };
    
    // toggle super admin by allowing only one of the two to be true
    const toggleSuperAdmin = () => {
        setIsSuperAdmin(!isSuperAdmin);
        if (isAdmin) {
            setIsAdmin(false);
        }
    };

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleDeleteButtonClick = () => {
		setShowDeleteConfirmPopup(true);
	};

    const handleDeleteConfirmButtonClick = () => {
		setShowMfaPopup(true);
	};

    const handleEditButtonClick = () => {
        setShowEditPopup(true);
    };

    const handleEditConfirmButtonClick = () => {
        setShowMfaPopup(true);
    };

    const closePopup = () => {
        setShowMfaPopup(false);
		setShowDeleteConfirmPopup(false);
        setShowEditPopup(false);
	};

    const inlineStyle = {
        fontSize: "16px",
        backgroundColor: "#0078CE",
        padding: "20px",
    };

    return (
        <div>
            <div
				className={`overlay ${
					showMfaPopup ||
					showDeleteConfirmPopup
						? 'active'
						: ''
				}`}
			></div>
            <div className="navbar navbar-expand-lg navbar-light" style={inlineStyle}>
                <div className="container-fluid">
                    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                        <GiHamburgerMenu style={{ fontSize: "25px", color: "white", marginRight: '5px' }} />
                    </div>
                    <img src={bankLogo} className="bank-navbar" alt="Logo" />
                    <ul className="navbar-nav" style={{ marginLeft: "auto" }}>
                        <li className="nav-item me-4">
                            <Link
                                className="nav-link"
                                to=""
                                style={{ color: "white" }}
                            >
                                {<AiFillExclamationCircle style={{ marginRight: "5px", marginBottom: "3px" }} />}
                                Edit Tooltips
                            </Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link
                                className="nav-link"
                                to=""
                                style={{ color: "white" }}
                            >
                                <CgProfile style={{ marginRight: "5px", marginBottom: "3px" }} />
                                Ray Quek
                            </Link>
                        </li>
                        <li className="nav-item me-4">
                        {/* TODO: Logout functionality */}
                            <Link
                                className="nav-link"
                                to="/"
                                style={{ color: "white" }}
                            >
                                <IoMdLogOut style={{ marginRight: "5px", marginBottom: "3px" }} />
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
                {isSuper ? <SideBarSuper handleClick={handleClick} /> : <Sidebar handleClick={handleClick} />}
            </div>
            <h1 className="mt-5 ms-5">Customers</h1>
            <table className="table mt-4 ms-5" style={{ width: '95%', border: '1px solid lightgrey' }}>
                <thead>
                    <tr>
                        <th className="table-header">Email</th>
                        <th className="table-header">Name</th>
                        <th className="table-header">User ID</th>
                        <th className="table-header">Status</th>
                        <th className="table-header">Created At</th>
                        <th className="table-header">Updated At</th>
                        <th className="table-header">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {customersToDisplay && customersToDisplay.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.email}</td>
                            <td>{customer.name}</td>
                            <td>{customer.userId}</td>
                            <td>{customer.status}</td>
                            <td>{customer.createdAt}</td>
                            <td>{customer.updatedAt}</td>
                            {adminType === 'superAdmin' ? (
                                <td>
                                    <button className="btn btn-primary" onClick={handleEditButtonClick}>
                                        <AiFillEdit />
                                    </button>
                                    <button className="btn btn-secondary ms-2" onClick={handleDeleteButtonClick}>
                                        <MdRemoveCircle />
                                    </button>
                                </td>
                            ) : (
                                <td>
                                    -
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination className="my-pagination justify-content-center mt-4">
                <Pagination.Prev
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {Array(Math.ceil(customers.length / customersPerPage))
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
						currentPage === Math.ceil(customers.length / customersPerPage)
					}
				/>
            </Pagination>

            {showEditPopup && (
                <div className="popup d-flex justify-content-center align-items-center">
                    <div className="popup-content text-center">
                        <h1 className="mb-4">Edit User</h1>
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <span className="me-3">Admin (Restricted & Read-Only)</span>
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
                                    <span className="me-3">Super Admin (Unrestricted & Read/Write/Delete)</span>
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
                            style={{ width: 'auto' }}
                            onClick={handleEditConfirmButtonClick}
                            >
                            Save
                            </button>
                            <button
                            className="cancelBtn"
                            style={{ width: 'auto' }}
                            onClick={closePopup}
                            >
                            Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {showDeleteConfirmPopup && (
				<div className="popup d-flex justify-content-center align-items-center">
					<div className="popup-content text-center">
						<h1>Deactivate User</h1>
						<h6>Are you sure you want to deactivate this user?</h6>
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
								navigateTo="/cm-dashboard" //TODO: handle actual delete or saving
								handleSteps={() => 5}
							/>
						</div>
					</div>
				</div>
			)}
        </div>
    );
};

export default CmDashboard;
