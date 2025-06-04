import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaCalendar, FaUser, FaTag, FaGlobe, FaHeart, FaReply } from 'react-icons/fa';
import Navbar from '../Pages/Hero/Navbar';
import Footer from '../Pages/Hero/Footer';
import AdminImage from "./admin.png";
import bgImage from '../assets/top-section-background.svg';

// Input sanitization function
const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Enhanced HTML sanitization for display
const sanitizeForDisplay = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

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

// Enhanced search dropdown item component
const SearchDropdownItem = React.memo(({ post, onClick }) => {
  const imageUrl = useMemo(() => buildImageUrl(post.coverImage), [post.coverImage]);
  const excerpt = useMemo(() => {
    if (!post.content) return '';
    const textContent = post.content.replace(/<[^>]*>/g, '');
    return textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;
  }, [post.content]);

  return (
    <Link
      to={`/${post.slug}`}
      className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={post.title}
        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
        loading="lazy"
        onError={(e) => (e.target.src = '/placeholder.png')}
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
          {post.title}
        </h4>
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
          {excerpt}
        </p>
      </div>
    </Link>
  );
});

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


// Enhanced comment form component with validation
const CommentForm = React.memo(({ comment, onCommentChange, onCommentSubmit, isSubmitting }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!comment.name.trim()) newErrors.name = 'Name is required';
    if (!comment.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(comment.email)) newErrors.email = 'Email is invalid';
    if (!comment.message.trim()) newErrors.message = 'Message is required';
    else if (comment.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onCommentSubmit(e);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Leave a Comment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              name="name"
              value={comment.name}
              onChange={onCommentChange}
              placeholder="Your Name *"
              className={`border-2 p-3 rounded-lg w-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400'
              }`}
              required
              maxLength={100}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              name="email"
              type="email"
              value={comment.email}
              onChange={onCommentChange}
              placeholder="Your Email *"
              className={`border-2 p-3 rounded-lg w-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400'
              }`}
              required
              maxLength={100}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              name="website"
              value={comment.website}
              onChange={onCommentChange}
              placeholder="Website (Optional)"
              className="border-2 border-gray-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
              maxLength={200}
            />
          </div>
        </div>
        <div>
          <textarea
            name="message"
            value={comment.message}
            onChange={onCommentChange}
            placeholder="Share your thoughts... *"
            className={`border-2 p-3 rounded-lg w-full h-32 resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400'
            }`}
            required
            maxLength={1000}
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          <div className="text-right text-sm text-gray-500 mt-1">
            {comment.message.length}/1000 characters
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Posting...
            </>
          ) : (
            <>
              <FaReply />
              Post Comment
            </>
          )}
        </button>
      </form>
    </div>
  );
});

// Enhanced comment display component
const CommentItem = React.memo(({ comment, index }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 10)); // Mock likes

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const getRandomColor = () => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500'
    ];
    return colors[index % colors.length];
  };

  return (
<div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow">
  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${getRandomColor()} flex items-center justify-center text-white font-semibold text-sm sm:text-lg flex-shrink-0 mx-auto sm:mx-0`}>
      {getInitials(comment.name)}
    </div>
    
    <div className="flex-1 min-w-0 text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 mb-2">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900">{sanitizeForDisplay(comment.name)}</h3>
        <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
          <FaCalendar className="w-3 h-3" />
          {new Date(comment.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>
      
      {comment.website && (
        <a 
          href={comment.website.startsWith('http') ? comment.website : `https://${comment.website}`}
          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1 mb-3 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGlobe className="w-3 h-3" />
          {sanitizeForDisplay(comment.website)}
        </a>
      )}
      
      <div className="prose prose-sm max-w-none mb-4">
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
          {sanitizeForDisplay(comment.message)}
        </p>
      </div>
      
      <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-colors ${
            liked 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FaHeart className={`w-3 h-3 ${liked ? 'text-red-500' : ''}`} />
          <span>{likes}</span>
        </button>
        
        <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
          <FaReply className="w-3 h-3" />
          Reply
        </button>
      </div>
    </div>
  </div>
</div>
  );
});

