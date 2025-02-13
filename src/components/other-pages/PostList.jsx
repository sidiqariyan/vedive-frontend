import React, { useEffect, useState } from "react";
import axios from "axios";

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Replace with your backend API endpoint
                const response = await axios.get("http://localhost:3000/api/posts");
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div>
            <h2>Posts</h2>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div
                        key={post._id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            margin: "10px",
                        }}
                    >
                        <h3>{post.name}</h3>
                        <p>{post.description}</p>
                        <p>
                            <strong>Tags:</strong> {post.tags.join(", ")}
                        </p>
                        <p>
                            <strong>Category:</strong> {post.category}
                        </p>
                        <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
};

export default PostList;