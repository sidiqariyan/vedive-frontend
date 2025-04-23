import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface FormData {
  title: string;
  content: string;
  category: string;
  tags: string;
  coverImage: File | null;
}

const categories = ['Technology', 'Business', 'Lifestyle', 'Other'];

const CreatePostForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    category: 'Technology',
    tags: '',
    coverImage: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle rich text editor changes
  const handleEditorChange = (content: string) => {
    setFormData({
      ...formData,
      content,
    });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setFormData({
        ...formData,
        coverImage: file,
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { title, content, category, tags, coverImage } = formData;
      
      // Validation
      if (!title.trim() || !content.trim()) {
        throw new Error('Title and content are required');
      }
      
      // Create FormData for file upload
      const postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('category', category);
      postData.append('tags', tags);
      
      if (coverImage) {
        postData.append('coverImage', coverImage);
      }
      
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('You must be logged in to create a post');
      }
      
      // Send request to API
      const response = await fetch(`https://vedive.com:3000/api/posts/create-blog-post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: postData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create blog post');
      }
      
      const data = await response.json();
      
      // Redirect to the new post
      navigate(`/blog-posts/${data.slug || data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Cover Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Cover Image
        </label>
        <div 
          className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${
            imagePreview ? 'h-64' : 'h-40'
          }`}
          onClick={() => document.getElementById('coverImage')?.click()}
        >
          {imagePreview ? (
            <div className="relative w-full h-full">
              <img 
                src={imagePreview} 
                alt="Cover preview" 
                className="w-full h-full object-cover rounded" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white">Change Image</span>
              </div>
            </div>
          ) : (
            <>
              <Camera className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload cover image</p>
              <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WebP (max 5MB)</p>
            </>
          )}
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>
      
      {/* Title Input */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter post title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      {/* Content Editor */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Content *
        </label>
        <RichTextEditor
          initialValue={formData.content}
          onChange={handleEditorChange}
        />
      </div>
      
      {/* Category Dropdown */}
      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      {/* Tags Input */}
      <div className="space-y-2">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Enter tags separated by commas"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500">
          Separate tags with commas (e.g., web development, react, typescript)
        </p>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;