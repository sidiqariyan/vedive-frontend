import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BlogPostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://vedive.com:3000/api/blog/blog-posts');
        setPosts(response.data.posts);
        setError('');
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-6 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="text-center p-10 bg-primary">
        <h2 className="text-2xl font-bold mb-4">No Blog Posts Yet</h2>
        <p className="mb-6">Be the first to create a blog post!</p>
        <Link to="/create-blog" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
          Create A Post
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto bg-primary">
      <h1 className="text-3xl font-bold mb-8 text-center">Blog Posts</h1>
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
            {post.coverImage && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.coverImage.startsWith('http') 
                      ? post.coverImage 
                      : `https://vedive.com:3000${post.coverImage}`}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', post.coverImage);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
           
            <div className="p-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                {post.category}
              </span>
             
              <h2 className="text-xl font-bold mb-2 line-clamp-2">
                <Link to={`/blog/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>
             
              <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
             
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{post.authorName}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
             
              <Link
                to={`/blog/${post.slug}`}
                className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPostList;