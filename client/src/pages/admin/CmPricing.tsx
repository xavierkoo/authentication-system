import { useState, useEffect, useContext } from "react";
import UserLogoutPopup from "../../components/UserLogout";
import { AccountContext } from "../admin/../../services/Account";
import AdminNavBar from "../../components/navigation/AdminNavBar";

const CmPricing = () => {
	const [role, setRole] = useState<string>("");
	const [userName, setUserName] = useState<string>("");
	const accountContext = useContext(AccountContext);

	useEffect(() => {
		if (accountContext) {
			// Now you can use accountContext.getSession
			accountContext
				.getSession()
				.then((session: any) => {
					setRole(session["custom:role"]);
					setUserName(session.given_name + " " + session.family_name);
				})
				.catch((error: any) => {
					console.error(error); // Handle error
				});
		}
	}, [accountContext]);

	return (
		<>
			<UserLogoutPopup />
			<div>
				<AdminNavBar adminType={role} userName={userName} />
				<h1 className="mt-5 ms-5">Pricing</h1>
			</div>
			<div className="row text-center align-items-end mx-3">
				<div className="col-lg-4 mb-5 mb-lg-0">
					<div className="bg-white p-5 rounded-lg shadow">
						<h1 className="h6 text-uppercase font-weight-bold mb-4">
							Basic
						</h1>
						<h2 className="h1 font-weight-bold">
							$199
							<span className="text-small font-weight-normal ml-2">
								/ month
							</span>
						</h2>

						<div className="custom-separator my-4 mx-auto bg-primary"></div>

						<ul className="list-unstyled my-5 text-small text-left">
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								Lorem ipsum dolor sit amet
							</li>
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								Sed ut perspiciatis
							</li>
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								At vero eos et accusamus
							</li>
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
						<a
							href="#"
							className="btn btn-primary btn-block p-2 shadow rounded"
						>
							Subscribe
						</a>
					</div>
				</div>

				<div className="col-lg-4 mb-5 mb-lg-0">
					<div className="bg-white p-5 rounded-lg shadow">
						<h1 className="h6 text-uppercase font-weight-bold mb-4">
							Pro
						</h1>
						<h2 className="h1 font-weight-bold">
							$399
							<span className="text-small font-weight-normal ml-2">
								/ month
							</span>
						</h2>

						<div className="custom-separator my-4 mx-auto bg-primary"></div>

						<ul className="list-unstyled my-5 text-small text-left font-weight-normal">
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								Lorem ipsum dolor sit amet
							</li>
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								Sed ut perspiciatis
							</li>
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								At vero eos et accusamus
							</li>
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								Nam libero tempore
							</li>
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								Sed ut perspiciatis
							</li>
							<li className="mb-3 text-muted">
								<i className="fa fa-times mr-2"></i>
								<del>Sed ut perspiciatis</del>
							</li>
						</ul>
						<a
							href="#"
							className="btn btn-primary btn-block p-2 shadow rounded"
						>
							Subscribe
						</a>
					</div>
				</div>

				<div className="col-lg-4">
					<div className="bg-white p-5 rounded-lg shadow">
						<h1 className="h6 text-uppercase font-weight-bold mb-4">
							Enterprise
						</h1>
						<h2 className="h1 font-weight-bold">
							$899
							<span className="text-small font-weight-normal ml-2">
								/ month
							</span>
						</h2>

						<div className="custom-separator my-4 mx-auto bg-primary"></div>

						<ul className="list-unstyled my-5 text-small text-left font-weight-normal">
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								Lorem ipsum dolor sit amet
							</li>
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								Sed ut perspiciatis
							</li>
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								At vero eos et accusamus
							</li>
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								Nam libero tempore
							</li>
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								Sed ut perspiciatis
							</li>
							<li className="mb-3">
								<i className="fa fa-check mr-2 text-primary"></i>{" "}
								Sed ut perspiciatis
							</li>
						</ul>
						<a
							href="#"
							className="btn btn-primary btn-block p-2 shadow rounded"
						>
							Subscribe
						</a>
					</div>
				</div>
			</div>
		</>
	);
};

export default CmPricing;
