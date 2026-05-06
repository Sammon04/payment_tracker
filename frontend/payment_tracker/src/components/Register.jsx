import { useState } from "react";
import styles from "./Register.module.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/users/register.php", {
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
        console.log(data);
    };

    return (
        <form className={styles.registerForm} onSubmit={handleSubmit}>
            <h1 className={styles.registerHeader}>Register</h1>
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