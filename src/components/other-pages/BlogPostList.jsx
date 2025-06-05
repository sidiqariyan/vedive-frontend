import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaEye, 
  FaClock, 
  FaTag, 
  FaCalendar,
  FaUser,
  FaArrowRight,
  FaChevronDown,
  FaStar
} from 'react-icons/fa';
import Navbar from '../Pages/Hero/Navbar';
import Footer from '../Pages/Hero/Footer';

// Create axios instance with optimizations
const apiClient = axios.create({
  baseURL: 'https://vedive.com:3000/api/blog',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Cache for API responses
const cache = new Map();

// Utility functions (moved outside component to prevent recreations)
const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '');
const buildImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return '';
  return imageUrl.startsWith('http') ? imageUrl : `https://vedive.com:3000${imageUrl}`;
};

// Optimized debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef();

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timerRef.current);
  }, [value, delay]);

  return debouncedValue;
};

// Virtualized PostCard with optimizations
const PostCard = React.memo(({ post, priority = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  
  const imageUrl = useMemo(() => buildImageUrl(post.coverImage), [post.coverImage]);
  const excerpt = useMemo(() => stripHtml(post.content).slice(0, 120), [post.content]);
  const formattedDate = useMemo(() => {
    if (post._formattedDate) return post._formattedDate;
    const date = new Date(post.createdAt);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, [post.createdAt, post._formattedDate]);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageFailed(true), []);

  return (
    <Link
      to={`/${post.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100 dark:border-gray-700"
    >
      <div className="relative w-full h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {!imageFailed && imageUrl ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 animate-pulse" />
            )}
            <img
              src={imageUrl}
              alt={post.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
            <span className="text-white text-4xl opacity-70">📄</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <FaUser className="w-3 h-3" />
            <span>{post.authorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCalendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
          {post.readTime && (
            <div className="flex items-center gap-1">
              <FaClock className="w-3 h-3" />
              <span>{post.readTime}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-200">
          {post.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-0 line-clamp-3 text-sm leading-relaxed">
          {excerpt}…
        </p>
      </div>
    </Link>
  );
});

// Optimized FeaturedBanner
const FeaturedBanner = React.memo(({ post }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = useMemo(() => buildImageUrl(post.coverImage), [post.coverImage]);
  const excerpt = useMemo(() => stripHtml(post.content).substring(0, 150), [post.content]);
  const formattedDate = useMemo(() => {
    if (post._formattedDate) return post._formattedDate;
    const date = new Date(post.createdAt);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, [post.createdAt, post._formattedDate]);

  return (
    <Link
      to={`/${post.slug}`}
      className="block relative h-96 md:h-[32rem] xl:h-[36rem] bg-cover bg-center rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform duration-300 group shadow-2xl"
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 animate-pulse" />
      )}
      <img
        src={imageUrl}
        alt={post.title}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="eager"
        onLoad={() => setImageLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300 flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg flex items-center gap-1 sm:gap-2">
            <FaStar className="w-3 h-3" />
            Featured
          </span>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>
        
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white group-hover:text-blue-300 transition-colors duration-200 leading-tight line-clamp-3">
          {post.title}
        </h1>
        
        <p className="mb-4 sm:mb-6 text-gray-200 text-sm sm:text-base hidden sm:block leading-relaxed line-clamp-2">
          {excerpt}…
        </p>
        
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
          <div className="flex items-center gap-1 sm:gap-2">
            <FaUser className="w-3 h-3" />
            <span>{post.authorName}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <FaCalendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
          {post.readTime && (
            <div className="flex items-center gap-1 sm:gap-2">
              <FaClock className="w-3 h-3" />
              <span>{post.readTime}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
});

// Optimized Search and Filter Component
const SearchAndFilter = React.memo(({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange,
  selectedTag,
  onTagChange,
  sortOrder, 
  onSortChange, 
  categories,
  tags,
  onClearFilters 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = useCallback(() => setShowFilters(prev => !prev), []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles, authors, topics..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="px-6 pb-4 md:hidden">
        <button
          onClick={toggleFilters}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl transition-colors duration-200 font-medium"
        >
          <FaFilter className="w-4 h-4" />
          Advanced Filters
          <FaChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className={`px-6 pb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={onCategoryChange}
              className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tag</label>
            <select
              value={selectedTag}
              onChange={onTagChange}
              className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag.name} value={tag.name}>
                  #{tag.name} ({tag.count})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
            <select
              value={sortOrder}
              onChange={onSortChange}
              className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="newest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={onClearFilters}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200 font-medium"
            >
              <FaTimes className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Optimized Pagination
const Pagination = React.memo(({ pagination, onPageChange }) => {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  const getVisiblePages = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center items-center space-x-2 flex-wrap gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
      >
        Previous
      </button>
      
      {getVisiblePages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm ${
            currentPage === page 
              ? 'bg-blue-600 text-white shadow-lg' 
              : page === '...' 
                ? 'cursor-default text-gray-400 dark:text-gray-500' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
      >
        Next
      </button>
    </div>
  );
});

// Optimized API functions with caching
const fetchWithCache = async (url, cacheKey, ttl = 60000) => {
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  
  const response = await apiClient.get(url);
  cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
  return response.data;
};

// Main optimized component
const BlogPostList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [latestPost, setLatestPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  
  // State from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  // Optimized debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTag) params.set('tag', selectedTag);
    if (sortOrder !== 'newest') params.set('sort', sortOrder);
    if (currentPage !== 1) params.set('page', currentPage.toString());
    
    setSearchParams(params, { replace: true });
  }, [debouncedSearchTerm, selectedCategory, selectedTag, sortOrder, currentPage, setSearchParams]);

  // Optimized fetch functions
  const fetchLatestPost = useCallback(async () => {
    try {
      const data = await fetchWithCache('/blog-posts?limit=1&sort=newest', 'latest-post', 30000);
      if (data.posts && data.posts.length > 0) {
        setLatestPost(data.posts[0]);
      }
    } catch (err) {
      console.error('Error fetching latest post:', err);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sort: sortOrder,
      });
      
      if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedTag) params.set('tag', selectedTag);

      const cacheKey = `posts-${params.toString()}`;
      const data = await fetchWithCache(`/blog-posts?${params}`, cacheKey, 15000);
      
      setPosts(data.posts || []);
      setPagination(data.pagination || {});
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortOrder, debouncedSearchTerm, selectedCategory, selectedTag]);

  const fetchCategoriesAndTags = useCallback(async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        fetchWithCache('/categories', 'categories', 300000),
        fetchWithCache('/tags', 'tags', 300000)
      ]);
      
      setCategories(categoriesData.categories || []);
      setTags(tagsData.tags || []);
    } catch (err) {
      console.error('Error fetching categories/tags:', err);
    }
  }, []);

  // Initial load - parallel requests
  useEffect(() => {
    Promise.all([
      fetchLatestPost(),
      fetchCategoriesAndTags()
    ]);
  }, [fetchLatestPost, fetchCategoriesAndTags]);

  // Fetch posts when filters change
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Optimized event handlers
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleTagChange = useCallback((e) => {
    setSelectedTag(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
    setSortOrder('newest');
    setCurrentPage(1);
  }, []);

  // Loading skeleton
  if (loading && posts.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Navbar />
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-3xl mb-12"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-300 h-80 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <Navbar />
      
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Banner */}
        {latestPost && (
          <div className="mb-12">
            <FeaturedBanner post={latestPost} />
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-8">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedTag={selectedTag}
            onTagChange={handleTagChange}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            categories={categories}
            tags={tags}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Results Info */}
        {(debouncedSearchTerm || selectedCategory || selectedTag) && (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            {pagination.totalCount > 0 ? (
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <FaSearch className="w-4 h-4" />
                <p className="font-medium">
                  Found {pagination.totalCount} article{pagination.totalCount !== 1 ? 's' : ''}
                  {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
                  {selectedCategory && ` in "${selectedCategory}"`}
                  {selectedTag && ` tagged with "${selectedTag}"`}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <FaSearch className="w-4 h-4" />
                <p className="font-medium">No articles found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-xl mb-8 border border-red-200 dark:border-red-800">
            <div className="font-medium">{error}</div>
          </div>
        )}

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <>
            <section className="pb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {debouncedSearchTerm || selectedCategory || selectedTag ? 'Search Results' : 'Latest Articles'}
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {posts.length} of {pagination.totalCount} articles
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {posts.map((post, index) => (
                  <PostCard key={post.id} post={post} priority={index < 4} />
                ))}
              </div>
            </section>

            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        ) : !loading && (
          <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No Articles Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {debouncedSearchTerm || selectedCategory || selectedTag
                ? 'Try adjusting your search criteria or clear the filters to see more articles.'
                : 'Be the first to share your thoughts and create an article!'
              }
            </p>
            {(!debouncedSearchTerm && !selectedCategory && !selectedTag) && (
              <Link 
                to="/create-blog" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Create Your First Article
                <FaArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default BlogPostList;