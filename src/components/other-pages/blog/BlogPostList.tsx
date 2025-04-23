import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import BlogCard from './BlogCard';
import Pagination from './Pagination';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  author: string;
  category: string;
  readTime: number;
  createdAt: string;
}

const BlogPostList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const postsPerPage = 12;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://vedive.com:3000/api/blog/blog-posts`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('authToken');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-lg">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Latest Blog Posts</h1>
          <p className="mt-2 text-gray-600">
            Discover insights, tips, and stories from our team
          </p>
        </div>
        
        {isAuthenticated && (
          <Link 
            to="/blog/create" 
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Post
          </Link>
        )}
      </div>
      
      {/* Search bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search posts..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-medium text-gray-900">No posts found</h2>
          <p className="mt-2 text-gray-600">
            {searchTerm ? `No posts matching "${searchTerm}"` : 'No blog posts have been published yet'}
          </p>
        </div>
      ) : (
        <>
          {/* Posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                slug={post.slug}
                content={post.content}
                coverImage={post.coverImage}
                author={post.author}
                category={post.category}
                readTime={post.readTime}
                createdAt={post.createdAt}
              />
            ))}
          </div>
          
          {/* Pagination */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={paginate} 
          />
        </>
      )}
    </div>
  );
};

export default BlogPostList;