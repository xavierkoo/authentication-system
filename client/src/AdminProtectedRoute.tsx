import {useState, useEffect, useContext} from 'react';
import {useCookies} from 'react-cookie';
import {AccountContext} from './services/Account';
import {Navigate, Outlet} from 'react-router-dom';

function AdminProtectedRoute() {
	const [cookie] = useCookies();
	const {getSession} = useContext(AccountContext) || {};
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function checkAdmin() {
			if (getSession) {
				try {
					const sessionData = await getSession();
					const sessionIsAdmin =
						sessionData['custom:role'] === 'admin' ||
						sessionData['custom:role'] === 'super_admin';
					setIsAdmin(sessionIsAdmin);
				} catch (error) {
					if (cookie['userData']) {
						setIsAdmin(false);
					}
				} finally {
					setLoading(false);
				}
			} else {
				setIsAdmin(false);
				setLoading(false);
			}
		}
		checkAdmin();
	}, [getSession, cookie]);

	if (isAdmin === null) return null; // Do not render anything until admin status is confirmed
	if (loading) return <p>Loading...</p>;
	return isAdmin ? <Outlet /> : <Navigate to="/home" />;
}

export default AdminProtectedRoute;
