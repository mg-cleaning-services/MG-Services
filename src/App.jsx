import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Global components — se cargan normalmente
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalyticsTracker from "@/components/GoogleAnalyticsTracker";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public pages
const Home = lazy(() => import("@/pages/Home"));
const EmployeeProfile = lazy(() => import("@/pages/EmployeeProfile"));
const RequestService = lazy(() => import("@/pages/RequestService"));
const Login = lazy(() => import("@/pages/Login"));
const CandidateApplication = lazy(() => import("@/pages/CandidateApplication"));

// Admin layout
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));

// Admin pages
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminRequests = lazy(() => import("@/pages/admin/AdminRequests"));
const RequestDetail = lazy(() => import("@/pages/admin/RequestDetail"));
const AdminJobs = lazy(() => import("@/pages/admin/AdminJobs"));
const CreateJob = lazy(() => import("@/pages/admin/CreateJob"));
const JobDetail = lazy(() => import("@/pages/admin/JobDetail"));
const AdminTeam = lazy(() => import("@/pages/admin/AdminTeam"));
const CreateEmployee = lazy(() => import("@/pages/admin/CreateEmployee"));
const EmployeeDetail = lazy(() => import("@/pages/admin/EmployeeDetail"));
const AdminCandidates = lazy(() => import("@/pages/admin/AdminCandidates"));
const CandidateDetail = lazy(() => import("@/pages/admin/CandidateDetail"));

// 404
const PageNotFound = lazy(() => import("@/lib/PageNotFound"));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <GoogleAnalyticsTracker />

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/team/:slug" element={<EmployeeProfile />} />
          <Route path="/request-service" element={<RequestService />} />
          <Route path="/login" element={<Login />} />
          <Route path="/apply" element={<CandidateApplication />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />

            <Route path="requests" element={<AdminRequests />} />
            <Route path="requests/:id" element={<RequestDetail />} />

            <Route path="jobs" element={<AdminJobs />} />
            <Route path="jobs/new" element={<CreateJob />} />
            <Route path="jobs/:id" element={<JobDetail />} />

            <Route path="team" element={<AdminTeam />} />
            <Route path="team/new" element={<CreateEmployee />} />
            <Route path="team/:id" element={<EmployeeDetail />} />

            <Route path="candidates" element={<AdminCandidates />} />
            <Route path="candidates/:id" element={<CandidateDetail />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>

      <Toaster />
    </Router>
  );
}

export default App;
