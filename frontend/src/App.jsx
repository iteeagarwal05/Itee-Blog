import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import DraftsDashboard from './pages/DraftsDashboard'
import Dashboard from './pages/Dashboard'
import UserProfile from './pages/UserProfile'
import UserProfileView from "./pages/userProfileView";
import AllArticles from './pages/AllArticles'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route path="/drafts" element={<DraftsDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/view" element={<UserProfileView />} />
        <Route path="/posts" element={<AllArticles />} />
        <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/edit/:slug" element={<><ProtectedRoute><EditPost /></ProtectedRoute></>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
