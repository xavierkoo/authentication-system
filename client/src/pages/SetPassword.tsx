import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import UserPool from "../services/UserPool";
import { CognitoUser } from "amazon-cognito-identity-js";
import OtpPassword from "../components/OtpPassword";
import Notifications from "../components/Notifications";
import { AccountContext } from "../services/Account";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lengthCheck, setLengthCheck] = useState(false);
  const [passwordStrengthCheck, setPasswordStrengthCheck] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [isOldPasswordInvalid, setIsOldPasswordInvalid] = useState(false);

  const location = useLocation();
  const isChange = location.state.isChangePassword;
  const email = location.state.email;
  const navigate = useNavigate();
  const { getSession, logout } = useContext(AccountContext) || {};

  const [bankLogo, setBankLogo] = useState<any>(null);
  const bankName = import.meta.env.VITE_BANK_NAME;

  //fetch bank logo
  useEffect(() => {
    const fetchBankLogo = async () => {
      const logo = await import(`../assets/${bankName}.svg`);
      setBankLogo(logo.default);
    };

    fetchBankLogo();
  }, [bankName]);

  useEffect(() => {
    if (showErrorNotification) {
      // Set a timeout to hide the error notification after 5 seconds
      const timeout = setTimeout(() => {
        setShowErrorNotification(false);
        setIsSubmitted(false);
      }, 5000);

      // Clear the timeout when the component unmounts or when isSubmitted becomes false
      return () => clearTimeout(timeout);
    }

    if (isOldPasswordInvalid) {
      // Set a timeout to hide the error notification after 5 seconds
      const timeout = setTimeout(() => {
        setIsOldPasswordInvalid(false);
        setIsSubmitted(false);
      }, 5000);

      // Clear the timeout when the component unmounts or when isSubmitted becomes false
      return () => clearTimeout(timeout);
    }
  }, [showErrorNotification, isOldPasswordInvalid]);

  // Handler for password change
  const handlePasswordChange = (e: any) => {
    setIsSubmitted(false);
    const newPassword = e.target.value;
    const lengthValid = newPassword.length >= 8 && newPassword.length <= 64;

    const uppercaseValid = /[A-Z]/.test(newPassword);
    const lowercaseValid = /[a-z]/.test(newPassword);
    const numberValid = /[0-9]/.test(newPassword);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    const isStrengthValid =
      [uppercaseValid, lowercaseValid, numberValid, specialCharValid].filter(
        Boolean
      ).length == 4;
    const isPasswordValid = lengthValid && isStrengthValid;

    setLengthCheck(lengthValid);
    setPasswordStrengthCheck(isStrengthValid);
    setPasswordValid(isPasswordValid);

    setPassword(newPassword);
  };

  // Handler for confirm password change
  const handleConfirmPasswordChange = (e: any) => {
    setIsSubmitted(false);
    setConfirmPassword(e.target.value);
  };

  const getUser = () => {
    return new CognitoUser({
      Username: email.toLowerCase(),
      Pool: UserPool,
    });
  };

  // Handler for setting the password
  async function handleSetPassword() {
    setIsSubmitted(true);
    setIsOldPasswordInvalid(false);
    setShowErrorNotification(false);

    if (password === confirmPassword && passwordValid) {
      // ! Only for production
      if (isChange) {
        // change password of existing user
        if (getSession) {
          getSession().then((res: any) => {
            if (res) {
              const user = res.user;
              user.changePassword(
                oldPassword, // Provide the user's current password
                confirmPassword, // Provide the new password
                (err: any, result: any) => {
                  if (err) {
                    setIsSuccessful(false);
                    setIsOldPasswordInvalid(true);
                    return;
                  }
                  setIsSuccessful(true);
                  if (logout && result) {
                    logout();
                    navigate("/");
                  }
                }
              );
            }
          });
        }
      } else {
        setIsSuccessful(true);
        getUser().forgotPassword({
          onSuccess: () => {},
          onFailure: (err) => {
            console.error("onFailure:", err);
          },
        });
      }
    } else {
      setShowErrorNotification(true);
    }
  }

  return (
    <div className="container-fluid h-100">
      <div className="passwordDesign row p-0">
        <div className="d-none d-md-block col-md-7 p-0"></div>
        <div className="heightDesign col-md-5 d-flex justify-content-center align-items-center px-3">
          <div className="container">
            <div className="boxInput row d-flex justify-content-center align-items-center">
              <div className="text-center p-2 rounded">
                <img className="" src={bankLogo} alt="" width={350} />
                {!isSuccessful && (
                  <div>
                    {isChange && (
                      <div className="input-group mb-3 w-100">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Old Password"
                          aria-label="Password"
                          aria-describedby="basic-addon2"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <button
                          className="input-group-text"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                      </div>
                    )}
                    <div className="text-start">Password must:</div>
                    <ul className="text-start">
                      <li
                        style={{
                          color: password
                            ? lengthCheck
                              ? "green"
                              : "red"
                            : "black",
                        }}
                      >
                        Be between 8-64 characters
                      </li>
                      <div
                        style={{
                          color: password
                            ? passwordStrengthCheck
                              ? "green"
                              : "red"
                            : "black",
                        }}
                      >
                        <li>Include the following:</li>
                        <ul>
                          <li>An uppercase character</li>
                          <li>A lowercase character</li>
                          <li>A number</li>
                          <li>A special character</li>
                        </ul>
                      </div>
                    </ul>
                    <div className="input-group mb-3 w-100">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Password"
                        aria-label="Password"
                        aria-describedby="basic-addon2"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <button
                        className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                    </div>
                    <div className="input-group mb-3 w-100">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Confirm Password"
                        aria-label="Password"
                        aria-describedby="basic-addon2"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                      />
                      <button
                        className="input-group-text"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                    </div>
                    <button
                      className="btn btn-sm defaultBtn mt-2"
                      onClick={handleSetPassword}
                    >
                      Set Password
                    </button>
                  </div>
                )}
                {isSuccessful && (
                  <div>
                    <Notifications
                      message={
                        "Final verification before your password is set!"
                      }
                      isError={!isSuccessful}
                    />
                  </div>
                )}
                {/* TODO - Look at this, not sure if need to refactor */}
                {/* {isChange && isSuccessful && (
									<MFAPassword isChange={isChange} />
								)} */}
                {!isChange && isSuccessful && (
                  <OtpPassword
                    otpType="email"
                    email={email}
                    password={password}
                  />
                )}
                <div className="notification">
                  {showErrorNotification && !isSuccessful && isSubmitted && (
                    <Notifications
                      message={
                        "Invalid password or passwords do not match. Please try again."
                      }
                      isError={!isSuccessful}
                    />
                  )}
                  {isOldPasswordInvalid && !isSuccessful && isSubmitted && (
                    <Notifications
                      message={"Old Password is invalid. Please try again."}
                      isError={!isSuccessful}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
