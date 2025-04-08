import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String }, // URL for the image
  scheduledPostDate: { type: Date },
  status: { type: String, enum: ["published", "scheduled"], default: "published" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },

  // New Field: Controls who can see the post
  visibility: { type: String, enum: ["public", "connections"], default: "public" },
});

// Index for better query performance
postSchema.index({ author: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
