import { useState, useEffect, useContext } from "react";

import UserLogoutPopup from "../../components/UserLogout";
import { AccountContext } from "../admin/../../services/Account";
import AdminNavBar from "../../components/navigation/AdminNavBar";
const CmOrders = () => {
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
				<h1 className="mt-5 ms-5">Orders</h1>
			</div>
		</>
	);
};

export default CmOrders;
