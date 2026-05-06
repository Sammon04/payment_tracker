import { useNavigate } from "react-router-dom";

function Logout( {className }) {
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
        <button className={className} onClick={handleLogout}>
            Logout
        </button>
    );
}

export default Logout;