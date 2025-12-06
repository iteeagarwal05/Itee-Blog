import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../services/blogService";
import { marked } from "marked";
import DOMPurify from "dompurify";
import CreatableSelect from "react-select/creatable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const predefinedTags = [
  { label: "React", value: "react" },
  { label: "JavaScript", value: "javascript" },
  { label: "Web Development", value: "web-development" },
  { label: "Programming", value: "programming" },
  { label: "CSS", value: "css" },
  { label: "Node.js", value: "nodejs" },
  { label: "Tutorial", value: "tutorial" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
];

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

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [imgValid, setImgValid] = useState(false);

  const maxContentLength = 2000;

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

  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    if (!coverImage) {
      setImgValid(false);
      return;
    }
    const img = new Image();
    img.onload = () => setImgValid(true);
    img.onerror = () => setImgValid(false);
    img.src = coverImage;
  }, [coverImage]);

  // Convert Markdown to sanitized HTML
  // const createMarkup = (markdown) => {
  //   const rawMarkup = marked.parse(markdown, { breaks: true });
  //   return { __html: DOMPurify.sanitize(rawMarkup) };
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPost = {
        title,
        content,
        tags: tags.map((tag) => tag.value.toLowerCase()),
        coverImage,
        isPublished,
      };
      await createBlog(newPost);
      Toastify({
        text: "Blog created successfully!",
        className: "info",
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#4fbe87",
        },
      }).showToast();
      if (isPublished) {
        navigate(`/posts/${newPost.slug}`);
      }
      navigate("/");
    } catch (error) {
      Toastify({
        text: "Error creating blog. Please try again.",
        className: "error",
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#f87171", // red-500
        }
      }).showToast();
      console.error("Error creating blog:", error);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(15px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes bounceCheckbox {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.15);
            }
          }
          .fade-in-up {
            animation: fadeInUp 0.6s ease forwards;
          }
          .checkbox-bounce:checked {
            animation: bounceCheckbox 0.3s ease;
          }
          input:focus, textarea:focus {
            transform: scale(1.02);
            box-shadow: 0 0 10px 2px #6366f1; /* indigo-500 */
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          button:hover {
            transform: scale(1.03);
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.5);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .img-preview {
            max-height: 250px;
            border-radius: 12px;
            box-shadow: 0 6px 15px rgba(99, 102, 241, 0.3);
            margin-top: 12px;
            object-fit: cover;
            opacity: 0;
            animation: fadeInUp 0.5s forwards;
          }
          .char-counter {
            font-size: 0.875rem;
            color: #6b7280; /* gray-500 */
            text-align: right;
            margin-top: 4px;
            font-weight: 500;
            user-select: none;
          }
          .markdown-preview {
            border: 1px solid #d1d5db; /* gray-300 */
            border-radius: 12px;
            padding: 20px;
            background: #f9fafb; /* gray-50 */
            color: #374151; /* gray-700 */
            max-height: 300px;
            overflow-y: auto;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.15);
            margin-top: 12px;
            line-height: 1.6;
          }
          .markdown-preview h1, .markdown-preview h2, .markdown-preview h3 {
            border-bottom: 2px solid #6366f1;
            padding-bottom: 6px;
            margin-top: 16px;
          }
          .markdown-preview code {
            background-color: #e5e7eb; /* gray-200 */
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
          }
          .markdown-preview pre {
            background-color: #e5e7eb; /* gray-200 */
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
          }
          .markdown-preview a {
            color: #4f46e5;
            text-decoration: underline;
          }
        `}
      </style>
      <main
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        }}
      >
        <div
          className={`w-full max-w-3xl bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-lg p-10 ${
            fadeIn ? "fade-in-up" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-extrabold text-gray-800 tracking-wide">
              Create New Post
            </h2>
            <button
              onClick={() => navigate("/")}
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition"
            >
              ← Back to Home
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              type="text"
              placeholder="Title"
              className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Write your story..."
                className="h-64 mb-10"
                maxLength={maxContentLength}
              />

              <div className="char-counter">
                {content.length} / {maxContentLength}
              </div>
              {/* Enable when the markdown format implement in the homepage and post blog page */}
              {/* <div
                className="markdown-preview"
                dangerouslySetInnerHTML={createMarkup(content)}
              /> */}
            </div>
            <CreatableSelect
              isMulti
              options={predefinedTags}
              onChange={(selectedOptions) => setTags(selectedOptions || [])}
              value={tags}
              placeholder="Enter or create tags..."
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "56px",
                  fontSize: "1.125rem",
                  borderRadius: "0.5rem",
                  borderColor: "#d1d5db",
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#6366f1",
                  color: "white",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: "white",
                  fontWeight: "600",
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: "white",
                  ":hover": {
                    backgroundColor: "#4f46e5",
                    color: "white",
                  },
                }),
              }}
            />
            <div>
              <input
                type="text"
                placeholder="Cover Image URL"
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none transition"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
              {imgValid && (
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="img-preview"
                />
              )}
            </div>
            <label className="flex items-center space-x-3 mt-4 cursor-pointer select-none text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={() => setIsPublished(!isPublished)}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 checkbox-bounce"
              />
              <span>Publish Now</span>
            </label>
            <button
              type="submit"
              className="w-full mt-8 bg-indigo-600 text-white text-xl font-semibold rounded-lg py-4 shadow-md hover:bg-indigo-700 transition-transform"
            >
              {isPublished ? "Publish Post" : "Save as Draft"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default CreatePost;
