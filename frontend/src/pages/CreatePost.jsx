import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../components/PostsContext";
import { useAuth } from "../components/AuthContext";

const CreatePost = () => {
  const { createPost } = usePosts();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    topic: "",
    content: "",
    image: null,
    audio: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [audioName, setAudioName] = useState("");
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        audio: file
      });
      setAudioName(file.name);
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveAudio = () => {
    setFormData({
      ...formData,
      audio: null
    });
    setAudioName("");
    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    const result = await createPost(formData);
    
    if (result.success) {
      navigate('/posts');
    } else {
      setErrors(result.error || { detail: "Failed to create post" });
      setIsLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="create-post-container">
      <h2>Create Post</h2>
      
      {errors.detail && <div className="error-message">{errors.detail}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Topic:</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            placeholder="Enter a topic for your post"
          />
          {errors.topic && <div className="error-message">{errors.topic}</div>}
        </div>
        
        <div className="form-group">
          <label>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Share your thoughts... You can also paste YouTube URLs to embed videos!"
            rows={5}
          />
          {errors.content && <div className="error-message">{errors.content}</div>}
        </div>
        
        <div className="form-group">
          <label>Image (optional):</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
          />
          {errors.image && <div className="error-message">{errors.image}</div>}
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button type="button" onClick={handleRemoveImage} className="remove-button">
                Remove Image
              </button>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label>Audio (optional):</label>
          <input
            type="file"
            ref={audioInputRef}
            onChange={handleAudioChange}
            accept="audio/*"
          />
          {errors.audio && <div className="error-message">{errors.audio}</div>}
          
          {audioName && (
            <div className="audio-preview">
              <p>{audioName}</p>
              <button type="button" onClick={handleRemoveAudio} className="remove-button">
                Remove Audio
              </button>
            </div>
          )}
        </div>
        
        <div className="button-group">
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() => navigate('/posts')}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost; 