// src/components/other-pages/CreateBlogPost.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAuth } from "../Pages/Mailer/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreateBlogPost() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    metaTitle: "",
    metaDescription: "",
    category: "General",
    tags: "",
    authorName: "",
    content: ""
  });

  const [coverImage, setCoverImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Redirect if not admin
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login", { state: { returnUrl: "/create-blog" } });
      } else if (user.role !== "admin") {
        navigate("/");
      }
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  // Configure Quill editor modules and formats
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: function() {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          
          const quill = this.quill;
          input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;
            
            // Show loading state
            const range = quill.getSelection(true);
            quill.insertText(range.index, 'Uploading image...', 'user');
            quill.setSelection(range.index + 18);
            
            try {
              const form = new FormData();
              form.append("image", file);
              
              const res = await axios.post("/api/blog/upload-image", form, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
              });
              
              // Remove loading text
              quill.deleteText(range.index, 18);
              
              // Insert image with proper URL
              const imageUrl = res.data.url;
              
              // Ensure the URL is absolute with your domain and port
              let fullImageUrl;
              if (imageUrl.startsWith('http')) {
                fullImageUrl = imageUrl;
              } else {
                // For your specific setup, construct the full URL
                const baseUrl = 'https://vedive.com:3000';
                fullImageUrl = `${baseUrl}${imageUrl}`;
              }
              
              quill.insertEmbed(range.index, 'image', fullImageUrl);
              quill.setSelection(range.index + 1);
              
            } catch (err) {
              console.error("Image upload failed:", err);
              // Remove loading text on error
              quill.deleteText(range.index, 18);
              setMessage({ text: "Image upload failed. Please try again.", type: "error" });
            }
          };
        }
      }
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setMessage({ text: "Title and content are required fields", type: "error" });
      return;
    }
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const postData = new FormData();
      Object.entries(formData).forEach(([key, val]) => postData.append(key, val));
      if (coverImage) postData.append("coverImage", coverImage);

      await axios.post(
        "/api/blog/create-blog-post",
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setMessage({ text: "Blog post created successfully!", type: "success" });
      setFormData({ 
        title: "", 
        metaTitle: "", 
        metaDescription: "", 
        category: "General", 
        tags: "", 
        authorName: "", 
        content: "" 
      });
      setCoverImage(null);
      setTimeout(() => navigate("/blogs"), 2000);
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.response?.status === 401) {
        setMessage({ text: "Your session has expired. Please log in again.", type: "error" });
        navigate("/login", { state: { returnUrl: "/create-blog" } });
      } else {
        setMessage({ text: error.response?.data?.message || "Error creating post. Please try again.", type: "error" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
              <p className="text-gray-600 mt-2">Share your thoughts and ideas with the world</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            message.type === "success" 
              ? "bg-green-50 border-green-400 text-green-800" 
              : "bg-red-50 border-red-400 text-red-800"
          }`}>
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full mr-3 ${
                message.type === "success" ? "bg-green-400" : "bg-red-400"
              }`}>
                <svg className="w-3 h-3 text-white ml-1 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  {message.type === "success" ? (
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  )}
                </svg>
              </div>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter an engaging title for your blog post"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Meta Title
                    <span className="text-gray-400 text-xs ml-1">(SEO)</span>
                  </label>
                  <input
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    placeholder="SEO-optimized title (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                  <span className="text-gray-400 text-xs ml-1">(SEO)</span>
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of your post for search engines (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                />
                <p className="text-xs text-gray-500">Recommended: 120-160 characters</p>
              </div>
            </div>

            {/* Content Section */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                Content
              </h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Blog Content <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                    modules={modules}
                    formats={formats}
                    placeholder="Start writing your amazing blog post here..."
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Categorization Section */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                Categorization
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Technology">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                    <span className="text-gray-400 text-xs ml-1">(comma-separated)</span>
                  </label>
                  <input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="react, javascript, web development"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Media & Author Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                Media & Author
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Author Name</label>
                  <input
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    placeholder="Your name (leave blank for Anonymous)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Maximum file size: 5MB. Supported formats: JPEG, PNG, WebP</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/blogs")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isSubmitting 
                      ? "bg-gray-400 text-white cursor-not-allowed opacity-75" 
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </span>
                  ) : (
                    "Publish Blog Post"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Styles */}
      <style jsx global>{`
        .ql-container {
          min-height: 350px;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-top: none;
          font-size: 16px;
        }
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        .ql-toolbar .ql-stroke {
          stroke: #6b7280;
        }
        .ql-toolbar .ql-fill {
          fill: #6b7280;
        }
        .ql-toolbar button:hover {
          background-color: #e5e7eb;
        }
        .ql-toolbar button.ql-active {
          background-color: #dbeafe;
          color: #2563eb;
        }
        .ql-editor {
          font-size: 16px;
          line-height: 1.6;
          padding: 20px;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 15px auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        /* Custom scrollbar for the editor */
        .ql-editor {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .ql-editor::-webkit-scrollbar {
          width: 6px;
        }
        .ql-editor::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .ql-editor::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .ql-editor::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}