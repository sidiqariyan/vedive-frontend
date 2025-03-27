import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Adjust the URL if your backend API URL is different
        const response = await axios.get(`http://localhost:3000/api/blog-posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Error fetching post details');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!post) return <p className="text-center mt-10">No post found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.author && post.author.username && (
        <p className="mb-2 text-gray-600">By {post.author.username}</p>
      )}
      <div className="mb-4">{post.content}</div>
      {/* You can add more post details here (e.g., category, tags, read time, etc.) */}
    </div>
  );
};

export default PostDetails;
