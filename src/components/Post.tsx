'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, Edit, Trash2, Save, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeleteModal from '@/components/ui/delete-modal';
import { useAuth } from '@/contexts/AuthContext';

interface PostProps {
  post: {
    _id: string;
    content: string;
    image?: string;
    author: {
      _id: string;
      name: string;
      email: string;
    };
    likes?: string[];
    comments?: Array<{
      _id: string;
      content: string;
      author: {
        _id: string;
        name: string;
        email: string;
      };
      createdAt: string;
    }>;
    createdAt: string;
  };
  onPostUpdated?: () => void;
  onPostDeleted?: () => void;
}

const Post: React.FC<PostProps> = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(() => {
    return user && post.likes ? post.likes.includes(user.id) : false;
  });
  const [likeCount, setLikeCount] = useState(post.likes ? post.likes.length : 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [comments, setComments] = useState<NonNullable<typeof post.comments>>(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLike = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleEdit = async () => {
    if (!user || user.id !== post.author._id) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (response.ok) {
        setIsEditing(false);
        onPostUpdated?.();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = () => {
    if (!user || user.id !== post.author._id) return;
    setShowDeleteModal(true);
  };

  const confirmDeletePost = async () => {
    if (!user || user.id !== post.author._id) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setShowDeleteModal(false);
        onPostDeleted?.();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setDeleteCommentId(commentId);
    setShowDeleteModal(true);
  };

  const confirmDeleteComment = async () => {
    if (!user || !deleteCommentId) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/posts/${post._id}/comments/${deleteCommentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setDeleteCommentId(null);
        loadComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteCommentId(null);
  };

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        setShowComments(true);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;
    
    try {
      const response = await fetch(`/api/posts/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        setNewComment('');
        loadComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const isAuthor = user && user.id === post.author._id;

  return (
    <>
      <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
            {post.author.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 mb-1">
                <Link
                  href={`/profile/${post.author._id}`}
                  className="font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {post.author.name}
                </Link>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</span>
              </div>
              {isAuthor && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeletePost}
                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{post.author.email}</p>
          </div>
        </div>
        
        <div className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                rows={4}
              />
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleEdit}
                  disabled={isLoading}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(post.content);
                  }}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-base">{post.content}</p>
          )}
        </div>
        
        {post.image && (
          <div className="mb-4">
            <Image
              src={post.image}
              alt="Post image"
              width={768}
              height={384}
              className="w-full max-h-96 object-cover rounded-xl border border-gray-200 dark:border-gray-600"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">
                {likeCount > 0 ? `${likeCount} Like${likeCount > 1 ? 's' : ''}` : 'Like'}
              </span>
            </button>
            <button 
              onClick={() => showComments ? setShowComments(false) : loadComments()}
              className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Comment</span>
            </button>
          </div>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
            {user && (
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <Button
                    onClick={handleAddComment}
                    size="sm"
                    disabled={!newComment.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {comments.map((comment) => {
                const canDeleteComment = user && (user.id === comment.author._id || user.id === post.author._id);
                return (
                  <div key={comment._id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          {canDeleteComment && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 h-auto"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
      </Card>
      
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={deleteCommentId ? confirmDeleteComment : confirmDeletePost}
        title={deleteCommentId ? "Delete Comment" : "Delete Post"}
        message={deleteCommentId 
          ? "Are you sure you want to delete this comment? This action cannot be undone."
          : "Are you sure you want to delete this post? This will also delete all comments and likes. This action cannot be undone."
        }
        isLoading={isDeleting}
      />
    </>
  );
};

export default Post;
