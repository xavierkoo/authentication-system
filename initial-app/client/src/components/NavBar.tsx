import { Link } from "react-router-dom";
import "../styles/_variable.scss";
import { BsList } from "react-icons/bs";
import bankLogo from "../assets/posb.svg"; // TODO: Dynamic logo import

const NavBar = () => {
  const inlineStyle = {
    fontSize: "16px",
    backgroundColor: "#0078CE",
    padding: "20px",
  };

  const handleToggleClick = () => {
    const navbarNavDropdown = document.getElementById("navbarNavDropdown");
    navbarNavDropdown?.classList.toggle("show");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={inlineStyle}>
      <div className="container-fluid">
        <img src={bankLogo} className="bank-navbar" alt="Logo" />
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleToggleClick}
        >
          <BsList style={{ color: "white" }} />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className="nav-link"
                aria-current="page"
                to="/home"
                style={{ color: "white" }}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/profile"
                style={{ color: "white" }}
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
