import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditBlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState({ title:'', content:'', category:'', tags:[], coverImage:null });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://vedive.com:3000/api/blog/blog-posts/${id}`)
      .then(res => setPost(res.data))
      .catch(console.error);
  }, [id]);

  const handleChange = e => setPost({ ...post, [e.target.name]: e.target.value });
  const handleTags = e => setPost({ ...post, tags: e.target.value.split(',') });
  const handleFile = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    ['title','content','category'].forEach(f => data.append(f, post[f]));
    data.append('tags', post.tags.join(','));
    if (file) data.append('coverImage', file);
    await axios.put(`https://vedive.com:3000/api/blog/update-blog-post/${id}`, data, { headers:{ 'Content-Type':'multipart/form-data' }});
    navigate('/admin/blog');
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">Edit Post</h2>
      <input name="title" value={post.title} onChange={handleChange} placeholder="Title" className="w-full border p-2" />
      <textarea name="content" value={post.content} onChange={handleChange} placeholder="Content" className="w-full border p-2 h-40" />
      <input name="category" value={post.category} onChange={handleChange} placeholder="Category" className="w-full border p-2" />
      <input name="tags" value={post.tags.join(',')} onChange={handleTags} placeholder="tags,comma,separated" className="w-full border p-2" />
      <input type="file" onChange={handleFile} />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
