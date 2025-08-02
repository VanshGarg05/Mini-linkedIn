'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit, Save, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Post from '@/components/Post';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string;
}

interface PostData {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const params = useParams();

  const fetchProfileData = async () => {
    try {
      const resolvedParams = await params;
      const response = await fetch(`/api/users/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
        setPosts(data.posts);
        setEditedBio(data.user.bio || '');
      } else {
        router.push('/'); // Redirect if user not found
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [params, router]);

  const handleSaveBio = async () => {
    if (!user || !userProfile || user.id !== userProfile._id) return;
    
    try {
      setIsSaving(true);
      const response = await fetch(`/api/users/${userProfile._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio: editedBio }),
      });

      if (response.ok) {
        setUserProfile({ ...userProfile, bio: editedBio });
        setIsEditingBio(false);
      }
    } catch (error) {
      console.error('Error updating bio:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isOwnProfile = user && userProfile && user.id === userProfile._id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-6 px-4 pb-8">
        {userProfile && (
          <Card className="p-8 mb-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{userProfile.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">{userProfile.email}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">About</h3>
                {isOwnProfile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingBio(!isEditingBio)}
                    className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {isEditingBio ? (
                <div className="space-y-3">
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                    rows={4}
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleSaveBio}
                      disabled={isSaving}
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditingBio(false);
                        setEditedBio(userProfile.bio || '');
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
                <div>
                  {userProfile.bio ? (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{userProfile.bio}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      {isOwnProfile ? 'Click the edit button to add a bio' : 'No bio yet'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Posts ({posts.length})
          </h2>
          {posts.length === 0 ? (
            <Card className="text-center py-12 dark:bg-gray-800 dark:border-gray-700">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No posts yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isOwnProfile ? 'Share your first post!' : 'This user hasn\'t posted anything yet.'}
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Post 
                  key={post._id} 
                  post={post} 
                  onPostUpdated={fetchProfileData}
                  onPostDeleted={fetchProfileData}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

