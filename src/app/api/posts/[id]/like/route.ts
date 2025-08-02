import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { verifyToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id: postId } = await params;

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user already liked this post
    const hasLiked = post.likes.includes(decoded.userId);

    if (hasLiked) {
      // Unlike - remove the like
      post.likes = post.likes.filter(like => (like as string).toString() !== decoded.userId);
      await post.save();
      return NextResponse.json({ 
        liked: false, 
        likeCount: post.likes.length,
        message: 'Post unliked' 
      });
    } else {
      // Like the post
      post.likes.push(decoded.userId);
      await post.save();
      return NextResponse.json({ 
        liked: true, 
        likeCount: post.likes.length,
        message: 'Post liked' 
      });
    }
  } catch (error) {
    console.error('Like/Unlike error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
