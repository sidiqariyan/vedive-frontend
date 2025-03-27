import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const BlogPostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/blog/blog-posts', {
        params: { page, category, search }
      });

      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching blog posts', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page, category, search]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <Input 
              placeholder="Search posts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <p>Loading posts...</p>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <motion.div
                  key={post._id}
                  whileHover={{ scale: 1.02 }}
                  className="border rounded-lg p-4"
                >
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <p className="text-gray-600">
                    By {post.author.username} | {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-gray-500">
                    {post.content.substring(0, 200)}...
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      {post.readTime} min read | {post.views} views
                    </span>
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/blog/${post._id}`)}
                    >
                      Read More
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-6 space-x-4">
            <Button 
              onClick={() => handlePageChange(page - 1)} 
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>Page {page} of {totalPages}</span>
            <Button 
              onClick={() => handlePageChange(page + 1)} 
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlogPostListPage;