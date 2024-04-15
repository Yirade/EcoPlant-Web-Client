// App.js

import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/Header';
import SensorPage from './pages/SensorPage';
import RegisterDevicePage from './pages/RegisterDevice'; 
import ViewDevice from './pages/ViewDevice'; 
import SettingsPage from './pages/SettingsPage'; 
import ProfilePage from './pages/ProfilePage';

function App() {
  const [cookies] = useCookies(['authToken']);

  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header />
          <PrivateRoute
            component={ViewDevice}
            path="/"
            exact
            isAuthenticated={!!cookies.authToken} 
          />
          <PrivateRoute 
            component={RegisterDevicePage}
            path="/register-device"
            isAuthenticated={!!cookies.authToken} 
          />
          <PrivateRoute 
            component={HomePage}
            path="/view-device"
            isAuthenticated={!!cookies.authToken} 
          />
          <PrivateRoute 
            component={ProfilePage}
            path="/profile-page"
            isAuthenticated={!!cookies.authToken} 
          />
          <PrivateRoute 
            component={SettingsPage}
            path="/settings"
            isAuthenticated={!!cookies.authToken} 
          />
          <Route
            render={() =>
              cookies.authToken ? (
                <Redirect to="/" />
              ) : (
                <Route component={LoginPage} path="/login" />
              )
            }
          />
          <Route
            render={() =>
              cookies.authToken ? (
                <Redirect to="/" />
              ) : (
                <Route component={RegisterPage} path="/register" />
              )
            }
          />
          <Route
            path="/sensor/:deviceId" 
            component={SensorPage}
          />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
