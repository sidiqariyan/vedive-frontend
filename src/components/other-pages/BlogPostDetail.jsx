import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Pages/Hero/Navbar';
import Footer from '../Pages/Hero/Footer';

const BlogPostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      } catch (err) {
        console.error('Error fetching blog post:', err.response || err);
        setError('Failed to load the blog post. It may have been removed or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

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
      <div className="max-w-4xl mx-auto pb-12 px-4 bg-primary">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg w-full">
            <img
              src={
                post.coverImage.startsWith('http')
                  ? post.coverImage
                  : `https://vedive.com:3000${post.coverImage}`
              }
              alt={post.title}
              className="w-full h-auto object-contain"
              onError={e => {
                console.error('Image failed to load:', post.coverImage);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <header className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">• {post.readTime} min read</span>
          </div>
          {/* Main title with updated styling - normal weight, larger size */}
          <h1 className="text-4xl md:text-5xl font-normal mb-4">{post.title}</h1>
          <div className="flex justify-between items-center text-gray-600">
            <span>By {post.authorName}</span>
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </time>
          </div>
        </header>

        {/* Updated prose styling to remove bold and adjust sizes */}
        <div
          className="prose prose-lg prose-invert max-w-none 
                    prose-headings:font-normal
                    prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4 prose-h1:font-normal
                    prose-h2:text-3xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:font-normal
                    prose-h3:text-2xl prose-h3:mt-5 prose-h3:mb-2 prose-h3:font-normal
                    prose-h4:text-xl prose-h4:mt-4 prose-h4:mb-2 prose-h4:font-normal
                    prose-h5:text-lg prose-h5:mt-3 prose-h5:mb-1 prose-h5:font-normal
                    prose-h6:text-base prose-h6:mt-3 prose-h6:mb-1 prose-h6:font-normal
                    prose-p:my-3 prose-p:font-normal
                    prose-ul:my-3 prose-ol:my-3
                    prose-li:my-1 prose-li:font-normal
                    prose-strong:font-normal
                    prose-em:not-italic"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags?.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            {/* Updated tag heading - normal weight */}
            <h2 className="text-xl font-normal mb-2">Tags:</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-6">
            Views: {post.views} • Published on {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPostDetail;