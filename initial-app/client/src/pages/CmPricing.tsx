import { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillExclamationCircle } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { IoMdLogOut } from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import Sidebar from "../components/SideBar";
import SideBarSuper from "../components/SideBarSuper";
import bankLogo from "../assets/posb.svg";

const Pricing = () => {
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

            <>
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
                <h1 className="mt-5 ms-5">Pricing</h1>
                </div>
                    <div className="row text-center align-items-end mx-3" >
                        <div className="col-lg-4 mb-5 mb-lg-0">
                            <div className="bg-white p-5 rounded-lg shadow">
                                <h1 className="h6 text-uppercase font-weight-bold mb-4">Basic</h1>
                                <h2 className="h1 font-weight-bold">$199<span className="text-small font-weight-normal ml-2">/ month</span></h2>

                                <div className="custom-separator my-4 mx-auto bg-primary"></div>

                                <ul className="list-unstyled my-5 text-small text-left">
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> Lorem ipsum dolor sit amet</li>
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> Sed ut perspiciatis</li>
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> At vero eos et accusamus</li>
                                    <li className="mb-3 text-muted">
                                        <i className="fa fa-times mr-2"></i>
                                        <del>Nam libero tempore</del>
                                    </li>
                                    <li className="mb-3 text-muted">
                                        <i className="fa fa-times mr-2"></i>
                                        <del>Sed ut perspiciatis</del>
                                    </li>
                                    <li className="mb-3 text-muted">
                                        <i className="fa fa-times mr-2"></i>
                                        <del>Sed ut perspiciatis</del>
                                    </li>
                                </ul>
                                <a href="#" className="btn btn-primary btn-block p-2 shadow rounded">Subscribe</a>
                            </div>
                        </div>


                        <div className="col-lg-4 mb-5 mb-lg-0">
                            <div className="bg-white p-5 rounded-lg shadow">
                                <h1 className="h6 text-uppercase font-weight-bold mb-4">Pro</h1>
                                <h2 className="h1 font-weight-bold">$399<span className="text-small font-weight-normal ml-2">/ month</span></h2>

                                <div className="custom-separator my-4 mx-auto bg-primary"></div>

                                <ul className="list-unstyled my-5 text-small text-left font-weight-normal">
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> Lorem ipsum dolor sit amet</li>
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> Sed ut perspiciatis</li>
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> At vero eos et accusamus</li>
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> Nam libero tempore</li>
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> Sed ut perspiciatis</li>
                                    <li className="mb-3 text-muted">
                                        <i className="fa fa-times mr-2"></i>
                                        <del>Sed ut perspiciatis</del>
                                    </li>
                                </ul>
                                <a href="#" className="btn btn-primary btn-block p-2 shadow rounded">Subscribe</a>
                            </div>
                        </div>


                        <div className="col-lg-4">
                            <div className="bg-white p-5 rounded-lg shadow">
                                <h1 className="h6 text-uppercase font-weight-bold mb-4">Enterprise</h1>
                                <h2 className="h1 font-weight-bold">$899<span className="text-small font-weight-normal ml-2">/ month</span></h2>

                                <div className="custom-separator my-4 mx-auto bg-primary"></div>

                                <ul className="list-unstyled my-5 text-small text-left font-weight-normal">
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> Lorem ipsum dolor sit amet</li>
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> Sed ut perspiciatis</li>
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> At vero eos et accusamus</li>
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> Nam libero tempore</li>
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> Sed ut perspiciatis</li>
                                    <li className="mb-3">
                                        <i className="fa fa-check mr-2 text-primary"></i> Sed ut perspiciatis</li>
                                </ul>
                                <a href="#" className="btn btn-primary btn-block p-2 shadow rounded">Subscribe</a>
                            </div>
                        </div>
                    </div>
                </>

            );
}

            export default Pricing;