// Enhanced sidebar component with improved search dropdown
const Sidebar = React.memo(({ 
  searchTerm, 
  onSearchChange, 
  recentPosts, 
  hotPosts, 
  categories,
  tags = []
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Enhanced search functionality
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      setIsSearching(true);
      const delay = setTimeout(async () => {
        try {
          const res = await axios.get(
            `https://vedive.com:3000/api/blog/blog-posts?search=${encodeURIComponent(searchTerm)}&limit=5`
          );
          setSearchResults(res.data.posts || []);
          setShowDropdown(true);
        } catch (err) {
          console.error('Search error:', err);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // Reduced delay for better UX
      return () => clearTimeout(delay);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="sticky top-0 space-y-8 p-0 sm:p-4">
      {/* Enhanced Search */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={onSearchChange}
            onFocus={() => searchTerm.trim() && searchResults.length > 0 && setShowDropdown(true)}
            className="w-full border-2 border-gray-200 px-12 py-3 rounded-xl text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          {searchTerm && (
            <button
              onClick={() => {
                onSearchChange({ target: { value: '' } });
                setShowDropdown(false);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          )}
        </div>

        {/* Enhanced Dropdown Results */}
        {showDropdown && (
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                <span className="text-gray-600">Searching...</span>
              </div>
            ) : searchTerm.trim() && searchResults.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <FaSearch className="mx-auto mb-2 text-gray-300" />
                No results found for "{searchTerm}"
              </div>
            ) : (
              <div className="py-2">
                {searchResults.map((post) => (
                  <SearchDropdownItem
                    key={post.slug}
                    post={post}
                    onClick={() => setShowDropdown(false)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
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
      <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
        <h3 className="text-lg lg:text-2xl font-semibold mb-3 lg:mb-4">Category</h3>
        <div className="flex flex-wrap gap-1 lg:gap-2">
          {categories.map((cat, i) => (
            <Link
              key={`cat-${i}`}
              to={`/blogs?category=${encodeURIComponent(cat)}`}
              className="bg-blue-100 text-blue-800 px-2 lg:px-4 py-1 lg:py-2 rounded-full text-sm lg:text-lg hover:bg-blue-200 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
          <h3 className="text-lg lg:text-2xl font-semibold mb-3 lg:mb-4">Tags</h3>
          <div className="flex flex-wrap gap-1 lg:gap-2">
            {tags.map((tag, i) => (
              <Link
                key={`tag-${i}`}
                to={`/blogs?tag=${encodeURIComponent(tag.name)}`}
                className="bg-green-100 text-green-800 px-2 lg:px-4 py-1 lg:py-2 rounded-full text-xs lg:text-sm hover:bg-green-200 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
});

const BlogPostDetail = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentPosts, setRecentPosts] = useState([]);
  const [hotPosts, setHotPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [comment, setComment] = useState({ name: '', email: '', website: '', message: '' });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { slug } = useParams();

  // Enhanced comment change handler with sanitization
  const handleCommentChange = useCallback((e) => {
    const { name, value } = e.target;
    setComment(prev => ({ 
      ...prev, 
      [name]: sanitizeInput(value)
    }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Enhanced comment submission with proper sanitization
  const handleCommentSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmittingComment(true);
    
    try {
      const sanitizedComment = {
        name: sanitizeInput(comment.name),
        email: sanitizeInput(comment.email),
        website: sanitizeInput(comment.website),
        message: sanitizeInput(comment.message),
        postSlug: slug
      };
      
      const response = await axios.post(
        "https://vedive.com:3000/api/blog/comments", 
        sanitizedComment
      );
      
      setComments([response.data, ...comments]);
      setComment({ name: "", email: "", website: "", message: "" });
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  }, [comment, slug, comments]);

  // Fetch post and comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [postRes, commentsRes] = await Promise.allSettled([
          axios.get(`https://vedive.com:3000/api/blog/blog-posts/${slug}`),
          axios.get(`https://vedive.com:3000/api/blog/comments/${slug}`)
        ]);
        
        if (postRes.status === 'fulfilled') {
          setPost(postRes.value.data);
        } else {
          setError('Failed to load the blog post. It may have been removed or does not exist.');
          return;
        }

        if (commentsRes.status === 'fulfilled') {
          setComments(commentsRes.value.data || []);
        } else {
          setComments([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load the blog post or comments');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) fetchData();
  }, [slug]);

  // Fetch sidebar data including tags
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [postsRes, tagsRes] = await Promise.allSettled([
          axios.get('https://vedive.com:3000/api/blog/blog-posts'), 
          axios.get('https://vedive.com:3000/api/blog/tags')
        ]);
        
        if (postsRes.status === 'fulfilled') {
          const posts = Array.isArray(postsRes.value.data.posts) ? postsRes.value.data.posts : [];
          
          // Process posts
          const sortedPosts = [...posts].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRecentPosts(sortedPosts.slice(0, 5));
          
          const shuffled = [...posts].sort(() => 0.5 - Math.random());
          setHotPosts(shuffled.slice(0, 5));
          
          const cats = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));
          setCategories(cats);
        }
        
        // Process tags
        if (tagsRes.status === 'fulfilled') {
          setTags(tagsRes.value.data.tags || []);
        }
      } catch (err) {
        console.error('Error fetching sidebar data:', err);
      }
    };
    
    fetchSidebarData();
  }, []);

  // Memoized computed values
  const coverImageUrl = useMemo(() => buildImageUrl(post?.coverImage), [post?.coverImage]);
  const formattedDate = useMemo(() => 
    post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : '', 
    [post?.createdAt]
  );

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

  return (
    <div className='bg-primary'>
      <Navbar />

      {/* Hero Section */}
      <div
        className="w-full bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="max-w-[1440px] mx-auto flex flex-col justify-center items-center h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-primary font-semibold mb-2 leading-tight">
            {post.title}
          </h1>
          <div className="text-sm sm:text-base lg:text-lg text-gray-400 flex flex-row sm:flex-row items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-2">
              <FaUser className="w-3 h-3 sm:w-4 sm:h-4" />
              {post.authorName}
            </span>
            <span className="flex items-center gap-2">
              <FaCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <FaTag className="w-3 h-3 sm:w-4 sm:h-4" />
              {post.category}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-primary w-full max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-4 lg:gap-8 items-start py-4 lg:py-8 px-4">
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
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 p-4 mb-6 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Share this article:</span>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
                
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                
                <button
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </button>
                
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!'))}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>

          {/* About Author */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 lg:p-6 border rounded-lg mb-6 lg:mb-8 gap-4">
            <img
              src={AdminImage}
              alt={post.authorName}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto sm:mx-0 flex-shrink-0"
              loading="lazy"
            />
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">About the Author</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                The admin is the site's main author, pouring creativity and insight into every article 
                with a deep passion for storytelling, clear expression, and meaningful content that 
                resonates with readers.
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <section className="mt-6 lg:mt-8 mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Comments ({comments.length})</h2>
            
            {/* Comment Form */}
            <CommentForm 
              comment={comment}
              onCommentChange={handleCommentChange}
              onCommentSubmit={handleCommentSubmit}
            />
            
            {/* Display Comments */}
            {comments.length === 0 ? (
              <p className="text-gray-600">No comments yet. Be the first to comment!</p>
            ) : (
              <ul className="space-y-6">
                {comments.map((cmt, idx) => (
                  <li key={idx} className="border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">{cmt.name}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(cmt.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {cmt.website && (
                      <a 
                        href={cmt.website} 
                        className="text-blue-600 hover:underline text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cmt.website}
                      </a>
                    )}
                    
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">{cmt.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>

        {/* Sidebar with Tags */}
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          recentPosts={recentPosts}
          hotPosts={hotPosts}
          categories={categories}
          tags={tags}
        />
      </div>

      <Footer />
    </div>
  );
};

export default BlogPostDetail;