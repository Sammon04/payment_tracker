import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        setError(null);
        e.preventDefault();

        const res = await fetch("/api/users/register.php", {
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
        
        navigate("/login");
    };

    return (
        <form className={styles.registerForm} onSubmit={handleSubmit}>
            <h1 className={styles.registerHeader}>Register</h1>
            {error && <p className={styles.registerError}>{error}</p>}
            <input
                className={styles.registerInput}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className={styles.registerInput}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className={styles.registerButton} type="submit">Register</button>
        </form>
    );
}

export default Register;