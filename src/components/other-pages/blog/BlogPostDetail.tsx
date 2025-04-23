import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Tag, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  category: string;
  tags: string[];
  coverImage: string | null;
  readTime: number;
  createdAt: string;
  views: number;
}

const BlogPostDetail: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://vedive.com:3000/api/blog/blog-posts/${identifier}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    if (identifier) {
      fetchPost();
    }
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-lg">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error || 'Post not found'}</p>
          <Link 
            to="/blogs" 
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(post.createdAt), 'MMMM dd, yyyy');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link 
        to="/blogs" 
        className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to all posts
      </Link>
      
      {/* Post header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center text-gray-600 gap-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{post.author?.username || 'Unknown Author'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{post.readTime} min read</span>
          </div>
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            <span>{post.category}</span>
          </div>
        </div>
      </div>
      
      {/* Cover image */}
      {post.coverImage && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <img 
            src={post.coverImage.startsWith('http') ? post.coverImage : `https://vedive.com:3000/${post.coverImage}`}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      {/* Post content */}
      <article className="prose lg:prose-lg max-w-none">
        <div 
          dangerouslySetInnerHTML={{ __html: post.content }} 
          className="blog-content"
        />
      </article>
      
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostDetail;