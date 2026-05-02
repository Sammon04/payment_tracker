import { BrowserRouter, Routes, Route, useNavigate, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import styles from './App.module.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Sam's Payment Tracker</h1>
      <div>
        <p>Click here to log in:</p>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
      <div>
        <p>Need an account? Click here to register:</p>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  )
}

function App() {
  return (

    <BrowserRouter>
      <nav className={styles.navBar}>
        <div className={styles.navItem}>
          <Link to="/">Home</Link>
        </div>
        <div className={styles.navItem}>
          <Link to="/login">Login</Link>
        </div>
        <div className={styles.navItem}>
          <Link to="/register">Register</Link>
        </div>
        <div className={styles.navItem}>
          <Link to="/dashboard">Dashboard</Link>
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
