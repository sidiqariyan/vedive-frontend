import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      
      {posts.map(post => (
        <div key={post._id} className="bg-white p-4 mb-4 rounded shadow">
          <Link to={`/post/${post._id}`}>
            <h2 className="text-xl font-semibold">{post.title}</h2>
          </Link>
          <p className="text-gray-600 mb-2">By {post.author.name}</p>
          <p className="text-gray-700">{post.content.substring(0, 200)}...</p>
          <div className="flex space-x-2 mt-2">
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-200 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;