'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Post from '@/components/Post';
import CreatePost from '@/components/CreatePost';
import { useAuth } from '@/contexts/AuthContext';
import { GradientCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PostData {
  _id: string;
  content: string;
  image?: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  likes?: string[];
  comments?: any[];
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-6 px-4 pb-8">
        {/* Welcome Section */}
        {!user && (
          <GradientCard className="mb-8 text-center">
            <div className="text-4xl mb-4">🎆</div>
            <h1 className="text-3xl font-bold text-white mb-3">Welcome to MiniLinkedIn</h1>
            <p className="text-white/90 mb-6 text-lg">Connect with professionals and share your inspiring journey</p>
            <div className="space-x-4">
              <Button onClick={() => window.location.href = '/register'} size="lg">
                ✨ Join Now
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/login'} size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Sign In
              </Button>
            </div>
          </GradientCard>
        )}

        {user && <CreatePost onPostCreated={fetchPosts} />}
        
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
              <p className="text-slate-600 mt-3 text-sm">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No posts yet</h3>
              <p className="text-slate-600">Be the first to share something!</p>
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <Post 
                  key={post._id} 
                  post={post} 
                  onPostUpdated={fetchPosts}
                  onPostDeleted={fetchPosts}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
