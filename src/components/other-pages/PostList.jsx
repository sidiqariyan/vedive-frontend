import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../Pages/Hero/Navbar';
import { Helmet } from 'react-helmet';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories] = useState(['All', 'Technology', 'Business', 'Lifestyle', 'Other']);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      try {
        let url = `https://vedive.com:3000/api/blog/blog-posts?page=${currentPage}&limit=6`;
        if (selectedCategory && selectedCategory !== 'All') {
          url += `&category=${selectedCategory}`;
        }
        
        const response = await axios.get(url);
        
        // Check if response has expected structure
        if (response.data.posts) {
          setPosts(response.data.posts);
          setTotalPages(response.data.totalPages || 1);
        } else if (Array.isArray(response.data)) {
          // If the response is directly an array
          setPosts(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setPosts([]);
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError('Failed to load blog posts. Please try again later.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [currentPage, selectedCategory]);

  // Function to handle image URL formatting
  const getImageUrl = (post) => {
    if (!post || !post.coverImage) return '';
    
    // If it's already a full URL
    if (post.coverImage.startsWith('http')) {
      return post.coverImage;
    }
    
    // Otherwise, prepend the domain
    return `https://vedive.com${post.coverImage}`;
  };

  // Function to extract a text excerpt from HTML content
  const createExcerpt = (htmlContent, maxLength = 150) => {
    if (!htmlContent) return '';
    
    // Remove HTML tags
    const textContent = htmlContent.replace(/<\/?[^>]+(>|$)/g, '');
    
    // Trim and limit length
    if (textContent.length <= maxLength) return textContent;
    
    return textContent.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Blog | Vedive</title>
        <meta name="description" content="Read the latest articles and insights from Vedive's blog." />
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover insights, tips, and the latest updates from our team.
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category === 'All' ? '' : category);
                    setCurrentPage(1); // Reset to first page when changing category
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    (selectedCategory === category) || 
                    (category === 'All' && selectedCategory === '')
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-8 text-center">
              {error}
            </div>
          )}
          
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl text-gray-600">No blog posts found.</h3>
              {selectedCategory && (
                <p className="mt-2 text-gray-500">
                  Try selecting a different category or check back later.
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link 
                      to={`/blog/${post.slug || post._id}`}
                      className="block group h-full"
                    >
                      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                        {/* Feature Image */}
                        <div className="relative h-48 overflow-hidden">
                          {post.coverImage ? (
                            <img
                              src={getImageUrl(post)}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">No image</span>
                            </div>
                          )}
                          
                          {/* Category Badge */}
                          {post.category && (
                            <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                              {post.category}
                            </span>
                          )}
                        </div>
                        
                        <div className="p-5 flex flex-col flex-grow">
                          {/* Post Date */}
                          <div className="text-xs text-gray-500 mb-2">
                            {formatDate(post.createdAt)}
                          </div>
                          
                          {/* Title */}
                          <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h2>
                          
                          {/* Excerpt */}
                          <p className="text-gray-600 text-sm mb-4 flex-grow">
                            {createExcerpt(post.content)}
                          </p>
                          
                          {/* Read More */}
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-blue-600 text-sm font-medium group-hover:underline">
                              Read more
                            </span>
                            
                            {post.readTime && (
                              <span className="text-xs text-gray-500">
                                {post.readTime} min read
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Previous
                    </button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;