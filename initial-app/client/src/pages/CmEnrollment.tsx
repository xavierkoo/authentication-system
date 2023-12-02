import { DragEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillExclamationCircle } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { IoMdLogOut } from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import Sidebar from "../components/SideBar";
import SideBarSuper from "../components/SideBarSuper";
import bankLogo from "../assets/posb.svg";

const CmEnrollment = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dragIsOver, setDragIsOver] = useState<boolean>(false);
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

    // Define the event handlers
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragIsOver(true);
    };
    
    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragIsOver(false);
    };
    
    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragIsOver(false);
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
            <h1 className="mt-5 ms-5">Enrollment</h1>

            <div
                className="mt-5 ms-5"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100px',
                    width: '400px',
                    border: '1px solid',
                    backgroundColor: dragIsOver ? 'lightgray' : 'white',
                }}
            >
                <p>Drag & drop files here</p>
            </div>
        </div>
    )
}

export default CmEnrollment