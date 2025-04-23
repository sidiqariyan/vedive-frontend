import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateBlogPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Other');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', tags);
    if (coverImage) formData.append('coverImage', coverImage);

    const apiBase = 'https://vedive.com';
    const res = await fetch(`${apiBase}/api/posts/create-blog-post`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (res.ok) {
      const post = await res.json();
      navigate(`/blogs`);
    } else {
      console.error('Create post failed:', await res.text());
      alert('Error creating post');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl mb-4 font-normal">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            className="w-full border rounded p-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setCoverImage(e.target.files[0])}
          />
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <select
            className="w-full border rounded p-2"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option>Technology</option>
            <option>Business</option>
            <option>Lifestyle</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Tags (comma-separated)</label>
          <input
            className="w-full border rounded p-2"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Content (HTML)</label>
          <textarea
            className="w-full border rounded p-2 h-48"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Enter HTML content here"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Publish
        </button>
      </form>
    </div>
  );
}