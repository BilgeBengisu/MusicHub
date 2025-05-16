import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    re_password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.re_password) {
      setErrors({ re_password: ["Passwords do not match"] });
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    const result = await register(formData);
    
    if (result.success) {
      navigate("/login");
    } else {
      // Log the detailed error
      console.log("Registration error details:", result.error);
      setErrors(result.error || { detail: "Registration failed" });
    }
    
    setIsLoading(false);
  };

  const renderErrors = (fieldErrors) => {
    if (!fieldErrors) return null;
    return (
      <div className="error-message">
        {Array.isArray(fieldErrors) ? fieldErrors.join(", ") : fieldErrors}
      </div>
    );
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {errors.detail && <div className="error-message">{errors.detail}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username: <span className="required-note">(must be unique)</span></label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {renderErrors(errors.username)}
        </div>
        <div className="form-group">
          <label>Email: <span className="required-note">(must be unique)</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {renderErrors(errors.email)}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {renderErrors(errors.password)}
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="re_password"
            value={formData.re_password}
            onChange={handleChange}
            required
          />
          {renderErrors(errors.re_password)}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
