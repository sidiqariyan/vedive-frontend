import React, { useState } from 'react';
import axios from 'axios';

const CreateBlogPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: '',
    authorName: ''
  });
  const [coverImage, setCoverImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const postData = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        postData.append(key, formData[key]);
      });
      
      // Append file if it exists
      if (coverImage) {
        postData.append('coverImage', coverImage);
      }

      const response = await axios.post('https://vedive.com:3000/api/blog/create-blog-post', postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ 
        text: 'Blog post created successfully!', 
        type: 'success' 
      });
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        category: 'General',
        tags: '',
        authorName: ''
      });
      setCoverImage(null);
      
      // Optional: redirect to the new post
      // window.location.href = `/blog/${response.data.slug}`;
      
    } catch (error) {
      console.error('Error creating post:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error creating post. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create a New Blog Post</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="authorName">
            Your Name
          </label>
          <input
            type="text"
            id="authorName"
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            placeholder="Anonymous"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="content">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="General">General</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="tags">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags" 
              value={formData.tags}
              onChange={handleChange}
              placeholder="tech, news, tutorial"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="coverImage">
            Cover Image
          </label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">Max size: 5MB. Formats: JPEG, PNG, WebP</p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Submitting...' : 'Publish Blog Post'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPost;