import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://vedive.com:3000/api/blog/blog-posts')
      .then(res => setPosts(res.data.posts))
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await axios.delete(`https://vedive.com:3000/api/blog/delete-blog-post/${id}`);
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
        <button
          onClick={() => navigate('/admin/blog/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >New Post</button>
      </div>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Title</th>
            <th className="p-2">Category</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.title}</td>
              <td className="p-2">{p.category}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => navigate(`/admin/blog/edit/${p.id}`)}
                  className="text-blue-600"
                >Edit</button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600"
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
