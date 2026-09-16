import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import AdminTeam from "@/pages/admin/AdminTeam";
import PageNotFound from "@/lib/PageNotFound";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";

import EmployeeProfile from "@/pages/EmployeeProfile";
import RequestService from "@/pages/admin/RequestService";
import AdminRequests from "@/pages/admin/AdminRequests";
import RequestDetail from "@/pages/admin/RequestDetail";
import AdminJobs from "@/pages/admin/AdminJobs";
import JobDetail from "@/pages/admin/JobDetail";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminLayout from "@/components/admin/AdminLayout";
import CreateJob from "@/pages/admin/CreateJob";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CreateEmployee from "@/pages/admin/CreateEmployee";
import EmployeeDetail from "@/pages/admin/EmployeeDetail";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/team/:slug" element={<EmployeeProfile />} />
        <Route path="/request-service" element={<RequestService />} />
        <Route path="/login" element={<Login />} />

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
        </Route>

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Toaster />
    </Router>
  );
}

export default App;
