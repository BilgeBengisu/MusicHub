import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">MusicHub</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/posts">Posts</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="nav-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/posts">Posts</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
