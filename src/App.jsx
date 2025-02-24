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
import CreateSubject from "./pages/subject/CreateSubject";
import TeacherList from "./pages/teacher/TeacherList";
import CreateTeacher from "./pages/teacher/CreateTeacher";
import EditTeacher from "./pages/teacher/EditTecher";
import StudentList from "./pages/student/StudentList";
import CreateStudent from "./pages/student/CreateStudent";
import EditStudent from "./pages/student/EditStudent";
import FeesStructureList from "./pages/feesStructure/FeesStructureList";
import StudentView from "./pages/student/studentView/StudentView";
import AttendanceList from "./pages/attendance/attendanceList/AttendanceList";
import CreateAttendance from "./pages/attendance/attendanceList/CreateAttendance";
import EditAttendance from "./pages/attendance/attendanceList/EditAttendance";
import AttendanceView from "./pages/attendance/attendanceView/AttendanceView";
import EnquiryList from "./pages/webiste/Enquiry/EnquiryList";
import ContactList from "./pages/webiste/Contact/ContactList";

const App = () => {
  return (
    <>
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
        <Route path="/subject-list/createSubject" element={<CreateSubject />} />
        {/* Teacher  */}
        <Route path="/teacher-list" element={<TeacherList />} />
        <Route path="/teacher-list/createTeacher" element={<CreateTeacher />} />
        <Route path="/teacher-list/editTeacher/:id" element={<EditTeacher />} />
        {/* Student  */}
        <Route path="/student-list" element={<StudentList />} />
        <Route path="/student-list/createStudent" element={<CreateStudent />} />
        <Route path="/student-list/editStudent/:id" element={<EditStudent />} />
        <Route path="/student-list/viewStudent/:id" element={<StudentView />} />
        {/* Fees Structure  */}
        <Route path="/feesStructure-list" element={<FeesStructureList />} />
        {/* //Attendance */}
        {/* //attendancelist */}
        <Route path="/attendance-list" element={<AttendanceList />} />
        <Route
          path="/attendance-list/createAttendance"
          element={<CreateAttendance />}
        />
        <Route
          path="/attendance-list/editAttendance/:id"
          element={<EditAttendance />}
        />
        {/* //attendanceview */}
        <Route
          path="/attendance-list/viewAttendance"
          element={<AttendanceView />}
        />
        {/* //Website */}
        {/* //enqiry list */}
        <Route path="/website-list/enquiry" element={<EnquiryList />} />
        {/* //contactlist */}
        <Route path="/website-list/contact" element={<ContactList />} />
      </Routes>
    </>
  );
};

export default App;
