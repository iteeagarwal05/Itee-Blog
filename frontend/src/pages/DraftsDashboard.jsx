import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserDrafts } from "../services/blogService";

export default function DraftsDashboard() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await getUserDrafts();
        setDrafts(data);
      } catch (error) {
        console.error("Error fetching drafts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-600 font-medium tracking-wide">
        Loading your drafts...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-10">
      <h1 className="text-5xl font-extrabold mb-12 text-center text-indigo-900 drop-shadow-md">
        Your Drafts
      </h1>

      {drafts.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">
          You have no drafts yet.{" "}
          <Link
            to="/create"
            className="text-indigo-600 font-semibold hover:underline hover:text-indigo-800 transition"
          >
            Create one now!
          </Link>
        </p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {drafts.map((draft) => (
            <div
              key={draft._id}
              className="flex flex-col bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200"
            >
              {draft.coverImage ? (
                <div className="overflow-hidden rounded-t-3xl h-48">
                  <img
                    src={draft.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-48 bg-indigo-100 rounded-t-3xl flex items-center justify-center text-indigo-400 font-semibold text-lg">
                  No Image
                </div>
              )}

              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-indigo-900 mb-3 truncate">
                  {draft.title || "Untitled Draft"}
                </h2>

                <p className="text-sm text-gray-500 mb-5">
                  Created on{" "}
                  <time dateTime={draft.createdAt}>
                    {new Date(draft.createdAt).toLocaleDateString()}
                  </time>
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  {draft.tags?.length > 0 ? (
                    draft.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full select-none"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic text-xs">No tags</span>
                  )}
                </div>

                <Link
                  to={`/edit/${draft._id}`}
                  className="mt-auto inline-block text-center bg-indigo-600 text-white font-semibold rounded-full px-6 py-3 hover:bg-indigo-700 transition"
                  aria-label={`Edit draft titled ${draft.title}`}
                >
                  ✎ Edit Draft
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
