import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateTournament from './pages/CreateTournament';
import TournamentRoom from './pages/TournamentRoom';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import PaymentStatus from './pages/PaymentStatus';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Leaderboard from './pages/Leaderboard';
import SupportCenter from './pages/SupportCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import AboutUs from './pages/AboutUs';
import { AuthProvider } from './hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';

const GOOGLE_CLIENT_ID = "416360118587-tdkit98527eaf0su65i4kbjt9pfuupns.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Router>
      <AuthProvider>

        <ToastContainer theme="dark" position="bottom-right" />
        <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-tournament" element={<CreateTournament />} />
              <Route path="/tournament/:id" element={<TournamentRoom />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/payment-status" element={<PaymentStatus />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/support" element={<SupportCenter />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/moderators/agt/login" element={<AdminLogin />} />
              <Route path="/moderators/agt/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

