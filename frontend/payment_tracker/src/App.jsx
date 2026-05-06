import { BrowserRouter, Routes, Route, useNavigate, Link } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import styles from './App.module.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className={styles.siteHeader}>Sam's Payment Tracker</h1>
      <div className={styles.loginRegisterContainer}>
        <div className={styles.loginContainer}>
          <p className={styles.loginHeader}>Click here to log in:</p>
          <button className={styles.loginButton} onClick={() => navigate("/login")}>Login</button>
        </div>
        <div className={styles.registerContainer}>
          <p className={styles.registerHeader}>Need an account? Click here to register:</p>
          <button className={styles.registerButton} onClick={() => navigate("/register")}>Register</button>
        </div>        
      </div>
    </div>
  )
}

function App() {
  return (

    <BrowserRouter>
      <nav className={styles.navBar}>
        <div className={styles.navLinksSection}>
          <div className={styles.navItem}>
            <Link className={styles.navLink} to="/">Home</Link>
          </div>
          <div className={styles.navItem}>
            <Link className={styles.navLink} to="/login">Login</Link>
          </div>
          <div className={styles.navItem}>
            <Link className={styles.navLink} to="/register">Register</Link>
          </div>
          <div className={styles.navItem}>
            <Link className={styles.navLink} to="/dashboard">Dashboard</Link>
          </div>
        </div>
        <div className={styles.spacer} />
        <div className={`${styles.navItem} ${styles.logoutContainer}`}>
          <Logout className={styles.logoutButton}/>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>

  );

}

export default App
