// src/components/Blog/BlogPostListPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BlogPostListPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(`https://vedive.com:3000/api/posts/blog-posts?page=${page}&limit=12`);
      const data = await res.json();
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    }
    fetchPosts();
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl mb-6 font-normal">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="border rounded-lg overflow-hidden">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-normal mb-2">{post.title}</h2>
              <p className="text-sm mb-4">{post.content}</p>
              <Link
                to={`/blog-posts/${post.slug}`}
                className="text-blue-600 hover:underline"
              >
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded"
        >Previous</button>
        <span className="px-3 py-1">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded"
        >Next</button>
      </div>
    </div>
  );
}
