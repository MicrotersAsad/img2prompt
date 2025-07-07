// components/BlogDashboard.js - Complete version with image upload
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  FileText,
  Image as ImageIcon,
  Save,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import dynamic from 'next/dynamic';
import ImageUpload from './ImageUpload';

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
  </div>
});

const BlogDashboard = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'all'
  });

  // Modals
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form data
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    categoryId: '',
    featuredImage: '',
    status: 'draft'
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: ''
  });

  // Helper function to get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || localStorage.getItem('token');
    }
    return null;
  };

  // Jodit Editor Configuration with Vercel Blob Upload
  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Start writing your blog post content here...',
    height: 400,
    toolbarButtonSize: 'small',
    toolbar: true,
    spellcheck: true,
    language: 'en',
    toolbarAdaptive: true,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    minHeight: 300,
    maxHeight: 600,
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'superscript', 'subscript', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', '|',
      'paragraph', 'align', 'lineHeight', '|',
      'image', 'video', 'table', 'link', '|',
      'hr', 'symbol', 'fullsize', '|',
      'undo', 'redo', '|',
      'cut', 'copy', 'paste', 'selectall', '|',
      'source', 'preview'
    ],
    uploader: {
      url: '/api/upload-image',
      format: 'json',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'],
      filesVariableName: 'file',
      withCredentials: false,
      pathVariableName: 'files',
      isSuccess: function(resp) {
        return resp.success === true;
      },
      getMessage: function(resp) {
        return resp.message || '';
      },
      process: function(resp) {
        return {
          files: resp.files || [],
          path: '',
          baseurl: '',
          error: resp.success ? 0 : 1,
          msg: resp.message || ''
        };
      },
      error: function(e) {
        console.error('Jodit upload error:', e);
        this.events.fire('errorPopup', [e.getMessage(), 'error', 4000]);
      },
      defaultHandlerSuccess: function(resp) {
        if (resp.files && resp.files.length > 0) {
          const url = resp.files[0];
          this.selection.insertImage(url, null, 250);
        }
      }
    },
    beautifyHTML: true,
    theme: 'dark',
    style: {
      background: '#1f2937',
      color: '#f9fafb'
    }
  }), []);

  // Fetch data on component mount and tab change
  useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    } else if (activeTab === 'categories') {
      fetchCategories();
    }
  }, [activeTab, currentPage, filters]);

  useEffect(() => {
    fetchCategories(); // Always load categories for post creation
  }, []);

  // API Functions
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: filters.status,
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`/api/blog/posts?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
        setTotalPages(data.pagination.pages);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postForm)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Post created successfully!');
        setShowPostModal(false);
        resetPostForm();
        fetchPosts();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to create post');
    }
  };

  const handleUpdatePost = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/blog/posts/${editingPost._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postForm)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Post updated successfully!');
        setShowPostModal(false);
        setEditingPost(null);
        resetPostForm();
        fetchPosts();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to update post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Post deleted successfully!');
        fetchPosts();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  const handleCreateCategory = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('/api/blog/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryForm)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Category created successfully!');
        setShowCategoryModal(false);
        resetCategoryForm();
        fetchCategories();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to create category');
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/blog/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryForm)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Category updated successfully!');
        setShowCategoryModal(false);
        setEditingCategory(null);
        resetCategoryForm();
        fetchCategories();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/blog/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Category deleted successfully!');
        fetchCategories();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to delete category');
    }
  };

  // Helper functions
  const resetPostForm = () => {
    setPostForm({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      categoryId: '',
      featuredImage: '',
      status: 'draft'
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: ''
    });
  };

  const openPostModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setPostForm({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        categoryId: post.categoryId,
        featuredImage: post.featuredImage || '',
        status: post.status
      });
    } else {
      setEditingPost(null);
      resetPostForm();
    }
    setShowPostModal(true);
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        slug: category.slug,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      resetCategoryForm();
    }
    setShowCategoryModal(true);
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Handle content change from Jodit Editor
  const handleContentChange = (newContent) => {
    setPostForm(prev => ({ 
      ...prev, 
      content: newContent,
      // Auto-generate excerpt if empty
      excerpt: prev.excerpt || newContent.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Blog Management</h1>
          
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'posts'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Posts
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Tag className="w-5 h-5 inline mr-2" />
              Categories
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-200">{error}</span>
              <button onClick={clearMessages} className="ml-auto text-red-400 hover:text-red-200">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {success && (
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-green-200">{success}</span>
              <button onClick={clearMessages} className="ml-auto text-green-400 hover:text-green-200">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Filters and Add Button */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 items-center flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>

                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <button
                  onClick={() => openPostModal()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Post
                </button>
              </div>
            </div>

            {/* Posts Table */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading posts...</p>
                </div>
              ) : posts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Title</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Category</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Status</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Views</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Date</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map(post => (
                        <tr key={post._id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {post.featuredImage && (
                                <img 
                                  src={post.featuredImage} 
                                  alt={post.title}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <h3 className="text-white font-medium">{post.title}</h3>
                                <p className="text-gray-400 text-sm">{post.excerpt?.substring(0, 60)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm">
                              {post.category?.name || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded text-sm ${
                              post.status === 'published' 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-300">{post.views || 0}</td>
                          <td className="py-4 px-6 text-gray-300">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openPostModal(post)}
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePost(post._id)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No posts found</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-700 flex justify-center">
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${
                          currentPage === page
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Add Category Button */}
            <div className="flex justify-end">
              <button
                onClick={() => openCategoryModal()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Category
              </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <div key={category._id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                      <p className="text-gray-400 text-sm">{category.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openCategoryModal(category)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-gray-300 text-sm">{category.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post Modal with Jodit Editor and Image Upload */}
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-gray-800 rounded-xl p-8 max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingPost ? 'Edit Post' : 'Create Post'}
                </h2>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={postForm.title}
                      onChange={(e) => {
                        setPostForm(prev => ({ 
                          ...prev, 
                          title: e.target.value,
                          slug: !editingPost ? generateSlug(e.target.value) : prev.slug
                        }));
                      }}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Slug</label>
                    <input
                      type="text"
                      value={postForm.slug}
                      onChange={(e) => setPostForm(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                    <select
                      value={postForm.categoryId}
                      onChange={(e) => setPostForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Status</label>
                    <select
                      value={postForm.status}
                      onChange={(e) => setPostForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                {/* Featured Image Upload */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Featured Image</label>
                  <ImageUpload
                    value={postForm.featuredImage}
                    onChange={(url) => setPostForm(prev => ({ ...prev, featuredImage: url }))}
                  />
                  
                  {/* Optional: Manual URL input for advanced users */}
                  <div className="mt-4">
                    <label className="block text-gray-300 text-xs font-medium mb-2">Or enter image URL manually:</label>
                    <input
                      type="url"
                      value={postForm.featuredImage}
                      onChange={(e) => setPostForm(prev => ({ ...prev, featuredImage: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Excerpt</label>
                  <textarea
                    value={postForm.excerpt}
                    onChange={(e) => setPostForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    rows={3}
                    placeholder="Brief description of the post..."
                  />
                </div>

                {/* Jodit Rich Text Editor */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Content</label>
                  <div className="bg-gray-700 rounded-lg p-1">
                    <JoditEditor
                      value={postForm.content}
                      config={editorConfig}
                      onBlur={handleContentChange}
                      onChange={() => {}} // Use onBlur instead to avoid too many re-renders
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => setShowPostModal(false)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingPost ? handleUpdatePost : handleCreatePost}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {editingPost ? 'Update' : 'Create'} Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h2>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => {
                      setCategoryForm(prev => ({ 
                        ...prev, 
                        name: e.target.value,
                        slug: !editingCategory ? generateSlug(e.target.value) : prev.slug
                      }));
                    }}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    rows={4}
                    placeholder="Category description..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {editingCategory ? 'Update' : 'Create'} Category
                  </button>
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDashboard;