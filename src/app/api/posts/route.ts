import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User'; // Import User model to register schema
import { verifyToken } from '@/lib/auth';

// GET all posts for home feed
export async function GET() {
  try {
    await dbConnect();
    // Ensure User model is registered
    void User;
    
    const posts = await Post.find()
      .populate('author', 'name email')
      .populate('comments.author', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new post
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

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

    const { content, image } = await request.json();

    // Validate content
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Post content is required' },
        { status: 400 }
      );
    }

    // Create post
    const post = new Post({
      content: content.trim(),
      author: decoded.userId,
      image: image || undefined,
    });

    await post.save();
    await post.populate('author', 'name email');

    return NextResponse.json(post);
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
