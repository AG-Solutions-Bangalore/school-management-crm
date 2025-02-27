import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";
import { Toaster } from "sonner";
import HolidayList from "./pages/holiday/HolidayList";
import CreateHoliday from "./pages/holiday/CreateHoliday";
import EditHoliday from "./pages/holiday/EditHoliday";
import SubjectList from "./pages/subject/SubjectList";

import FeesStructureList from "./pages/feesStructure/FeesStructureList";
import StudentView from "./pages/student/studentView/StudentView";
import EnquiryList from "./pages/webiste/Enquiry/EnquiryList";
import ContactList from "./pages/webiste/Contact/ContactList";
import AttendanceList from "./pages/student/attendanceList/AttendanceList";
import CreateAttendance from "./pages/student/attendanceList/CreateAttendance";
import EditAttendance from "./pages/student/attendanceList/EditAttendance";
import AttendanceView from "./pages/student/attendanceView/AttendanceView";
import StudentList from "./pages/student/studentList/StudentList";
import CreateStudent from "./pages/student/studentList/CreateStudent";
import EditStudent from "./pages/student/studentList/EditStudent";
import TeacherList from "./pages/teacher/teacherList/TeacherList";
import CreateTeacher from "./pages/teacher/teacherList/CreateTeacher";
import EditTeacher from "./pages/teacher/teacherList/EditTecher";
import TeacherAttendanceList from "./pages/teacher/teacherattendanceList/TeacherAttendanceList";
import CreateTeacherAttendance from "./pages/teacher/teacherattendanceList/CreateAttendance";
import TeacherViewAttendance from "./pages/teacher/teacherViewAttendance/TeacherViewAttendance";
import TeacherView from "./pages/teacher/teacherList/TeacherView";
import PendingFees from "./pages/student/pendingFees/PendingFees";
import CurrentStudentList from "./pages/student/currentStudent/CurrentStudentList";
import Timetable from "./pages/timetable/Timetable";
import TeacherTimeline from "./pages/teacherTimeline/TeacherTimeline";
import StudentReport from "./pages/report/StudentReport";
import TeacherReport from "./pages/report/TeacherReport";
import PendingFeesReport from "./pages/report/pendingFees.jsx/PendingFeesReport";
import PendingFeesReportView from "./pages/report/pendingFees.jsx/PendingFeesReportView";
import DisableRightClick from "./components/common/DisableRightClick";

const App = () => {
  return (
    <>
      <DisableRightClick />
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        {/* Holiday  */}
        <Route path="/holiday-list" element={<HolidayList />} />
        <Route path="/holiday-list/createHoliday" element={<CreateHoliday />} />
        <Route path="/holiday-list/editHoliday/:id" element={<EditHoliday />} />
        {/* Subject  */}
        <Route path="/subject-list" element={<SubjectList />} />
        {/* Teacher  */}
        <Route path="/teacher-list" element={<TeacherList />} />
        <Route path="/teacher-list/viewTeacher/:id" element={<TeacherView />} />
        <Route path="/teacher-list/createTeacher" element={<CreateTeacher />} />
        <Route path="/teacher-list/editTeacher/:id" element={<EditTeacher />} />
        {/* //Teacher Attendance */}
        <Route
          path="/teacher-attendance-list"
          element={<TeacherAttendanceList />}
        />
        {/* //Teacher Attendance Viwq */}
        <Route
          path="/teacher-viewAttendance"
          element={<TeacherViewAttendance />}
        />

        {/* Student  */}
        <Route path="/student-list" element={<StudentList />} />
        <Route path="/current-student-list" element={<CurrentStudentList />} />
        <Route path="/pending-fees" element={<PendingFees />} />
        <Route path="/student-list/createStudent" element={<CreateStudent />} />
        <Route path="/student-list/editStudent/:id" element={<EditStudent />} />
        <Route path="/student-list/viewStudent/:id" element={<StudentView />} />
        {/* //Attendance */}
        <Route path="/attendance-list" element={<AttendanceList />} />
        <Route
          path="/attendance-list/createAttendance"
          element={<CreateAttendance />}
        />

        {/* //attendanceview */}
        <Route
          path="/attendance-list/viewAttendance"
          element={<AttendanceView />}
        />
        {/* Fees Structure  */}
        <Route path="/feesStructure-list" element={<FeesStructureList />} />

        {/* //Website */}
        {/* //enqiry list */}
        <Route path="/website-list/enquiry" element={<EnquiryList />} />
        {/* //contactlist */}
        <Route path="/website-list/contact" element={<ContactList />} />

        {/* //report */}
        <Route path="/report-student/download" element={<StudentReport />} />
        <Route path="/report-teacher/download" element={<TeacherReport />} />
        <Route
          path="/report-pending/download"
          element={<PendingFeesReport />}
        />
        <Route
          path="/report-pending/download-view"
          element={<PendingFeesReportView />}
        />
        {/* time table  */}
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/teacher-timetable" element={<TeacherTimeline />} />
      </Routes>
    </>
  );
};

export default App;
