import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Clock, Tag } from 'lucide-react';

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  author: string;
  category: string;
  readTime: number;
  createdAt: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  slug,
  content,
  coverImage,
  author,
  category,
  readTime,
  createdAt,
}) => {
  const identifier = slug || id;
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
      <div className="h-48 overflow-hidden relative">
        {coverImage ? (
          <img
            src={coverImage.startsWith('http') ? coverImage : `https://vedive.com/${coverImage}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-sm px-2 py-1 rounded-full">
          <span className="font-medium text-blue-600">{category}</span>
        </div>
      </div>
      
      <div className="flex-1 p-5 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h2>
        <div className="text-gray-600 mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: content }} />
        
        <div className="flex items-center text-sm text-gray-500 space-x-4 mt-auto mb-3">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{readTime} min read</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">By {author}</span>
          <Link
            to={`/blog-posts/${identifier}`}
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;