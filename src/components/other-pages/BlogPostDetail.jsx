import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import Slider from 'react-slick';
import Navbar from '../Pages/Hero/Navbar';
import Footer from '../Pages/Hero/Footer';
import AdminImage from "./admin.png";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Memoized image URL builder
const buildImageUrl = (img) => {
  if (!img || typeof img !== 'string') return '/placeholder.png';
  return img.startsWith('http') ? img : `https://vedive.com:3000${img}`;
};

// Memoized slider settings
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  lazyLoad: 'ondemand'
};

// Memoized sidebar item component
const SidebarPostItem = React.memo(({ post, linkPrefix = '' }) => {
  const imageUrl = useMemo(() => buildImageUrl(post.coverImage), [post.coverImage]);
  
  return (
    <li className="flex items-start gap-3">
      <img
        src={imageUrl}
        alt={post.title}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        loading="lazy"
        onError={(e) => (e.target.src = '/placeholder.png')}
      />
      <Link
        to={`${linkPrefix}/${post.slug}`}
        className="text-lg font-medium hover:text-blue-600 transition-colors line-clamp-3"
      >
        {post.title}
      </Link>
    </li>
  );
});

// Memoized related posts carousel
const RelatedPostsCarousel = React.memo(({ posts }) => {
  if (!posts.length) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Other Posts</h2>
      <Slider {...sliderSettings}>
        {posts.map((post) => (
          <Link key={post.slug} to={`/${post.slug}`} className="block p-4">
            <img
              src={buildImageUrl(post.coverImage)}
              alt={post.title}
              className="w-full h-48 object-cover rounded mb-2"
              loading="lazy"
            />
            <h3 className="text-xl font-semibold">{post.title}</h3>
          </Link>
        ))}
      </Slider>
    </div>
  );
});

// Memoized comment form component
const CommentForm = React.memo(({ comment, onCommentChange, onCommentSubmit }) => (
  <form onSubmit={onCommentSubmit} className="space-y-4 mb-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        name="name"
        value={comment.name}
        onChange={onCommentChange}
        placeholder="Name"
        className="border p-2 rounded w-full"
        required
      />
      <input
        name="email"
        type="email"
        value={comment.email}
        onChange={onCommentChange}
        placeholder="Email"
        className="border p-2 rounded w-full"
        required
      />
      <input
        name="website"
        value={comment.website}
        onChange={onCommentChange}
        placeholder="Website"
        className="border p-2 rounded w-full"
      />
    </div>
    <textarea
      name="message"
      value={comment.message}
      onChange={onCommentChange}
      placeholder="Comment Us:"
      className="border p-2 rounded w-full h-32"
      required
    />
    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
      Comment
    </button>
  </form>
));

// Memoized sidebar component
const Sidebar = React.memo(({ 
  searchTerm, 
  onSearchChange, 
  recentPosts, 
  hotPosts, 
  categories 
}) => (
  <aside className="sticky top-0 space-y-8 p-4">
    {/* Search */}
    <div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full border-2 border-gray-200 px-10 py-2 rounded-lg text-lg focus:outline-none focus:border-blue-500"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
      </div>
    </div>

    {/* Recent Posts */}
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-2xl font-semibold mb-4">Recent Posts</h3>
      <ul className="space-y-4">
        {recentPosts.map((post, i) => (
          <SidebarPostItem key={`recent-${post.slug || i}`} post={post} />
        ))}
      </ul>
    </div>

    {/* Hot Topics */}
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-2xl font-semibold mb-4">Hot Topics</h3>
      <ul className="space-y-4">
        {hotPosts.map((post, i) => (
          <SidebarPostItem key={`hot-${post.slug || i}`} post={post} />
        ))}
      </ul>
    </div>

    {/* Categories */}
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-2xl font-semibold mb-4">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <Link
            key={`cat-${i}`}
            to={`/category/${encodeURIComponent(cat)}`}
            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg hover:bg-blue-200 transition-colors"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  </aside>
));

const BlogPostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [hotPosts, setHotPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [comment, setComment] = useState({ name: '', email: '', website: '', message: '' });
  const { slug } = useParams();

  // Memoized handlers
  const handleCommentChange = useCallback((e) => {
    const { name, value } = e.target;
    setComment(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCommentSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('Submit comment:', comment);
    // TODO: send comment to API
    setComment({ name: '', email: '', website: '', message: '' });
  }, [comment]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Separate API calls with proper error handling and cleanup
  const fetchPost = useCallback(async (postSlug) => {
    try {
      setLoading(true);
      setError('');
      
      const [postResponse, relatedResponse] = await Promise.allSettled([
        axios.get(`https://vedive.com:3000/api/blog/blog-posts/${postSlug}`),
        axios.get(`https://vedive.com:3000/api/blog/blog-posts/related/${postSlug}`)
      ]);

      if (postResponse.status === 'fulfilled') {
        setPost(postResponse.value.data);
      } else {
        setError('Failed to load the blog post. It may have been removed or does not exist.');
        return;
      }

      if (relatedResponse.status === 'fulfilled') {
        const related = Array.isArray(relatedResponse.value.data) 
          ? relatedResponse.value.data.slice(0, 3) 
          : [];
        setRelatedPosts(related);
      } else {
        setRelatedPosts([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load the blog post. It may have been removed or does not exist.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSidebarData = useCallback(async () => {
    try {
      const response = await axios.get('https://vedive.com:3000/api/blog/blog-posts');
      const posts = Array.isArray(response.data.posts) ? response.data.posts : [];

      // Sort posts by date once and reuse
      const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setRecentPosts(sortedPosts.slice(0, 5));
      
      // Shuffle for hot posts
      const shuffled = [...posts].sort(() => 0.5 - Math.random());
      setHotPosts(shuffled.slice(0, 5));

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching sidebar data:', err);
    }
  }, []);

  // Effect for fetching post data
  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug, fetchPost]);

  // Effect for fetching sidebar data (only once)
  useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData]);

  // Memoized computed values
  const coverImageUrl = useMemo(() => buildImageUrl(post?.coverImage), [post?.coverImage]);
  const formattedDate = useMemo(() => 
    post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : '', 
    [post?.createdAt]
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="w-full max-w-[1440px] mx-auto p-4 bg-red-100 text-red-700 rounded-lg">
      <h2 className="text-2xl mb-2">Error</h2>
      <p>{error}</p>
    </div>
  );

  if (!post) return null;

  return (
    <div className='bg-primary'>
      <Navbar />

      {/* Hero Section */}
      <div className="w-full bg-[#04081D]">
        <div className="max-w-[1440px] mx-auto flex flex-col justify-center items-center h-[400px] text-center px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-primary font-semibold mb-2">
            {post.title}
          </h1>
          <div className="text-lg text-gray-400">
            {post.authorName} • {formattedDate} • {post.category}
          </div>
        </div>
      </div>

      <div className="bg-primary w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8 items-start py-8">
        <main>
          {/* Cover Image */}
          {post.coverImage && (
            <img
              src={coverImageUrl}
              alt="cover"
              className="w-full mx-auto rounded mb-6"
              loading="lazy"
              onError={(e) => (e.target.src = '/placeholder.png')}
            />
          )}

          {/* Blog Content */}
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
              loading="lazy"
            />
            <div>
              <h3 className="text-xl font-semibold">About the Author</h3>
              <p className="text-gray-700">
                The admin is the site's main author, pouring creativity and insight into every article 
                with a deep passion for storytelling, clear expression, and meaningful content that 
                resonates with readers.
              </p>
            </div>
          </div>

          {/* Comment Form */}
          <CommentForm
            comment={comment}
            onCommentChange={handleCommentChange}
            onCommentSubmit={handleCommentSubmit}
          />

          {/* Related Posts Carousel */}
          <RelatedPostsCarousel posts={relatedPosts} />
        </main>

        {/* Sidebar */}
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          recentPosts={recentPosts}
          hotPosts={hotPosts}
          categories={categories}
        />
      </div>

      <Footer />
    </div>
  );
};

export default BlogPostDetail;