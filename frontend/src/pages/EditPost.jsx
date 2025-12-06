import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { getBlogBySlug, updateBlog } from "../services/blogService";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

// Example tag options — you can customize or fetch dynamically
const tagOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "react", label: "React" },
  { value: "css", label: "CSS" },
  { value: "webdev", label: "Web Development" },
  { value: "nodejs", label: "Node.js" },
];

// Move formats array here, outside of the component
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "color",
  "background",
  "align",
  "link",
  "image",
];

export default function EditPost() {
  const { slug } = useParams();
  
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]); // now array of {value,label}
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      const blog = await getBlogBySlug(slug);

      setTitle(blog.title);
      setContent(blog.content);
      const formattedTags = (blog.tags || []).map((tag) => ({
        value: tag,
        label: tag.charAt(0).toUpperCase() + tag.slice(1),
      }));
      setTags(formattedTags);
      setCoverImage(blog.coverImage || "");
      setIsPublished(blog.isPublished || false);
    };
    loadBlog();
  }, [slug]);

  const handleTagsChange = (selectedOptions) => {
    setTags(selectedOptions || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsAsStrings = tags.map((tag) => tag.value.toLowerCase());

    try {
      await updateBlog(slug, {
        title,
        content,
        tags: tagsAsStrings,
        coverImage,
        isPublished,
      });
      navigate(`/posts/${slug}`);
      Toastify({
        text: "Post updated successfully!",
        className: "info",
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#4fbe87",
        },
      }).showToast();
    } catch (error) {
      console.error("Update failed", error);
      Toastify({
        text: "Error updating post. Please try again.",
        className: "error",
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#f87171",
        },
      }).showToast();
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <>
      <style>
        {`
      .char-counter {
                    font-size: 0.875rem;
                    color: #6b7280; /* gray-500 */
                    text-align: right;
                    margin-top: 4px;
                    font-weight: 500;
                    user-select: none;
                }
      `}
      </style>
      <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-6 py-12">
        <main className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-200 p-12">
          <h2 className="text-4xl font-extrabold mb-10 text-indigo-900 text-center drop-shadow-sm">
            Edit Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <input
              type="text"
              placeholder="Title"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Content */}

            <div>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Write your story..."
                className="h-64 mb-10"
                maxLength={2000}
              />

              <div className="char-counter">
                {content.length} / {2000}
              </div>
            </div>

            <CreatableSelect
              isMulti
              name="tags"
              options={tagOptions}
              classNamePrefix="select"
              value={tags}
              onChange={handleTagsChange}
              placeholder="Select or type new tags..."
              isClearable
              className="mt-10"
              isSearchable
              formatCreateLabel={(inputValue) =>
                `Create new tag: "${inputValue}"`
              }
            />

            {/* Cover Image URL */}
            <input
              type="text"
              placeholder="Cover Image URL"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />

            {/* Live preview of cover image */}
            {coverImage && (
              <div className="mt-4 rounded-lg overflow-hidden shadow-lg max-h-64">
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="object-cover w-full h-64"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/400x256?text=Invalid+Image";
                  }}
                />
              </div>
            )}

            {/* Publish checkbox */}
            <label className="flex items-center space-x-2 text-gray-700 text-lg">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span>Publish</span>
            </label>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
              >
                Update Post
              </button>
              <button
                type="button"
                onClick={() => navigate(`/posts/${slug}`)}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
