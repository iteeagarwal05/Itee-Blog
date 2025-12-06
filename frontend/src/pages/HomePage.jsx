import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getBlogs } from "../services/blogService";
import DOMPurify from "dompurify";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, totalPages } = await getBlogs({
        page,
        search,
        sortBy,
        sortOrder,
      });
      setPosts(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, search, sortBy, sortOrder]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    setSearch(searchValue);
    setPage(1);
    document.getElementById('blog-section').scrollIntoView({ behavior: 'smooth' });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology: 'bg-blue-500',
      Development: 'bg-green-500', 
      Design: 'bg-purple-500',
      default: 'bg-gray-500'
    };
    return colors[category] || colors.default;
  };

  const getCategoryFromTags = (tags) => {
    if (!tags || tags.length === 0) return 'General';
    const techTags = ['react', 'javascript', 'web', 'programming', 'coding'];
    const designTags = ['design', 'ui', 'ux', 'graphics'];
    const devTags = ['development', 'backend', 'frontend', 'fullstack'];
    
    const tagLower = tags[0].toLowerCase();
    if (techTags.some(t => tagLower.includes(t))) return 'Technology';
    if (designTags.some(t => tagLower.includes(t))) return 'Design';
    if (devTags.some(t => tagLower.includes(t))) return 'Development';
    return tags[0];
  };

  // Split posts into featured and sidebar posts
  const featuredPost = posts[0];
  const sidebarPosts = posts.slice(1, 3);
  const mainPosts = posts.slice(3);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 py-20 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to{" "}
            <span className="text-yellow-300 bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text">
              Itee's Blog
            </span>{" "}
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover the latest in technology, development, and design. Join our community of passionate
            creators and learners.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search articles..."
                className="w-full px-6 py-4 pl-14 text-lg rounded-full border-0 shadow-2xl focus:ring-4 focus:ring-white/30 focus:outline-none bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500"
              />
              <svg
                className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full font-semibold transition-colors duration-200 shadow-lg"
              >
                Search
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/create"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-3 rounded-full text-lg font-bold transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Your Post
            </Link>
            <button
              onClick={() => document.getElementById('blog-section').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-200 backdrop-blur-sm hover:scale-105"
            >
              Explore Articles
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <main id="blog-section" className="max-w-7xl mx-auto px-6 py-12 flex-grow">
        {loading ? (
          <div className="space-y-8">
            {/* Loading skeleton for featured post */}
            <div className="flex gap-8">
              <div className="flex-1">
                <div className="h-80 bg-gray-200 rounded-2xl animate-pulse mb-6"></div>
              </div>
              <div className="w-80 space-y-4">
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
            
            {/* Loading skeleton for main posts */}
            <div className="space-y-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-6 animate-pulse">
                  <div className="w-64 h-40 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Top Section with Featured Post and Sidebar */}
            {featuredPost && (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Featured Post */}
                <div className="flex-1">
                  <div className="relative group cursor-pointer">
                    <Link to={`/posts/${featuredPost.slug}`}>
                      {featuredPost.coverImage ? (
                        <img
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          className="w-full h-80 object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                          <div className="text-center p-8">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500">Featured Article</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`${getCategoryColor(getCategoryFromTags(featuredPost.tags))} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                          {getCategoryFromTags(featuredPost.tags)}
                        </span>
                      </div>
                    </Link>
                    
                    {/* Featured Post Content */}
                    <div className="mt-6">
                      <Link to={`/posts/${featuredPost.slug}`}>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                          {featuredPost.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                        {stripHtml(featuredPost.content).substring(0, 200)}...
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                            {featuredPost.author?.username?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{featuredPost.author?.username}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(featuredPost.createdAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-sm">124</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Posts */}
                <div className="lg:w-80 space-y-6">
                  {sidebarPosts.map((post) => (
                    <div key={post._id} className="group">
                      <Link to={`/posts/${post.slug}`}>
                        <div className="flex flex-col space-y-3">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Category Badge */}
                          <div className="relative -mt-8 ml-3">
                            <span className={`${getCategoryColor(getCategoryFromTags(post.tags))} text-white px-2 py-1 rounded text-xs font-medium`}>
                              {getCategoryFromTags(post.tags)}
                            </span>
                          </div>
                          
                          <div className="pt-2">
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">
                                {post.author?.username?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <span>{post.author?.username}</span>
                              <div className="flex items-center gap-1 ml-auto">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{Math.floor(Math.random() * 200) + 50}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Blog Posts List */}
            {mainPosts.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Latest Articles
                  </h2>
                  <Link
                    to="/posts"
                    className="text-blue-600 hover:underline font-medium text-base"
                  >
                    All Articles →
                  </Link>
                </div>
                
                <div className="space-y-8">
                  {mainPosts.map((post) => (
                    <article key={post._id} className="flex flex-col md:flex-row gap-6 group">
                      {/* Post Image */}
                      <div className="md:w-64 flex-shrink-0">
                        <Link to={`/posts/${post.slug}`}>
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-40 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                            />
                          ) : (
                            <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </Link>
                      </div>

                      {/* Post Content */}
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className={`${getCategoryColor(getCategoryFromTags(post.tags))} text-white px-2 py-1 rounded text-sm font-medium`}>
                            {getCategoryFromTags(post.tags)}
                          </span>
                        </div>
                        
                        <Link to={`/posts/${post.slug}`}>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {stripHtml(post.content).substring(0, 180)}...
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                              {post.author?.username?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{post.author?.username}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-sm">{Math.floor(Math.random() * 200) + 20}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors font-medium"
              >
                Previous
              </button>
              <span className="px-6 py-3 text-gray-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}