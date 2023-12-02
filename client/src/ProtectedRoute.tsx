import {Navigate, Outlet} from 'react-router-dom';

/**
 * The ProtectedRoute function checks if there is an access token in the session storage and renders
 * the Outlet component if there is, otherwise it navigates to the home page.
 * @returns either the `<Outlet />` component if there is an 'access_token' value stored in the
 * sessionStorage, or it returns the `<Navigate to="/" />` component if there is no 'access_token'
 * value stored.
 */
function ProtectedRoute() {
	return sessionStorage.getItem('access_token') ? (
		<Outlet />
	) : (
		<Navigate to="/" />
	);
}

export default ProtectedRoute;
