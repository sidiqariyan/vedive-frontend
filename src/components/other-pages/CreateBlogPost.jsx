import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { AuthContext } from '../Pages/Mailer/AuthContext'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const CreateBlogPost = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    metaTitle: '',
    metaDescription: '',
    category: 'General',
    tags: '',
    authorName: '',
    content: ''
  });
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [coverImage, setCoverImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Check if the user is authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      setMessage({ 
        text: 'You must be logged in to create a blog post.', 
        type: 'error' 
      });
    }
  }, [isLoggedIn]);

  const handleEditorChange = state => {
    setEditorState(state);
    const html = draftToHtml(convertToRaw(state.getCurrentContent()));
    setFormData(prev => ({ ...prev, content: html }));
  };

  const handleImageUploadCallBack = file => {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('image', file);
      axios.post('https://vedive.com:3000/api/blog/upload-image', form, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add authentication token
        }
      })
      .then(res => resolve({ data: { link: res.data.url } }))
      .catch(err => reject(err));
    });
  };

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = e => setCoverImage(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Redirect to login if not authenticated
    if (!isLoggedIn) {
      setMessage({ text: 'Please log in to create a blog post', type: 'error' });
      navigate('/login', { state: { returnUrl: '/create-blog' } });
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    
    if (!formData.title || !formData.content) {
      setMessage({ text: 'Title and content are required fields', type: 'error' });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const postData = new FormData();
      Object.keys(formData).forEach(key => postData.append(key, formData[key]));
      if (coverImage) postData.append('coverImage', coverImage);
      
      await axios.post(
        'https://vedive.com:3000/api/blog/create-blog-post',
        postData,
        { 
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
          } 
        }
      );
      
      setMessage({ text: 'Blog post created successfully!', type: 'success' });
      setFormData({ title: '', metaTitle: '', metaDescription: '', category: 'General', tags: '', authorName: '', content: '' });
      setEditorState(EditorState.createEmpty());
      setCoverImage(null);
      
      // Redirect to blog list after successful creation
      setTimeout(() => {
        navigate('/blogs');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.response && error.response.status === 401) {
        setMessage({ text: 'Your session has expired. Please log in again.', type: 'error' });
        navigate('/login', { state: { returnUrl: '/create-blog' } });
      } else {
        setMessage({ 
          text: error.response?.data?.message || 'Error creating post. Please try again.', 
          type: 'error' 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
    .rdw-editor-wrapper h1 { font-size: 1.875rem; font-weight: normal; line-height: 1.2; }
    .rdw-editor-wrapper h2 { font-size: 1.5rem; font-weight: normal; line-height: 1.3; }
    .rdw-editor-wrapper h3 { font-size: 1.25rem; font-weight: normal; line-height: 1.4; }
  `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-normal mb-6">Create a New Blog Post</h2>
      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
          {!isLoggedIn && (
            <div className="mt-2">
              <button 
                onClick={() => navigate('/login', { state: { returnUrl: '/create-blog' } })}
                className="text-blue-700 underline"
              >
                Log in now
              </button>
            </div>
          )}
        </div>
      )}

      {isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          {/* Title & Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="title" className="block mb-1">Title *</label>
              <input name="title" id="title" value={formData.title} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label htmlFor="metaTitle" className="block mb-1">Meta Title</label>
              <input name="metaTitle" id="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="metaDescription" className="block mb-1">Meta Description</label>
            <textarea name="metaDescription" id="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={3} className="w-full border px-3 py-2 rounded" />
          </div>

          {/* DraftJS Editor */}
          <div className="mb-4">
            <label className="block mb-1">Content *</label>
            <Editor
              editorState={editorState}
              toolbarClassName="border mb-2"
              wrapperClassName="border rounded"
              editorClassName="p-3 min-h-[300px]"
              onEditorStateChange={handleEditorChange}
              toolbar={{
                options: ['inline', 'blockType', 'list', 'link', 'image', 'history'],
                inline: { options: ['bold', 'italic', 'underline'] },
                blockType: { inDropdown: false, options: ['Normal', 'H1', 'H2', 'H3'] },
                list: { options: ['unordered', 'ordered'] },
                image: {
                  uploadCallback: handleImageUploadCallBack,
                  previewImage: true,
                  alt: { present: false, mandatory: false }
                }
              }}
            />
          </div>

          {/* Category, Tags, Author, Cover */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="category" className="block mb-1">Category</label>
              <select name="category" id="category" value={formData.category} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="tags" className="block mb-1">Tags (comma separated)</label>
              <input name="tags" id="tags" value={formData.tags} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="authorName" className="block mb-1">Your Name</label>
            <input name="authorName" id="authorName" value={formData.authorName} onChange={handleChange} placeholder="Anonymous" className="w-full border px-3 py-2 rounded" />
          </div>
          <div className="mb-6">
            <label htmlFor="coverImage" className="block mb-1">Cover Image</label>
            <input type="file" id="coverImage" accept="image/*" onChange={handleFileChange} />
            <p className="text-sm text-gray-500 mt-1">Max 5MB. JPEG/PNG/WebP.</p>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className={`bg-blue-500 text-white px-6 py-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          >
            {isSubmitting ? 'Publishing…' : 'Publish Blog Post'}
          </button>
        </form>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg mb-4">You need to be logged in to create a blog post.</p>
          <button 
            onClick={() => navigate('/login', { state: { returnUrl: '/create-blog' } })}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Log in
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateBlogPost;