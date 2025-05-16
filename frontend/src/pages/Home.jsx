import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="home-container">
      <h1>Welcome to MusicHub</h1>
      
      {user ? (
        <div>
          <p>Hello, {user.username}! You're now logged in.</p>
          <button onClick={() => navigate("/profile")}>Go to Profile</button>
        </div>
      ) : (
        <div>
          <p>Where music connects people</p>
          <div className="button-group">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

