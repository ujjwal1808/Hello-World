import mongoose from "mongoose";

// Schema for media
const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video', 'file'], required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Updated Schema for messages
const messageSchema = new mongoose.Schema({
  content: { type: String }, // Optional, in case message has only media
  mediaUrl: { type: String }, // Optional
  mediaType: { type: String, enum: ['image', 'video', 'file'] }, // Optional
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Community schema
const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pendingInvites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  media: [mediaSchema],
  messages: [messageSchema]  // Stores both text and media messages
}, { timestamps: true });

const Community = mongoose.model('Community', communitySchema);
export default Community;
