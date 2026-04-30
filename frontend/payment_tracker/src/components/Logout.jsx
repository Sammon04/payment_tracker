import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        
        const res = await fetch("api/users/logout.php", {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) {
            console.error("Request failed:", res.status);
            return;
        }

        navigate("/login");
        
    };

    return (
        <button onClick={handleLogout}>
            Log out
        </button>
    );
}

export default Logout;