import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Navbar from '../Pages/Hero/Navbar';

const BlogPostListPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = { page, category, sortBy, sortOrder };
      if (search.trim() !== "") {
        params.search = search;
      }
      const response = await axios.get('/api/blog/blog-posts', { params });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching blog posts', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page, category, search, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-[#04081d] text-white">
      {/* Navigation */}
     <Navbar />

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Hero background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Migration to linear 101</h1>
            <p className="text-xl text-gray-300 mb-6">Our mission is to provide convenience and quality service to every marketing professional</p>
            <div className="flex items-center space-x-4 text-sm">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Author" className="w-8 h-8 rounded-full" />
              <span>Afroz uddin</span>
              <span>•</span>
              <span>28/01/2025</span>
              <span>•</span>
              <span>Technology</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Blog Posts */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Recent Blog posts</h2>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="General">General</option>
            <option value="Nature">Nature</option>
            <option value="Grooming">Grooming</option>
          </select>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <motion.article
                key={post._id}
                whileHover={{ y: -5 }}
                className="bg-gray-900 rounded-lg overflow-hidden"
              >
                <img
                  src={post.coverImage ? `https://vedive.com:3000${post.coverImage}` : "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">{post.content}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Author" className="w-6 h-6 rounded-full" />
                      <span>{post.author}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/blog-posts/${post._id}`)}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      Read more
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 bg-gray-900 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg ${page === i + 1 ? 'bg-blue-600' : 'bg-gray-900'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 bg-gray-900 rounded-lg disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostListPage;