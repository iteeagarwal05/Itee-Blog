import slugify from "slugify";
import Blog from "../models/Blog.js";

export const generateUniqueSlug = async (title, blogId = null) => {
  let baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = blogId
      ? { slug, _id: { $ne: blogId } }
      : { slug };

    const existing = await Blog.findOne(query);
    if (!existing) break;

    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};