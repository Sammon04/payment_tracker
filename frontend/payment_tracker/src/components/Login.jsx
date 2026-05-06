import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        setError(null);
        e.preventDefault();

        const res = await fetch("/api/users/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || data.error) {
            setError(data.error ?? "Something went wrong");
            return;
        }

        navigate("/dashboard");

    };

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
            <h1 className={styles.loginHeader}>Login</h1>
            {error && <p className={styles.loginError}>{error}</p>}
            <input
                className={styles.loginInput}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className={styles.loginInput}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className={styles.loginButton} type="submit">Login</button>
        </form>

    );
}

export default Login;