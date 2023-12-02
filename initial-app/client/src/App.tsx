import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
// import PatientListPage from '../src/components/exampleComponent'; // example of a component
import LoginPage from './pages/loginPage';
import './App.css';
import '../src/styles/styles.scss';
import SetPassword from './pages/setPassword';
import ProfilePage from './pages/profilePage';
import MfaPage from './pages/mfaPage';
import HomePage from './pages/homePage';
import CustomerManagementDashboard from './pages/CmDashboard';
import Enrollment from './pages/CmEnrollment';
import Logs from './pages/CmLogs';
import Orders from './pages/CmOrders';
import Pricing from './pages/CmPricing';

const App = () => {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/password" element={<SetPassword />} />
					<Route path="/mfa" element={<MfaPage />} />
					<Route path="/home" element={<HomePage />} />
					{/*TODO: protect the routes from non admins and differentiate based on admin roles*/}
					<Route path="/cm-dashboard" element={<CustomerManagementDashboard />} />
					<Route path="/cm-enrollment" element={<Enrollment />} />
					<Route path="/cm-logs" element={<Logs />} />
					<Route path="/cm-orders" element={<Orders />} />
					<Route path="/cm-pricing" element={<Pricing />} />
				</Routes>
			</Router>
		</>
	);
};

export default App;
