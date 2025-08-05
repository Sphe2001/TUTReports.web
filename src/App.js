import React from "react";
import { Route, Routes } from "react-router-dom";

// Auth Pages
import LoginPage from "./pages/auth/login/loginPage";
import ResetPasswordPage from "./pages/auth/resettingPages/resetPage";
import VerifyLoginOTPPage from "./pages/auth/verifyLoginOtp/verifyLoginOtp";
import VerifyPasswordResetOTPPage from "./pages/auth/verifyPasswordResetOtpPage/verifyPasswordResetOtp";
import SetPasswordPage from "./pages/auth/setPasswordPages/setPassword";
import ForgotPasswordPage from "./pages/auth/forgotPasswordPage/forgotPasswordPage";


// Dashboard Pages
import LecturerDashboardPage from "./pages/lecturer/lecturerDashboard/dashboard";
import HodDashPage from "./pages/reviewer/hodDashboard/hodDashPage";


// HOD Edit Profile page
import ReviewerSettings from "./pages/reviewer/reviewerSettings/reviewerSettings";



// Admin Pages
import AdminDashboard from "./pages/admin/adminDashboard/adminDashboard";



import AdminSettingsPage from "./pages/admin/settings/adminSettings";







// Updated Add & Manage User Pages

// User Management Pages

import AddUserPage from "./pages/admin/addUser/addUserPage";
import ManageUserPage from "./pages/admin/manageUser/manageUserPage";

// Lecturer Report Pages
import ReportHistory from "./pages/lecturer/myReport/reportHistory";
import WeeklyReport from "./pages/lecturer/lecturerWeeklyReport/weeklyReport";
import ViewRiport from "./pages/lecturer/myReport/viewRiport";
import EditReportPage from "./pages/lecturer/myReport/EditReportPage";
import ReportStatistics from "./pages/reviewer/reports/reportStatistics/reportStatistics";
import EditDraft from "./pages/lecturer/lecturerDrafts/editDraft";

// Lecturer Settings
import LectureSettings from "./pages/lecturer/lecturerSettings/lecturerSettings";

// Lecture Profile Pages




// Report Management Page 
import PendingReports from "./pages/reviewer/reports/pending/pendingReports";
import ViewReport from "./pages/reviewer/reports/viewAll/viewReport";
import ReviewedReports from "./pages/reviewer/reports/viewed/reviewedReports";


//Notifications

import NotificationsLecturer from "./pages/notifications/notificationsLecturer";
import AdminNotification from "./pages/notifications/adminNotification";
import LecturerNotification from "./pages/notifications/lecturerNotification";
import ReviewerNotification from "./pages/notifications/reviewerNotification";


import ViewLecturersPage from "./pages/admin/users/lecturers/view/viewLecturers";
import ViewReviewersPage from "./pages/admin/users/reviewers/view/viewReviewers";
import LecturerAssignPage from "./pages/admin/users/lecturers/assign/lecturerAssign";
import ReviewerAssignPage from "./pages/admin/users/reviewers/assign/reviewerAssign";


//Contact Us Page
import ContactUs from "./pages/contactUsPages/contactUs";
import AdminLayout from "./pages/admin/adminLayout";
import LecturerLayout from "./pages/lecturer/lecturerLayout";
import LecturerDraftsPage from "./pages/lecturer/lecturerDrafts/lecturerDrafts";
import AuthLayout from "./pages/auth/authLayout/authLayout";


//Home Page
import Home from "./pages/homePages/homePage";

import NavigationBar from "./pages/navigationPages/navigationBar";
import AboutPage from "./pages/aboutPages/aboutPage";

import ViewReportPage from "./pages/reviewer/reports/view/viewReport";
import ReviewerLayout from "./pages/reviewer/reviewerLayout";
import NotificationDetailWrapper from "./pages/notificationDetailsPages/notificationDetailWrapper";


import ManageDepartments from "./pages/admin/academic/manageDepartments/manageDepartments";
import ManageModules from "./pages/admin/academic/manageModules/manageModules";
import ManageGroups from "./pages/admin/academic/manageGroups/manageGroups";
import ManageChannels from "./pages/admin/academic/manageChannels/manageChannels";
import ManageRoles from "./pages/admin/academic/manageRoles/manageRoles";
import EditReviewerProfilePage from "./pages/admin/users/reviewers/profile/reviewerProfile";
import EditAdminProfilePage from "./pages/admin/users/admin/profile/adminProfile";
import EditLecturerProfilePage from "./pages/admin/users/lecturers/profile/lecturerProfile";
import AssignAcademicProperties from "./pages/admin/academic/assignProperties/assignProperties";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

const App = () => {
  return (

    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify/login-otp" element={<VerifyLoginOTPPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify/password-reset-otp" element={<VerifyPasswordResetOTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/navigationBar" element={<NavigationBar />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Route>

      {/*Lecturer routes */}
      <Route element={<ProtectedRoute allowedRoles={["LECTURER"]}><LecturerLayout /></ProtectedRoute>}>
        <Route path="/dashboard/lecturer" element={<LecturerDashboardPage />} />
        <Route path="/report-history" element={<ReportHistory />} />
        <Route path="/weekly-report" element={<WeeklyReport />} />
        <Route path="/view-lecture-report/:reportId" element={<ViewRiport />} />
        <Route path="/lecture/settings" element={<LectureSettings />} />
        <Route path="/lecturer-drafts" element={<LecturerDraftsPage />} />
        <Route path="/lecturer-notifications" element={<NotificationsLecturer />} />
        <Route path="/edit-lecture-report/:reportId" element={<EditReportPage />} />
        <Route path="/edit-report/:reportId" element={<EditReportPage />} />
        <Route path="/editDraft/:draftId" element={<EditDraft />} />
       <Route path="/lecturer-notification" element={<LecturerNotification />} />
      </Route>

      {/*Reviewer routes */}
      <Route element={<ProtectedRoute allowedRoles={["REVIEWER"]}><ReviewerLayout /></ProtectedRoute> }>
        <Route path="/dashboard/reviewer" element={<HodDashPage />} />
        <Route path="/view-report/:reportId" element={<ViewReportPage />} />
        <Route path="/pending-reports" element={<PendingReports />} />
        <Route path="/view-reports" element={<ViewReport />} />
        <Route path="/reviewed-reports" element={<ReviewedReports />} />
        <Route path="/reviewer-profile" element={<ReviewerSettings />} />
        <Route path="/report-stats" element={<ReportStatistics />} />
        <Route path="/reviewer-notification" element={<ReviewerNotification />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminLayout /></ProtectedRoute>}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/manage-users" element={<ManageUserPage />} />
        <Route path="/manage-users/add-user" element={<AddUserPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/manage-users/users/view/lecturers" element={<ViewLecturersPage />} />
        <Route path="/manage-users/users/view/reviewers" element={<ViewReviewersPage />} />
        <Route path="/assign/lecturer/:userId" element={<LecturerAssignPage />} />
        <Route path="/assign/reviewer/:userId" element={<ReviewerAssignPage />} />
        <Route path="/notification-detail" element={<NotificationDetailWrapper />} />
        <Route path="/manage-departments" element={<ManageDepartments />} />
        <Route path="/manage-modules" element={<ManageModules />} />
        <Route path="/manage-groups" element={<ManageGroups />} />
        <Route path="/manage-channels" element={<ManageChannels />} />
        <Route path="/manage-roles" element={<ManageRoles />} />
        <Route path="/manage-users/edit-admin/:userId" element={<EditAdminProfilePage />} />
        <Route path="/manage-users/edit-reviewer/:userId" element={<EditReviewerProfilePage />} />
        <Route path="/manage-users/edit-lecturer/:userId" element={<EditLecturerProfilePage />} />
        <Route path="/assign/academic/properties" element={<AssignAcademicProperties />} />
        <Route path="/admin-notification" element={<AdminNotification />} />
      </Route> 
    </Routes>
  );
};

export default App;
