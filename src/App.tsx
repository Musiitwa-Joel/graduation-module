import { useContext, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "@/components/Dashboard";
import Sidebar from "@/components/Sidebar";
import StudentManagement from "@/components/students/StudentManagement";
import StudentProfile from "@/components/students/StudentProfile";
import ClearanceWorkflow from "@/components/clearance/ClearanceWorkflow";
import GraduationList from "@/components/graduation/GraduationList";
import Finance from "@/components/finance/FinancePayment";
import CeremonyCoordination from "@/components/ceremony/CeremonyCoordination";
import DocumentManagement from "@/components/documents/DocumentManagement";
import AlumniIntegration from "@/components/alumni/AlumniIntegration";
import SystemAdministration from "@/components/admin/SystemAdministration";
import ReportsAnalytics from "@/components/reports/ReportsAnalytics";
import { UserProvider } from "@/context/UserContext";
import { StudentProvider } from "@/context/StudentContext";
import ErrorScreen from "./components/error/404";
import { GET_MY_PROFILE } from "./gql/queries";
import { AuthContext } from "./auth/AuthContext";
import { useLazyQuery } from "@apollo/client";
import GraduationSettings from "./components/settings/GraduationSettings";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loadMyProfile, { error }] = useLazyQuery(GET_MY_PROFILE, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (error) {
      // authContext?.setToken(null);
      console.log("error", error);
    }
  }, [error]);

  const login = async () => {
    try {
      const res2 = await loadMyProfile();

      console.log("res2", res2.data);

      if (res2.data) {
        authContext?.setUser(res2.data.my_profile);

        setIsLoading(false); // Mark authentication as complete
      } else {
        authContext?.setToken(null);
        // navigate("/login"); // Redirect if authentication fails
      }
    } catch (error) {
      console.log("eroorrrrrr", error);
      authContext?.setToken(null);
      // navigate("/login");
    }
  };

  useEffect(() => {
    login();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="graduation-theme">
      <UserProvider>
        <StudentProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <div className="flex flex-1 overflow-hidden">
              <Sidebar collapsed={collapsed} />
              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/students" element={<StudentManagement />} />
                  <Route path="/students/:id" element={<StudentProfile />} />
                  <Route path="/clearance" element={<ClearanceWorkflow />} />
                  <Route path="/graduation-list" element={<GraduationList />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/ceremony" element={<CeremonyCoordination />} />
                  <Route path="/documents" element={<DocumentManagement />} />
                  <Route path="/alumni" element={<AlumniIntegration />} />
                  <Route path="/admin" element={<SystemAdministration />} />
                  <Route path="/reports" element={<ReportsAnalytics />} />
                  <Route path="/settings" element={<GraduationSettings />} />
                  <Route path="/error" element={<ErrorScreen type="404" />} />
                </Routes>
              </main>
            </div>
            <Toaster />
          </div>
        </StudentProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
