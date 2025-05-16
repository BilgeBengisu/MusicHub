import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiEndpoints from '../services/api';

const PostsContext = createContext();

export const usePosts = () => useContext(PostsContext);

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiEndpoints.posts, {
        headers: token ? {
          'Authorization': `Token ${token}`
        } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    if (!token) return { success: false, error: { detail: 'User not authenticated' } };
    
    try {
      const formData = new FormData();
      
      formData.append('topic', postData.topic);
      formData.append('content', postData.content);
      
      if (postData.image) {
        formData.append('image', postData.image);
      }
      
      if (postData.audio) {
        formData.append('audio', postData.audio);
      }
      
      const response = await fetch(apiEndpoints.posts, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts(prevPosts => [newPost, ...prevPosts]);
        return { success: true, post: newPost };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: { detail: 'Failed to create post' } };
    }
  };

  const updatePost = async (id, postData) => {
    if (!token) return { success: false, error: { detail: 'User not authenticated' } };
    
    try {
      const formData = new FormData();
      
      formData.append('topic', postData.topic);
      formData.append('content', postData.content);
      
      if (postData.image instanceof File) {
        formData.append('image', postData.image);
      }
      
      if (postData.audio instanceof File) {
        formData.append('audio', postData.audio);
      }
      
      const response = await fetch(`${apiEndpoints.posts}${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(prevPosts => 
          prevPosts.map(post => post.id === id ? updatedPost : post)
        );
        return { success: true, post: updatedPost };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, error: { detail: 'Failed to update post' } };
    }
  };

  const deletePost = async (id) => {
    if (!token) return { success: false, error: { detail: 'User not authenticated' } };
    
    try {
      const response = await fetch(`${apiEndpoints.posts}${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.ok) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: { detail: 'Failed to delete post' } };
    }
  };

  const value = {
    posts,
    loading,
    fetchPosts,
    createPost,
    updatePost,
    deletePost
  };

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}; 