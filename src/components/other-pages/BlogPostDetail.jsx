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
        font-size: 2.5rem;
        line-height: 1.3;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1rem;
      }
      .blog-content h2 {
        font-size: 2rem;
        line-height: 1.35;
        font-weight: 600;
        margin-top: 1.75rem;
        margin-bottom: 0.875rem;
      }
      .blog-content h3 {
        font-size: 1.5rem;
        line-height: 1.4;
        font-weight: 500;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
      }
      .blog-content p {
        font-size: 1rem;
        line-height: 1.75;
        margin-bottom: 1rem;
      }
      .blog-content strong {
        font-weight: bold;
      }
      .blog-content ul,
      .blog-content ol {
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding-left: 1.25rem;
      }
      .blog-content li {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
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
    <div className="max-w-3xl mx-auto p-6 bg-red-100 text-red-700 rounded-lg">
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
        <div className="text-center max-w-4xl mx-auto pt-8 pb-6 px-4">
          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <img 
              src={post.authorImage || "/author-placeholder.png"} 
              alt={post.authorName}
              className="w-6 h-6 rounded-full"
            />
            <span>{post.authorName}</span>
            <span>•</span>
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span className="text-gray-600">{post.category}</span>
          </div>
        </div>

        {/* Cover Image - Full Width */}
        {post.coverImage && (
          <div className="mb-8 flex justify-center">
            <img
              src={
                post.coverImage.startsWith('http')
                  ? post.coverImage
                  : `https://vedive.com:3000${post.coverImage}`
              }
              alt={post.title}
              className="h-[545px] object-cover w-[896px] "
              onError={e => {
                console.error('Image failed to load:', post.coverImage);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <div
            className="blog-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts Section - Only show if posts exist */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Blog posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={relatedPost.coverImage || "/placeholder.png"} 
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{relatedPost.title}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="flex items-center">
                          <img 
                            src={relatedPost.authorImage || "/author-placeholder.png"} 
                            alt={relatedPost.authorName}
                            className="w-5 h-5 rounded-full mr-2"
                          />
                          <span>{relatedPost.authorName}</span>
                        </div>
                        <span className="mx-2">•</span>
                        <time>{new Date(relatedPost.createdAt).toLocaleDateString()}</time>
                        <span className="mx-2">•</span>
                        <span>{relatedPost.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination - Like in the image */}
          {/* <div className="mt-10 flex justify-center items-center space-x-2">
            <button className="px-3 py-1 border rounded">Previous</button>
            <button className="px-3 py-1 border rounded bg-gray-200">1</button>
            <button className="px-3 py-1 border rounded">2</button>
            <button className="px-3 py-1 border rounded">3</button>
            <button className="px-3 py-1 border rounded">4</button>
            <button className="px-3 py-1 border rounded">5</button>
            <button className="px-3 py-1 border rounded">Next</button>
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPostDetail;