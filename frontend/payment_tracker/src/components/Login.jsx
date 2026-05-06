import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/users/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        if (!res.ok) {
            console.error("Request failed:", res.status);
            return;
        }

        const data = await res.json();
        if (data.success) {
            navigate("/dashboard");
        }
    };

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
            <h1 className={styles.loginHeader}>Login</h1>
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