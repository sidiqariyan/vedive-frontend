import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Pages/Hero/Navbar";

const PostForm = () => {
  const [post, setPost] = useState({
    name: "",
    description: "",
    tags: "",
    category: "",
    htmlContent: "<div>Edit your template here</div>",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });
    
    try {
      await axios.post("http://localhost:3000/api/posts", post);
      setMessage({ text: "Post created successfully!", type: "success" });
      // Optional: Clear form after success
      // setPost({ name: "", description: "", tags: "", category: "", htmlContent: "<div>Edit your template here</div>" });
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage({ text: "Error creating post. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-body">
      <Navbar />
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Post</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Post Title
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={post.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter post title"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            id="description"
            type="text"
            name="description"
            value={post.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of your post"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              id="category"
              type="text"
              name="category"
              value={post.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Technology, Health"
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              name="tags"
              value={post.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., react, web development"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="htmlContent" className="block text-sm font-medium text-gray-700 mb-1">
            HTML Content
          </label>
          <textarea
            id="htmlContent"
            name="htmlContent"
            value={post.htmlContent}
            onChange={handleChange}
            required
            rows="8"
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            placeholder="Enter HTML content here"
          />
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default PostForm;