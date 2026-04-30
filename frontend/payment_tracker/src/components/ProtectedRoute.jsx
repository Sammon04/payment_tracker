import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const [authed, setAuthed] = useState(null);

    useEffect(() => {
        fetch("/api/users/auth_check.php", { credentials: "include" })
            .then(res => setAuthed(res.ok))
            .catch(() => setAuthed(false));
    }, []);

    if (authed === null) return null;
    return authed ? children : navigate("/login");
}

export default ProtectedRoute;