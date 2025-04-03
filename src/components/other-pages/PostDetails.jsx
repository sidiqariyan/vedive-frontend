import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const PostDetail = () => {
  const { identifier } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Note the adjusted URL: it's under /api/blog/blog-posts
        const response = await axios.get(`https://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/blog/blog-posts/${identifier}`);
        setPost(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching post');
      }
      setLoading(false);
    };

    fetchPost();
  }, [identifier]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p>No post found.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-3xl mx-auto">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto object-cover rounded-md mb-4"
          />
        )}
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-600 mb-4">
          By {post.author.username} | {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="prose prose-lg">
          <p>{post.content}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetail;
