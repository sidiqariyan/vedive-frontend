import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import { Textarea } from '../../components/ui/textarea';

const CreateBlogPostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Other');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [status, setStatus] = useState('publish');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('status', status);
    
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/blog/create-blog-post', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate(`/blog-posts/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              placeholder="Post Title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />

            <Textarea 
              placeholder="Write your blog post content here..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              required 
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Category</label>
                <Select 
                  value={category} 
                  onValueChange={(value) => {
                    console.log('Category selected:', value);
                    setCategory(value);
                  }}
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
                  onValueChange={(value) => {
                    console.log('Status selected:', value);
                    setStatus(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Publish</SelectItem>
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
              <label className="block mb-2">Cover Image</label>
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
  );
};

export default CreateBlogPostPage;