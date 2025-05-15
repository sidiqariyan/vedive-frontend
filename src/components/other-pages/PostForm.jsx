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
    image: null,
  });
  
  // State for template images
  const [templateImages, setTemplateImages] = useState([]);
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
      // Validate main image
      if (post.image) {
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(post.image.type)) {
          throw new Error("Invalid main image type");
        }
        if (post.image.size > 5 * 1024 * 1024) { // 5MB
          throw new Error("Main image exceeds 5MB limit");
        }
      }

      // Validate template images
      for (const file of templateImages) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          throw new Error(`Invalid file type: ${file.name}`);
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds 5MB limit`);
        }
      }

      // Prepare form data
// Inside handleSubmit
const formData = new FormData();
formData.append("name", post.name);
formData.append("description", post.description);
formData.append("tags", post.tags);
formData.append("category", post.category);
formData.append("htmlContent", post.htmlContent);

if (post.image) {
  formData.append("image", post.image);
}

if (templateImages.length > 0) {
  templateImages.forEach(file => {
    formData.append("templateImages", file);
  });
}
      // Submit to server
      await axios.post("https://vedive.com:3000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10000
      });

      setMessage({ text: "Post created successfully!", type: "success" });
      
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage({ 
        text: error.response?.data?.error || error.message || "Server unreachable",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-body">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Post</h2>
        
        {/* Message display */}
        {message.text && (
          <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Title */}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title"
            />
          </div>

          {/* Description */}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of your post"
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Technology, Health"
              />
            </div>

            {/* Tags */}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., react, web development"
              />
            </div>
          </div>

          {/* HTML Content */}
          <div>
            <label htmlFor="htmlContent" className="block text-sm font-medium text-gray-700 mb-1">
              {/* HTML Content (Use {{TEMPLATE_IMAGE_1}}, {{TEMPLATE_IMAGE_2}}, etc.) */}
            </label>
            <textarea
              id="htmlContent"
              name="htmlContent"
              value={post.htmlContent}
              onChange={handleChange}
              required
              rows="8"
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="Enter HTML content here"
            />
          </div>

          {/* Main Post Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Post Image (JPEG/PNG/WEBP, max 5MB)
            </label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setPost({ ...post, image: e.target.files[0] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {post.image && (
              <div className="mt-4">
                <img 
                  src={URL.createObjectURL(post.image)} 
                  alt="Main Preview" 
                  className="max-h-60 rounded shadow"
                />
              </div>
            )}
          </div>

          {/* Template Images */}
          <div>
            <label htmlFor="templateImages" className="block text-sm font-medium text-gray-700 mb-1">
              Template Images (for HTML content)
            </label>
            <input
              id="templateImages"
              type="file"
              name="templateImages"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => setTemplateImages(Array.from(e.target.files))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* Image previews */}
            {templateImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {templateImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Template ${index + 1}`}
                      className="w-full h-32 object-cover rounded shadow"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm truncate px-2">
                      {file.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
              ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
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