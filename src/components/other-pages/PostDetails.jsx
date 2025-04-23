import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import Navbar from '../Pages/Hero/Navbar';

const PostDetail = () => {
  const { identifier } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://vedive.com:3000/api/blog/blog-posts/${identifier}`
        );
        // handle nested API shape (e.g., Strapi-like)
        const rawData = response.data.data?.attributes || response.data;
        setPost(rawData);
        console.log('Fetched post data:', rawData);
        
        // Fetch related posts if available
        if (rawData.category) {
          try {
            const relatedResponse = await axios.get(
              `https://vedive.com:3000/api/blog/blog-posts?category=${rawData.category}&limit=3`
            );
            const relatedData = relatedResponse.data.data || relatedResponse.data;
            const filteredRelated = Array.isArray(relatedData) 
              ? relatedData.filter(item => item.id !== rawData.id || item._id !== rawData._id)
              : [];
            setRelatedPosts(filteredRelated);
          } catch (err) {
            console.error("Error fetching related posts:", err);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
    // Scroll to top when post changes
    window.scrollTo(0, 0);
  }, [identifier]);

  // Determine image URL (coverImage might be nested)
  const getImageUrl = (postData) => {
    if (!postData) return '';
    
    // Check all possible image field structures based on the API response
    const coverImage = postData.coverImage || postData.image || null;
    
    // Handle different possible API response structures
    if (!coverImage) return '';
    
    // Case 1: Direct URL string
    if (typeof coverImage === 'string') {
      return coverImage.startsWith('http') 
        ? coverImage 
        : `https://vedive.com${coverImage}`;
    }
    
    // Case 2: Nested object with data.attributes.url (Strapi-like)
    if (coverImage.data?.attributes?.url) {
      const imagePath = coverImage.data.attributes.url;
      return imagePath.startsWith('http') 
        ? imagePath 
        : `https://vedive.com${imagePath}`;
    }
    
    // Case 3: Object with direct url property
    if (coverImage.url) {
      const imagePath = coverImage.url;
      return imagePath.startsWith('http') 
        ? imagePath 
        : `https://vedive.com${imagePath}`;
    }
    
    // Case 4: Express backend response from your API (as per the router code)
    if (postData.coverImage && typeof postData.coverImage === 'string') {
      return postData.coverImage.startsWith('http')
        ? postData.coverImage
        : `https://vedive.com${postData.coverImage}`;
    }
    
    return '';
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

  // Custom styles to ensure proper heading hierarchy in the rendered content
  const addCustomStyles = () => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .post-content h1 {
        font-size: 2.25rem;
        line-height: 2.5rem;
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-weight: 700;
      }
      .post-content h2 {
        font-size: 1.875rem;
        line-height: 2.25rem;
        margin-top: 1.75rem;
        margin-bottom: 0.75rem;
        font-weight: 700;
      }
      .post-content h3 {
        font-size: 1.5rem;
        line-height: 2rem;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        font-weight: 600;
      }
      .post-content h4 {
        font-size: 1.25rem;
        line-height: 1.75rem;
        margin-top: 1.25rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      .post-content h5 {
        font-size: 1.125rem;
        line-height: 1.75rem;
        margin-top: 1.25rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      .post-content h6 {
        font-size: 1rem;
        line-height: 1.5rem;
        margin-top: 1.25rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
    `;
    document.head.appendChild(styleTag);
  };

  useEffect(() => {
    addCustomStyles();
    return () => {
      // Clean up on unmount
      const styleElement = document.querySelector('style');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Article</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Article Not Found</h2>
          <p className="text-gray-700">We couldn't find the article you're looking for.</p>
        </div>
      </div>
    );
  }

  // Get image URL for the current post
  const imageUrl = getImageUrl(post);
  console.log('Resolved image URL:', imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 min-h-screen pb-16"
    >
      <Navbar />
      {/* Hero Image Section */}
      {imageUrl && (
        <div className="w-full h-64 md:h-96 relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}

      {/* Article Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden relative -mt-16 md:-mt-24 z-10">
          <div className="p-6 md:p-10">
            {/* Category & Date */}
            <div className="flex items-center justify-between mb-6">
              {post.category && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {post.category}
                </span>
              )}
              {post.publishedAt && (
                <span className="text-gray-500 text-sm">
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
              )}
            </div>

            {/* Title - Main H1 */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author Information */}
            {post.author && (
              <div className="flex items-center mb-8">
                {post.author.avatar && (
                  <img 
                    src={getImageUrl(post.author)} 
                    alt={post.author.username || post.author.name} 
                    className="w-10 h-10 rounded-full mr-4"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {post.author.username || post.author.name}
                  </p>
                  {post.author.title && (
                    <p className="text-sm text-gray-600">{post.author.title}</p>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none post-content"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(post.content) 
              }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article:</h3>
              <div className="flex space-x-4">
                <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => {
                const relatedImageUrl = getImageUrl(relatedPost);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                  >
                    {relatedImageUrl && (
                      <img 
                        src={relatedImageUrl} 
                        alt={relatedPost.title} 
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      {relatedPost.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {relatedPost.category}
                        </span>
                      )}
                      <h3 className="mt-2 text-lg font-bold text-gray-900 mb-3">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {relatedPost.excerpt || relatedPost.summary || 
                         (relatedPost.content && relatedPost.content.replace(/<[^>]+>/g, '').slice(0, 150) + '...')}
                      </p>
                      <button 
                        onClick={() => window.location.href = `/blog/${relatedPost.slug || relatedPost.id || relatedPost._id}`}
                        className="mt-4 text-blue-600 font-medium hover:text-blue-700 transition"
                      >
                        Read more →
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default PostDetail;