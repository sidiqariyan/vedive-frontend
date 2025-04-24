import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BlogPostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { slug } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        console.log('Fetching post with slug:', slug); // Debugging line
        const response = await axios.get(`https://vedive.com:3000/api/blog/blog-posts/${slug}`);
        console.log('Response:', response.data); // Debugging line
        setPost(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching blog post:', err.response || err);
        setError('Failed to load the blog post. It may have been removed or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-red-100 text-red-700 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 bg-primary">
      
      <article>
      {post.coverImage && (
  <div className="mb-8 rounded-lg overflow-hidden shadow-lg h-64 md:h-96">
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
        <header className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">• {post.readTime} min read</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex justify-between items-center text-gray-600">
            <span>By {post.authorName}</span>
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>
        
        <div className="prose prose-lg max-w-none">
          {/* If you're using a markdown library like react-markdown */}
          {/* <ReactMarkdown>{post.content}</ReactMarkdown> */}
          
          {/* Simple rendering of content with line breaks */}
          {post.content.split('\n').map((paragraph, index) => (
            paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
          ))}
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
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
      </article>
    </div>
  );
};

export default BlogPostDetail;