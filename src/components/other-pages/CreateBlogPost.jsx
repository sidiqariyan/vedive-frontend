// src/components/other-pages/CreateBlogPost.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
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

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
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

  const handleEditorChange = (state) => {
    setEditorState(state);
    const html = draftToHtml(convertToRaw(state.getCurrentContent()));
    setFormData(prev => ({ ...prev, content: html }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleImageUploadCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append("image", file);
      axios.post("/api/blog/upload-image", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(res => resolve({ data: { link: res.data.url } }))
      .catch(err => reject(err));
    });
  };

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
      setFormData({ title: "", metaTitle: "", metaDescription: "", category: "General", tags: "", authorName: "", content: "" });
      setEditorState(EditorState.createEmpty());
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-normal mb-6">Create a New Blog Post</h2>

      {message.text && (
        <div className={
          `mb-4 p-3 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`
        }>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Meta Title</label>
            <input
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Content *</label>
          <Editor
            editorState={editorState}
            toolbarClassName="border mb-2"
            wrapperClassName="border rounded"
            editorClassName="p-3 min-h-[300px]"
            onEditorStateChange={handleEditorChange}
            toolbar={{
              options: ["inline", "blockType", "list", "link", "image", "history"],
              image: {
                uploadCallback: handleImageUploadCallBack,
                previewImage: true
              }
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option>General</option>
              <option>Technology</option>
              <option>Lifestyle</option>
              <option>Travel</option>
              <option>Food</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Tags</label>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Your Name</label>
          <input
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            placeholder="Anonymous"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <p className="text-sm text-gray-500">Max 5MB. JPEG/PNG/WebP.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded text-white ${
            isSubmitting ? "opacity-50 cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Publishing…" : "Publish Blog Post"}
        </button>
      </form>
    </div>
  );
}
