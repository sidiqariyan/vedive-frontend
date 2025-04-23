import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';

const CreateBlogPostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');  // Will now hold HTML
  const [category, setCategory] = useState('Other');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [status, setStatus] = useState('publish');  // match backend: 'draft' | 'publish'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Prepare tags array
    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);               // HTML
    formData.append('category', category);
    formData.append('tags', JSON.stringify(tagArray)); // send as JSON string
    formData.append('status', status === 'publish' ? 'publish' : 'draft');
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://vedive.com:3000/api/blog/create-blog-post',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      navigate(`/blog-posts/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className='bg-primary'>
      <Helmet>
        <title>Create New Blog Post | Vedive</title>
        <meta name="description" content="Compose and publish a new blog post on Vedive. Use rich text editor with headings, lists, images, and more for SEO optimization." />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title as H1 on published page */}
              <Input 
                placeholder="Post Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />

              {/* Rich text editor for HTML content */}
              <div>
                <label className="block mb-2 font-medium">Content</label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline'],
                      ['link', 'image'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['clean']
                    ]
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Category</label>
                  <Select 
                    value={category} 
                    onValueChange={(value) => setCategory(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Status</label>
                  <Select 
                    value={status} 
                    onValueChange={(value) => setStatus(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="publish">Publish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Input 
                placeholder="Tags (comma-separated)" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />

              <div>
                <label className="block mb-2 font-medium">Cover Image</label>
                <Input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                />
              </div>

              {error && <p className="text-red-500">{error}</p>}

              <Button type="submit" className="w-full">
                Create Blog Post
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateBlogPostPage;
