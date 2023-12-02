import {useState, useEffect, useContext} from 'react';
import {useCookies} from 'react-cookie';
import {AccountContext} from './services/Account';
import {Navigate, Outlet} from 'react-router-dom';

// users from hosted login will be redirected to MFA page if they have not finish setting up their MFA

function MFAProtectedRoute() {
	const [cookie] = useCookies();
	const {getSession} = useContext(AccountContext) || {};
	const [isMFAAuthenticated, setIsMFAAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true); // To track loading state

	useEffect(() => {
		async function checkMFAAuthentication() {
			if (getSession) {
				try {
					const {mfaEnabled} = await getSession();
					if (!mfaEnabled) {
						setIsMFAAuthenticated(false);
					} else {
						setIsMFAAuthenticated(true);
					}
				} catch (error) {
					if (cookie['userData']) {
						setIsMFAAuthenticated(true);
					}
				} finally {
					setLoading(false);
				}
			}
		}
		checkMFAAuthentication();
	}, [getSession, cookie]);

	if (loading) return null;
	return isMFAAuthenticated ? <Outlet /> : <Navigate to="/mfa" />;
}

export default MFAProtectedRoute;
