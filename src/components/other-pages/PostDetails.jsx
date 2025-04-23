import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';

export default function PostDetail() {
  const { identifier } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`https://vedive.com:3000/api/posts/blog-posts/${identifier}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      }
    }
    fetchPost();
  }, [identifier]);

  if (!post) return <div className="p-4">Loading...</div>;

  return (
    <article className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl mb-4 font-normal">{post.title}</h1>
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full h-auto mb-6" />
      )}
      <div className="prose prose-lg">
        {parse(post.content)}
      </div>
    </article>
  );
}
