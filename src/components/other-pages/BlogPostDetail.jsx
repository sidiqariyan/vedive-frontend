import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Pages/Hero/Navbar';
import Footer from '../Pages/Hero/Footer';

const BlogPostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);
  const { slug } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://vedive.com:3000/api/blog/blog-posts/${slug}`
        );
        setPost(response.data);
        setError('');
        
        // Try to fetch related posts, but don't fail the whole page if this fails
        try {
          const relatedResponse = await axios.get(
            `https://vedive.com:3000/api/blog/blog-posts/related/${slug}`
          );
          if (relatedResponse.data && Array.isArray(relatedResponse.data)) {
            setRelatedPosts(relatedResponse.data);
          }
        } catch (relatedErr) {
          console.log('Unable to fetch related posts:', relatedErr);
          // Just set empty array, don't show error to user
          setRelatedPosts([]);
        }
        
      } catch (err) {
        console.error('Error fetching blog post:', err.response || err);
        setError('Failed to load the blog post. It may have been removed or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  // Add custom styles to match the editor styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .blog-content h1 {
        font-size: 2rem;
        line-height: 1.3;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
      }
      @media (min-width: 768px) {
        .blog-content h1 {
          font-size: 2.5rem;
        }
      }
      .blog-content h2 {
        font-size: 1.5rem;
        line-height: 1.35;
        font-weight: 600;
        margin-top: 1.75rem;
        margin-bottom: 0.875rem;
      }
      @media (min-width: 768px) {
        .blog-content h2 {
          font-size: 2rem;
        }
      }
      .blog-content h3 {
        font-size: 1.25rem;
        line-height: 1.4;
        font-weight: 500;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
      }
      @media (min-width: 768px) {
        .blog-content h3 {
          font-size: 1.5rem;
        }
      }
      .blog-content p {
        font-size: 1rem;
        line-height: 1.75;
        margin-bottom: 1rem;
      }
      .blog-content strong {
        font-weight: bold;
      }
      
      /* Main bullet points */
      .blog-content ul {
        list-style-type: disc;
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding-left: 1.5rem;
      }
      @media (min-width: 768px) {
        .blog-content ul {
          padding-left: 2rem;
        }
      }
      .blog-content ol {
        list-style-type: decimal;
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding-left: 1.5rem;
      }
      @media (min-width: 768px) {
        .blog-content ol {
          padding-left: 2rem;
        }
      }
      
      /* Nested bullet points */
      .blog-content ul ul {
        list-style-type: circle;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .blog-content ol ol {
        list-style-type: lower-alpha;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }
      
      /* List items */
      .blog-content li {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        display: list-item;
      }
      
      /* Ensure markers are visible */
      .blog-content ul > li::marker,
      .blog-content ol > li::marker {
        color: inherit;
      }
      
      /* Make images responsive */
      .blog-content img {
        max-width: 100%;
        height: auto;
        margin: 1rem auto;
      }
      
      /* Responsive table styles */
      .blog-content table {
        width: 100%;
        overflow-x: auto;
        display: block;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }
      @media (min-width: 768px) {
        .blog-content table {
          display: table;
        }
      }
      .blog-content th,
      .blog-content td {
        border: 1px solid #e2e8f0;
        padding: 0.5rem;
        text-align: left;
      }
      
      /* Responsive blockquote */
      .blog-content blockquote {
        border-left: 4px solid #e2e8f0;
        padding-left: 1rem;
        margin-left: 0;
        margin-right: 0;
        font-style: italic;
      }
      @media (min-width: 768px) {
        .blog-content blockquote {
          margin-left: 1rem;
          margin-right: 1rem;
          padding-left: 1.5rem;
        }
      }
      
      /* Code blocks */
      .blog-content pre {
        background-color: #f7fafc;
        padding: 1rem;
        border-radius: 0.25rem;
        overflow-x: auto;
        margin-bottom: 1rem;
      }
      .blog-content code {
        font-family: monospace;
        background-color: #f7fafc;
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
      }
    `;

    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-red-100 text-red-700 rounded-lg">
      <h2 className="text-xl font-normal mb-2">Error</h2>
      <p>{error}</p>
    </div>
  );
  
  if (!post) return null;

  return (
    <>
      <Navbar />
      <div className="w-full bg-white">
        {/* Blog Post Title Section - Centered like in the image */}
        <div className="text-center max-w-4xl mx-auto pt-6 pb-4 px-4 md:pt-8 md:pb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">{post.title}</h1>
          <div className="flex flex-wrap items-center justify-center text-sm md:text-base space-x-2 mb-2">
            <span>{post.authorName}</span>
            <span className="hidden md:inline">•</span>
            <time dateTime={post.createdAt} className="block md:inline mt-1 md:mt-0">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </time>
            <span className="hidden md:inline">•</span>
            <span className="text-gray-600 block md:inline mt-1 md:mt-0">{post.category}</span>
          </div>
        </div>

        {/* Cover Image - Responsive */}
        {post.coverImage && (
          <div className="mb-6 md:mb-8 flex justify-center px-4">
            <img
              src={
                post.coverImage.startsWith('http')
                  ? post.coverImage
                  : `https://vedive.com:3000${post.coverImage}`
              }
              alt={post.title}
              className="w-full max-w-full md:max-w-3xl lg:max-w-4xl object-cover rounded"
              style={{ maxHeight: "545px", objectFit: "cover" }}
              onError={e => {
                console.error('Image failed to load:', post.coverImage);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="max-w-4xl mx-auto px-4 pb-8 md:pb-12">
          <div
            className="blog-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags?.length > 0 && (
            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm whitespace-nowrap mb-2">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts Section - Only show if posts exist */}
          {relatedPosts.length > 0 && (
            <div className="mt-10 md:mt-16">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Related Blog posts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={relatedPost.coverImage || "/placeholder.png"} 
                      alt={relatedPost.title}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="p-3 md:p-4">
                      <h3 className="text-base md:text-lg font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                      <div className="flex flex-wrap items-start text-xs md:text-sm text-gray-600">
                        <div className="flex items-center mr-2">
                          <img 
                            src={relatedPost.authorImage || "/author-placeholder.png"} 
                            alt={relatedPost.authorName}
                            className="w-4 h-4 md:w-5 md:h-5 rounded-full mr-1"
                          />
                          <span className="truncate max-w-[80px]">{relatedPost.authorName}</span>
                        </div>
                        <span className="hidden sm:inline mx-1">•</span>
                        <time className="mr-2">{new Date(relatedPost.createdAt).toLocaleDateString()}</time>
                        <span className="hidden sm:inline mx-1">•</span>
                        <span className="truncate max-w-[80px]">{relatedPost.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPostDetail;