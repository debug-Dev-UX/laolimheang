import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDocumentsByField } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      const data = await getDocumentsByField(COLLECTIONS.BLOGS, 'slug', slug);
      if (data.length > 0) {
        setBlog(data[0]);
      }
    } catch (error) {
      console.error('Error loading blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-500">Blog post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {blog.thumbnail && (
          <img src={blog.thumbnail} alt={blog.title} className="w-full h-96 object-cover rounded-lg mb-8" />
        )}

        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

        <div className="flex gap-4 mb-8 text-gray-600">
          <span>{new Date(blog.createdAt?.toDate?.() || blog.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{blog.category}</span>
        </div>

        <div className="prose max-w-none mb-8">
          {blog.content}
        </div>

        <div className="flex gap-2">
          {blog.tags?.map(tag => (
            <span key={tag} className="px-4 py-2 bg-primary-100 text-primary-600 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
