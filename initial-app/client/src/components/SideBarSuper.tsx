import { useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu, GiPriceTag } from 'react-icons/gi';
import { PiUserSquareFill } from 'react-icons/pi';
import { ImFolderDownload } from 'react-icons/im';
import { GoLog } from 'react-icons/go';
import { BiSolidShoppingBags } from 'react-icons/bi';
import bankLogo from "../assets/posb.svg";

type SideBarProps = {
    handleClick: () => void;
};

const Sidebar = ({handleClick}: SideBarProps) => {
    // For checking what type of admin is logged in by retrieving from local storage

    return (
        <div className="sidebar">
            <button className="close-button" onClick={handleClick}>
                <GiHamburgerMenu style={{ fontSize: "25px", marginRight: '5px' }} />
            </button>
            <img src={bankLogo} className="bank-sidebar" alt="Logo" />
            <ul className="ms-3">
                <li>
                    <Link to="/cm-dashboard" style={{textDecoration: 'none'}}>
                        <div className="nav-link">
                            <PiUserSquareFill style={{ fontSize: "25px", marginRight: "9px", marginBottom: "7px" }} />
                            <h5 style={{ display: "inline", margin: "0" }}>Users</h5>
                        </div>
                    </Link>
                </li>
                <li className="mt-5">
                    {/*Restricted*/}
                    <Link to="/cm-enrollment" style={{textDecoration: 'none'}}>
                        <div className="nav-link">
                            <ImFolderDownload style={{ fontSize: "25px", marginRight: "9px", marginBottom: "7px" }} />
                            <h5 style={{ display: "inline", margin: "0" }}>Enrollment</h5>
                        </div>
                    </Link>
                </li>
                <li className="mt-5">
                    {/*Restricted*/}
                    <Link to="/cm-logs" style={{textDecoration: 'none'}}>
                        <div className="nav-link">
                            <GoLog style={{ fontSize: "25px", marginRight: "9px", marginBottom: "7px" }} />
                            <h5 style={{ display: "inline", margin: "0" }}>Logs</h5>
                        </div>
                    </Link>
                </li>
                <li className="mt-5">
                    <Link to="/cm-pricing" style={{textDecoration: 'none'}}>
                        <div className="nav-link">
                            <GiPriceTag style={{ fontSize: "25px", marginRight: "9px", marginBottom: "7px" }} />
                            <h5 style={{ display: "inline", margin: "0" }}>Pricing</h5>
                        </div>
                    </Link>
                </li>
                <li className="mt-5">
                    <Link to="/cm-orders" style={{textDecoration: 'none'}}>
                        <div className="nav-link">
                            <BiSolidShoppingBags style={{ fontSize: "25px", marginRight: "9px", marginBottom: "7px" }} />
                            <h5 style={{ display: "inline", margin: "0" }}>Orders</h5>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;