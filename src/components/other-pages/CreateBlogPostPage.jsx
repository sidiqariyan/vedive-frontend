import React from 'react';
import { Link } from 'react-router-dom';
import CreatePostForm from './blog/CreatePostForm';
import { ArrowLeft } from 'lucide-react';

const CreateBlogPostPage = () => {
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('authToken');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Authentication Required</h2>
          <p className="text-gray-600 mb-6 text-center">
            You need to be logged in to create a blog post.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/login" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/blogs" 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            to="/blogs" 
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all posts
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Create New Blog Post</h1>
          <CreatePostForm />
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPostPage;