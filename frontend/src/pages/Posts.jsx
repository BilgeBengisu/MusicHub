import { useState } from "react";
import { Link } from "react-router-dom";
import { usePosts } from "../components/PostsContext";
import { useAuth } from "../components/AuthContext";

const Posts = () => {
  const { posts, loading, deletePost } = usePosts();
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    
    setIsDeleting(true);
    const result = await deletePost(postToDelete.id);
    setIsDeleting(false);
    
    if (result.success) {
      setShowDeleteModal(false);
      setPostToDelete(null);
    } else {
      console.error("Failed to delete post:", result.error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Function to extract YouTube video ID from various YouTube URL formats
  const getYouTubeVideoId = (url) => {
    if (!url || typeof url !== 'string') return null;
    
    // Regular expressions for different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/, // Standard and shortened URLs
      /youtube\.com\/embed\/([^&\s]+)/, // Embed URLs
      /youtube\.com\/v\/([^&\s]+)/, // Old embed URLs
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    
    return null;
  };
  
  // Function to render content with embedded YouTube videos
  const renderContent = (content) => {
    if (!content) return null;
    
    // Split content by lines for processing
    const lines = content.split('\n');
    
    return (
      <>
        {lines.map((line, index) => {
          const videoId = getYouTubeVideoId(line.trim());
          
          if (videoId) {
            return (
              <div key={index} className="youtube-embed-container">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            );
          }
          
          return <p key={index}>{line}</p>;
        })}
      </>
    );
  };

  if (loading) {
    return <div className="loading-container">Loading posts...</div>;
  }

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h2>Posts</h2>
        {user && (
          <Link to="/posts/create" className="create-post-button">
            Create Post
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="no-posts-message">
          <p>No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3 className="post-topic">{post.topic}</h3>
                <div className="post-meta">
                  <span className="post-author">By {post.author_username}</span>
                  <span className="post-date">{formatDate(post.created_at)}</span>
                </div>
              </div>
              
              <div className="post-content">
                {renderContent(post.content)}
              </div>
              
              {post.image_url && (
                <div className="post-image">
                  <img src={post.image_url} alt={post.topic} />
                </div>
              )}
              
              {post.audio_url && (
                <div className="post-audio">
                  <audio controls>
                    <source src={post.audio_url} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              
              {user && user.id === post.author.id && (
                <div className="post-actions">
                  <button 
                    onClick={() => handleDeleteClick(post)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Delete Post</h3>
            <p>Are you sure you want to delete this post?</p>
            <p>This action cannot be undone.</p>
            
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="delete-button"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts; 