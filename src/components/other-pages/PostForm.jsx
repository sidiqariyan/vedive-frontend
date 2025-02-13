import React, { useState } from "react";
import axios from "axios";

const PostForm = () => {
    const [post, setPost] = useState({
        name: "",
        description: "",
        tags: "",
        category: "",
        htmlContent: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Replace with your backend API endpoint
            const response = await axios.post("http://localhost:3000/api/posts", post);
            alert("Post created successfully!");
            console.log(response.data);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={post.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <input
                    type="text"
                    name="description"
                    value={post.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Tags (comma-separated):</label>
                <input
                    type="text"
                    name="tags"
                    value={post.tags}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Category:</label>
                <input
                    type="text"
                    name="category"
                    value={post.category}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>HTML Content:</label>
                <textarea
                    name="htmlContent"
                    value={post.htmlContent}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Create Post</button>
        </form>
    );
};

export default PostForm;