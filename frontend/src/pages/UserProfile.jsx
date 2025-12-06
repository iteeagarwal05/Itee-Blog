import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/userService";
import ProfileForm from "../components/ProfileForm";

const UserProfile = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleProfileUpdate = async (updatedData) => {
    try {
      setLoading(true);
      await updateUserProfile(updatedData);
      await refreshUser();
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            Update your profile information and manage your account settings
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${message.includes("Failed") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {message}
          </div>
        )}

        <ProfileForm initialData={user} onSubmit={handleProfileUpdate} />

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
