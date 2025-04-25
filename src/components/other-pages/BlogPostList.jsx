import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../Pages/Hero/Navbar';
import Footer from '../Pages/Hero/Footer';

// Utility to strip HTML tags for excerpt (SSR-safe)
const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '');

const POSTS_PER_PAGE = 12;

const BlogPostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
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
    };
    fetchPosts();
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

  const featured = posts[0];
  const pageCount = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pagedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <>
      <Navbar />
      <div className="bg-gray-900 text-white flex flex-col">

        {/* Featured Banner */}
        {featured && (
          <div
            className="relative h-96 bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                typeof featured.coverImage === 'string' && featured.coverImage.startsWith('http')
                  ? featured.coverImage
                  : typeof featured.coverImage === 'string'
                    ? `https://vedive.com:3000${featured.coverImage}`
                    : ''
              })`
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-8">
              <h1 className="text-4xl font-bold mb-2">{featured.title}</h1>
              <p className="mb-4">
                {stripHtml(featured.content).substring(0, 80)}…
              </p>
              <div className="flex items-center text-sm text-gray-300">
                <span className="mr-4">{featured.authorName}</span>
                <span>{new Date(featured.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Posts Grid */}
        <section className="max-w-[1408px] mx-auto px-4 py-12 flex-grow">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">
            Recent Blog Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pagedPosts.map(post => (
              <Link
                key={post._id}
                to={`/blog/${post.slug}`}
                className="block bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
              >
                <div className="w-[455px] h-[347px] overflow-hidden">
                  {typeof post.coverImage === 'string' && (
                    <img
                      src={
                        post.coverImage.startsWith('http')
                          ? post.coverImage
                          : `https://vedive.com:3000${post.coverImage}`
                      }
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-white">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {stripHtml(post.content).slice(0, 400)}…
                  </p>
                  <div className="flex items-center text-sm text-gray-400 space-x-2">
                    {typeof post.authorAvatar === 'string' && (
                      <img
                        src={
                          post.authorAvatar.startsWith('http')
                            ? post.authorAvatar
                            : `https://vedive.com:3000${post.authorAvatar}`
                        }
                        alt={post.authorName}
                        className="h-6 w-6 rounded-full object-cover"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <span>{post.authorName}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center items-center space-x-3 text-gray-400">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(pageCount)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, pageCount))}
              disabled={currentPage === pageCount}
              className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default BlogPostList;
