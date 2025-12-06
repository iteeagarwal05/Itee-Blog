import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export default function VersionHistoryModal({
  isOpen,
  onClose,
  slug,
  onRestored,
}) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen]);

  const fetchVersions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/blogs/${slug}/versions`
      );
      setVersions(res.data.data);
      Toastify({
        text: "Versions fetched successfully!",
        className: "info",
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#4caf50",
        },
      }).showToast();
    } catch (err) {
      Toastify({
        text: "Failed to fetch versions.",
        className: "error",
        close: true,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          backgroundColor: "#f44336",
        },
      }).showToast();
      console.error("Error fetching versions", err);
      setVersions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (index) => {
    const confirm = window.confirm("Restore this version?");
    if (!confirm) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/blogs/${slug}/restore/${index}`
      );

      const newSlug = res.data.data;
      alert("Version restored!");

      onClose();

      if (newSlug && newSlug !== slug) {
        navigate(`/`); // ✅ This triggers re-render
      } else {
        if (onRestored) onRestored(); // Fallback if slug didn't change
      }
    } catch (err) {
      console.error("Failed to restore version", err);
      alert("Failed to restore version");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
          <Dialog.Title className="text-xl font-bold mb-4">
            Version History
          </Dialog.Title>

          {loading ? (
            <div>Loading...</div>
          ) : !Array.isArray(versions) ? (
            <div className="text-red-500">Error: Invalid version data</div>
          ) : versions.length === 0 ? (
            <div className="text-gray-500">No versions available.</div>
          ) : (
            <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
              {versions.map((v, i) => (
                <li
                  key={i}
                  className="p-4 border rounded-xl shadow-sm bg-gray-50"
                >
                  <p className="font-semibold text-gray-800">{v.title}</p>
                  <p className="text-sm text-gray-500">
                    Saved on {new Date(v.updatedAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleRestore(versions.length - 1 - i)}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    🔄 Restore this version
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 text-right">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black text-sm font-medium"
            >
              ✖ Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
