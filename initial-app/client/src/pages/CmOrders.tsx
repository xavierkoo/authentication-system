import { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillExclamationCircle } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { IoMdLogOut } from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import Sidebar from "../components/SideBar";
import SideBarSuper from "../components/SideBarSuper";
import bankLogo from "../assets/posb.svg";

const Orders = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [adminType, setAdminType] = useState(window.localStorage.getItem("adminType")); //TODO: for demo of different admin types use protected routes and checking of tokens to determine admin type for actual implementation
    // isSuperAdmin is true if adminType is superAdmin from local storage
    const isSuper = adminType === 'superAdmin';

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const inlineStyle = {
        fontSize: "16px",
        backgroundColor: "#0078CE",
        padding: "20px",
    };


    return (
        <div>
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
            <h1 className="mt-5 ms-5">Orders</h1>
        </div>
    )
}

export default Orders