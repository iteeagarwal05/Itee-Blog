import mongoose from "mongoose";
import { softDeletePlugin } from "../plugins/softDeletePlugin.js";
import slugify from "slugify";

const blogVersionSchema = new mongoose.Schema({
  title: String,
  content: String,
  coverImage: String,
  tags: [String],
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  coverImage: {
    type: String,
    default: "",
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  isDeleted: { 
    type: Boolean, 
    default: false
 },
 reactions: {
  type: Map,
  of: [String],
  default: {}
 },
 versions: [blogVersionSchema],
}, { timestamps: true });

blogSchema.plugin(softDeletePlugin);

blogSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Blog", blogSchema); 