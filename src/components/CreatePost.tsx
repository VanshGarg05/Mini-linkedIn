'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { token, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter some content for your post');
      return;
    }

    if (!token) {
      setError('You must be logged in to create a post');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          return; // Error already set in uploadImage
        }
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content.trim(), image: imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      setContent('');
      setSelectedImage(null);
      setImagePreview('');
      setIsOpen(false);
      onPostCreated();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      {isOpen ? (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">Share with your network</p>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share your professional insights, achievements, or thoughts..."
            className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 text-gray-900 placeholder-gray-500"
            rows={4}
            maxLength={500}
            autoFocus
          />

          {imagePreview && (
            <div className="mt-4 relative">
              <Image
                src={imagePreview}
                alt="Preview"
                width={640}
                height={256}
                className="w-full max-h-64 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                disabled={isUploading}
              >
                <ImageIcon size={18} />
                <span className="text-sm font-medium">Add Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
            <span className={`text-sm ${content.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
              {content.length}/500
            </span>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => {
              setIsOpen(false);
              setContent('');
              removeImage();
            }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploading || !content.trim()}
            >
              {isSubmitting || isUploading ? 'Publishing...' : 'Share Post'}
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-6 text-left hover:bg-gray-50 transition-colors rounded-2xl"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-full px-4 py-3 text-gray-500 hover:bg-gray-200 transition-colors">
                ✨ Start a post... Share something inspiring!
              </div>
            </div>
          </div>
        </button>
      )}
    </Card>
  );
};

export default CreatePost;
