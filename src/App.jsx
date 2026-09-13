import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminTeam from "./pages/admin/AdminTeam";
import PageNotFound from "./lib/PageNotFound";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";

import EmployeeProfile from "./pages/EmployeeProfile";
import RequestService from "./pages/RequestService";
import AdminRequests from "./pages/AdminRequests";
import RequestDetail from "./pages/RequestDetail";
import AdminJobs from "./pages/AdminJobs";
import JobDetail from "./pages/JobDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import CreateJob from "@/pages/admin/CreateJob";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/team/:slug" element={<EmployeeProfile />} />
        <Route path="/request-service" element={<RequestService />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="requests" element={<AdminRequests />} />
          <Route path="requests/:id" element={<RequestDetail />} />

          <Route path="jobs" element={<AdminJobs />} />
          <Route path="jobs/new" element={<CreateJob />} />
          <Route path="jobs/:id" element={<JobDetail />} />

          <Route path="team" element={<AdminTeam />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Toaster />
    </Router>
  );
}

export default App;
