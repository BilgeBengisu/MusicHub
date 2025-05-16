import { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, token, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profile_picture: null,
    bio: ""
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [bioLength, setBioLength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        profile_picture: null,
        bio: user.bio || ""
      });
      setBioLength(user.bio ? user.bio.length : 0);
      setPreviewUrl(user.profile_picture || null);
    }
  }, [user, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle bio character limit
    if (name === 'bio' && value.length > 150) {
      return;
    }
    
    if (name === 'bio') {
      setBioLength(value.length);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile_picture: file
      });
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      profile_picture: null,
      remove_picture: true
    });
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Create FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("bio", formData.bio || "");
    
    if (formData.profile_picture) {
      formDataToSend.append("profile_picture", formData.profile_picture);
    }
    
    if (formData.remove_picture) {
      formDataToSend.append("remove_picture", "true");
    }

    const result = await updateProfile(formDataToSend);
    
    if (result.success) {
      setEditing(false);
    } else {
      setErrors(result.error || { detail: "Update failed" });
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      {errors.detail && <div className="error-message">{errors.detail}</div>}
      
      <div className="profile-header">
        <div className="profile-image-container">
          {previewUrl || user.profile_picture ? (
            <img 
              src={editing ? previewUrl : user.profile_picture} 
              alt={user.username} 
              className="profile-header-image" 
            />
          ) : (
            <div className="profile-placeholder">
              {user.username ? user.username.charAt(0).toUpperCase() : "?"}
            </div>
          )}
        </div>
        <div className="profile-header-info">
          <h2 className="username-heading">{user.username}</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className="edit-profile-button">
              Edit Profile
            </button>
          )}
        </div>
      </div>
      
      {editing ? (
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label>
              Bio: <span className="char-count">{bioLength}/150</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              maxLength={150}
              rows={3}
              placeholder="Tell people a little about yourself..."
            />
            {errors.bio && <div className="error-message">{errors.bio}</div>}
          </div>
          
          <div className="form-group">
            <label>Profile Picture:</label>
            <input
              type="file"
              name="profile_picture"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            {errors.profile_picture && <div className="error-message">{errors.profile_picture}</div>}
          </div>
          
          {previewUrl && (
            <div className="profile-picture edit-mode">
              <img src={previewUrl} alt="Profile Preview" />
              <button type="button" onClick={handleRemoveImage} className="remove-image">
                Remove Image
              </button>
            </div>
          )}
          
          <div className="button-group">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          {user.bio && <div className="user-bio-container"><p className="user-bio">{user.bio}</p></div>}
          <p><strong>Email:</strong> {user.email}</p>
          <div className="button-group">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

