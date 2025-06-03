import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../Pages/Hero/Navbar';
import Footer from '../Pages/Hero/Footer';

// Memoized utility to strip HTML tags
const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '');

// Memoized image URL builder
const buildImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return '';
  return imageUrl.startsWith('http') ? imageUrl : `https://vedive.com:3000${imageUrl}`;
};

const POSTS_PER_PAGE = 12;

// Memoized post card component to prevent unnecessary re-renders
const PostCard = React.memo(({ post }) => {
  const imageUrl = useMemo(() => buildImageUrl(post.coverImage), [post.coverImage]);
  const authorImageUrl = useMemo(() => buildImageUrl(post.authorAvatar), [post.authorAvatar]);
  const excerpt = useMemo(() => stripHtml(post.content).slice(0, 400), [post.content]);
  const formattedDate = useMemo(() => new Date(post.createdAt).toLocaleDateString(), [post.createdAt]);

  return (
    <Link
      to={`/${post.slug}`}
      className="block bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
    >
      <div className="w-[455px] h-[347px] overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-white">
          {post.title}
        </h3>
        <p className="text-gray-300 mb-4 line-clamp-3">
          {excerpt}…
        </p>
        <div className="flex items-center text-sm text-gray-400 space-x-2">
          {authorImageUrl && (
            <img
              src={authorImageUrl}
              alt={post.authorName}
              className="h-6 w-6 rounded-full object-cover"
              loading="lazy"
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
          <span>{post.authorName}</span>
          <span>•</span>
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{post.category}</span>
        </div>
      </div>
    </Link>
  );
});

// Memoized featured banner component - now clickable
const FeaturedBanner = React.memo(({ post }) => {
  const imageUrl = useMemo(() => buildImageUrl(post.coverImage), [post.coverImage]);
  const excerpt = useMemo(() => stripHtml(post.content).substring(0, 80), [post.content]);
  const formattedDate = useMemo(() => new Date(post.createdAt).toLocaleDateString(), [post.createdAt]);

  return (
    <Link
      to={`/${post.slug}`}
      className="block relative h-96 bg-cover bg-center hover:scale-[1.02] transition-transform duration-300"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-40 transition-all duration-300 flex flex-col justify-end p-8">
        <h1 className="text-4xl font-bold mb-2 hover:text-blue-300 transition-colors duration-300">
          {post.title}
        </h1>
        <p className="mb-4">{excerpt}…</p>
        <div className="flex items-center text-sm text-gray-300">
          <span className="mr-4">{post.authorName}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
});

// Memoized pagination component
const Pagination = React.memo(({ currentPage, pageCount, onPageChange }) => {
  const handlePrevious = useCallback(() => {
    onPageChange(Math.max(currentPage - 1, 1));
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    onPageChange(Math.min(currentPage + 1, pageCount));
  }, [currentPage, pageCount, onPageChange]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }, [pageCount]);

  return (
    <div className="mt-8 flex justify-center items-center space-x-3 text-gray-400">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
      >
        Previous
      </button>
      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`px-3 py-1 rounded ${
            currentPage === pageNum ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          {pageNum}
        </button>
      ))}
      <button
        onClick={handleNext}
        disabled={currentPage === pageCount}
        className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
});

const BlogPostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Memoize API call to prevent recreation on every render
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('https://vedive.com:3000/api/blog/blog-posts');
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Memoize computed values
  const featured = useMemo(() => posts[0] || null, [posts]);
  const pageCount = useMemo(() => Math.ceil(posts.length / POSTS_PER_PAGE), [posts.length]);
  const pagedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [posts, currentPage]);

  // Memoize page change handler
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center p-6 bg-red-100 text-red-700 rounded-lg">{error}</div>
  );

  if (!posts.length) return (
    <div className="text-center p-10 bg-gray-800 text-white">
      <h2 className="text-2xl font-bold mb-4">No Blog Posts Yet</h2>
      <Link to="/create-blog" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
        Create A Post
      </Link>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="bg-gray-900 text-white flex flex-col">
        {/* Featured Banner */}
        {featured && <FeaturedBanner post={featured} />}

        {/* Recent Posts Grid */}
        <section className="max-w-[1408px] mx-auto px-4 py-12 flex-grow">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">
            Recent Blog Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pagedPosts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default BlogPostList;