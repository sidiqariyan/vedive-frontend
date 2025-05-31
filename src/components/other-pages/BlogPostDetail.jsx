import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import Slider from 'react-slick';
import Navbar from '../Pages/Hero/Navbar';
import Footer from '../Pages/Hero/Footer';
import AdminImage from "./admin.png"
// Import slick-carousel CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const BlogPostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [hotPosts, setHotPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [comment, setComment] = useState({ name: '', email: '', website: '', message: '' });
  const { slug } = useParams();

  const prefixImage = (img) =>
    img && typeof img === 'string'
      ? img.startsWith('http')
        ? img
        : `https://vedive.com:3000${img}`
      : '/placeholder.png';

  // FIXED: Uncommented and corrected the main blog post fetch
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        console.log('Fetching post with slug:', slug); // Debug log
        
        const response = await axios.get(
          `https://vedive.com:3000/api/blog/blog-posts/${slug}`
        );
        
        console.log('Post response:', response.data); // Debug log
        setPost(response.data);
        setError('');
        
        // Fetch related posts
        try {
          const rel = await axios.get(
            `https://vedive.com:3000/api/blog/blog-posts/related/${slug}`
          );
          setRelatedPosts(Array.isArray(rel.data) ? rel.data.slice(0, 3) : []);
        } catch (relatedError) {
          console.warn('Could not fetch related posts:', relatedError);
          setRelatedPosts([]);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load the blog post. It may have been removed or does not exist.');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get('https://vedive.com:3000/api/blog/blog-posts');
        const posts = Array.isArray(res.data.posts) ? res.data.posts : [];
        setAllPosts(posts);

        const recent = [...posts]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentPosts(recent);

        const shuffled = [...posts].sort(() => 0.5 - Math.random());
        setHotPosts(shuffled.slice(0, 5));

        const cats = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching posts for sidebar:', err);
      }
    };
    fetchAll();
  }, []);

  const handleCommentChange = (e) => {
    setComment({ ...comment, [e.target.name]: e.target.value });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log('Submit comment:', comment);
    // TODO: send comment to API
    setComment({ name: '', email: '', website: '', message: '' });
  };

  if (loading) return (
    <div className="bg-primary min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="bg-primary min-h-screen">
      <Navbar />
      <div className="w-full max-w-[1440px] mx-auto p-4">
        <div className="bg-red-100 text-red-700 rounded-lg p-8 text-center">
          <h2 className="text-2xl mb-2">Error</h2>
          <p>{error}</p>
          <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded">
            Go Back Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (!post) return (
    <div className="bg-primary min-h-screen">
      <Navbar />
      <div className="w-full max-w-[1440px] mx-auto p-4">
        <div className="text-center py-8">
          <h2 className="text-2xl mb-2">Post not found</h2>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">
            Go Back Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className='bg-primary'>
      <Navbar />

      <div className="w-full bg-[#04081D]">
        <div className="max-w-[1440px] mx-auto flex flex-col justify-center items-center h-[400px] text-center px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-primary font-semibold mb-2">
            {post.title}
          </h1>
          <div className="text-lg text-gray-400">
            {post.authorName} • {new Date(post.createdAt).toLocaleDateString()} • {post.category}
          </div>
        </div>
      </div>

      <div className="bg-primary w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8 items-start py-8">
        <main>
          {post.coverImage && (
            <img
              src={prefixImage(post.coverImage)}
              alt="cover"
              className="w-full mx-auto rounded mb-6"
              onError={(e) => (e.target.src = '/placeholder.png')}
            />
          )}
         <div
  className="blog-content prose-custom lg:prose-xl leading-relaxed w-full mx-auto mb-8"
  dangerouslySetInnerHTML={{ __html: post.content }}
/>

          {/* About Author */}
          <div className="flex items-center p-4 border rounded-lg mb-8">
            <img
              src={AdminImage}
              alt={post.authorName}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="text-xl font-semibold">About the Author</h3>
              <p className="text-gray-700">The admin is the site's main author, pouring creativity and insight into every article with a deep passion for storytelling, clear expression, and meaningful content that resonates with readers.</p>
            </div>
          </div>

          {/* Comment Box */}
          <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="name"
                value={comment.name}
                onChange={handleCommentChange}
                placeholder="Name"
                className="border p-2 rounded w-full"
                required
              />
              <input
                name="email"
                type="email"
                value={comment.email}
                onChange={handleCommentChange}
                placeholder="Email"
                className="border p-2 rounded w-full"
                required
              />
              <input
                name="website"
                value={comment.website}
                onChange={handleCommentChange}
                placeholder="Website"
                className="border p-2 rounded w-full"
              />
            </div>
            <textarea
              name="message"
              value={comment.message}
              onChange={handleCommentChange}
              placeholder="Comment Us:"
              className="border p-2 rounded w-full h-32"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
              Comment
            </button>
          </form>

          {/* Carousel of Other Posts */}
          {relatedPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Other Posts</h2>
              <Slider {...sliderSettings}>
                {relatedPosts.map((r) => (
                  <Link key={r.slug} to={`/${r.slug}`} className="block p-4">
                    <img
                      src={prefixImage(r.coverImage)}
                      alt={r.title}
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                    <h3 className="text-xl font-semibold">{r.title}</h3>
                  </Link>
                ))}
              </Slider>
            </div>
          )}

        </main>

        <aside className="sticky top-0 space-y-8 p-4">
          {/* Search */}
          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-gray-200 px-10 py-2 rounded-lg text-lg focus:outline-none focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Recent Posts</h3>
            <ul className="space-y-4">
              {recentPosts.map((rp, i) => (
                <li key={i} className="flex items-start gap-3">
                  <img
                    src={prefixImage(rp.coverImage)}
                    alt={rp.title}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => (e.target.src = '/placeholder.png')}
                  />
                  <Link
                    to={`/${rp.slug}`}
                    className="text-lg font-medium hover:text-blue-600 transition-colors line-clamp-3"
                  >
                    {rp.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hot Topics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Hot Topics</h3>
            <ul className="space-y-4">
              {hotPosts.map((hp, i) => (
                <li key={i} className="flex items-start gap-3">
                  <img
                    src={prefixImage(hp.coverImage)}
                    alt={hp.title}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => (e.target.src = '/placeholder.png')}
                  />
                  <Link
                    to={`/${hp.slug}`}
                    className="text-lg font-medium hover:text-blue-600 transition-colors line-clamp-3"
                  >
                    {hp.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <Link
                  key={i}
                  to={`/category/${encodeURIComponent(cat)}`}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg hover:bg-blue-200 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
          
        </aside>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPostDetail;