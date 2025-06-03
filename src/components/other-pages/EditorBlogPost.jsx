import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditBlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState({ title: '', content: '', category: '', tags: [], coverImage: null });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        
        const config = token ? {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        } : {};

        const response = await axios.get(`https://vedive.com:3000/api/blog/blog-posts/${id}`, config);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        if (error.response?.status === 401) {
          setError('Authentication required to edit posts');
          navigate('/login');
        } else {
          setError('Failed to load blog post');
        }
      }
    };
    
    fetchPost();
  }, [id, navigate]);

  const handleChange = e => setPost({ ...post, [e.target.name]: e.target.value });
  
  const handleTags = e => setPost({ ...post, tags: e.target.value.split(',').map(tag => tag.trim()) });
  
  const handleFile = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      
      // Append form fields
      data.append('title', post.title);
      data.append('content', post.content);
      data.append('category', post.category);
      data.append('tags', post.tags.join(','));
      
      // Only append file if one is selected
      if (file) {
        data.append('coverImage', file);
      }

      // Get authentication token from localStorage or wherever you store it
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        navigate('/login'); // or wherever your login page is
        return;
      }

      // Include Authorization header with JWT token
      const response = await axios.put(
        `https://vedive.com:3000/api/blog/update-blog-post/${id}`, 
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Update successful:', response.data);
      navigate('/admin/blog');
      
    } catch (error) {
      console.error('Error updating post:', error);
      
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Failed to update blog post');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-4 bg-white">
      <h2 className="text-2xl font-bold">Edit Post</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <input 
        name="title" 
        value={post.title || ''} 
        onChange={handleChange} 
        placeholder="Title" 
        className="w-full border p-2"
        required 
      />
      
      <textarea 
        name="content" 
        value={post.content || ''} 
        onChange={handleChange} 
        placeholder="Content" 
        className="w-full border p-2 h-40"
        required 
      />
      
      <input 
        name="category" 
        value={post.category || ''} 
        onChange={handleChange} 
        placeholder="Category" 
        className="w-full border p-2"
        required 
      />
      
      <input 
        name="tags" 
        value={post.tags?.join(',') || ''} 
        onChange={handleTags} 
        placeholder="tags,comma,separated" 
        className="w-full border p-2" 
      />
      
      <input type="file" onChange={handleFile} accept="image/*" />
      
      <button 
        type="submit" 
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}