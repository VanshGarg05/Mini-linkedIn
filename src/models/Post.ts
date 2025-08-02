import mongoose, { Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IComment {
  _id: string;
  content: string;
  author: IUser['_id'];
  createdAt: Date;
}

export interface IPost extends Document {
  content: string;
  author: IUser['_id'];
  image?: string;
  likes: IUser['_id'][];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const PostSchema = new mongoose.Schema<IPost>({
  content: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { 
    type: String, 
    required: false,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Image must be a valid URL'
    }
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema]
}, { 
  timestamps: true 
});

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
