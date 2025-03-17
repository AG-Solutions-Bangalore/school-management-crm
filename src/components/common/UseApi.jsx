import axios from "axios";
import BASE_URL from "../../base/BaseUrl";

// Generic API Request Function
const apiRequest = async (method, endpoint, data = null) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data; // Return API response
  } catch (error) {
    console.error(`Error in ${method} request to ${endpoint}`, error);
    return { code: 500, msg: "Internal Server Error" };
  }
};

const apiRequestUpdate = async (method, endpoint, data = null) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data; // Return API response
  } catch (error) {
    console.error(`Error in ${method} request to ${endpoint}`, error);
    return { code: 500, msg: "Internal Server Error" };
  }
};
// --------------------------HOLIDAY------------------------
// Fetch Holidays API
export const fetchHolidays = (selectedYear) =>
  apiRequest("GET", `/api/panel-fetch-holiday-list/${selectedYear}`);

// Fetch Holiday by ID for Editing
export const fetchHolidayById = (id) =>
  apiRequest("GET", `/api/panel-fetch-holiday-list-by-id/${id}`);

// Create Holiday API
export const createHoliday = (holidayData) =>
  apiRequest("POST", "/api/panel-create-holiday-list", holidayData);

// Update Holiday API
export const updateHoliday = (id, holidayData) =>
  apiRequest("PUT", `/api/panel-update-holiday-list/${id}`, holidayData);

// Delete Holiday API
export const deleteHoliday = (deleteId) =>
  apiRequest("DELETE", `/api/panel-delete-holiday-list/${deleteId}`);
// -------------------------SUBJECT-----------------------
// Fetch SUBJECT API
export const fetchSubjectList = () =>
  apiRequest("GET", `/api/panel-fetch-subject-list`);
// Fetch class API
export const fetchClassList = () =>
  apiRequest("GET", `/api/panel-fetch-classes`);

// Update subject API
export const updateSubject = (id, status) =>
  apiRequest("PUT", `/api/panel-update-subject-status/${id}`, status);
// Update Create API
export const createSubject = (studentData) =>
  apiRequest("POST", "/api/panel-create-subject", studentData);

// ------------SCHOOL FEES STUCTURE----------------

// Fetch fee API
export const fetchFeesStructure = () =>
  apiRequest("GET", `/api/panel-fetch-fee-structure-list`);

// -----------------------TEACHER LIST--------------------------------
// Fetch teacherlist API
export const fetchTeacherList = () =>
  apiRequest("GET", `/api/panel-fetch-teacher-list`);
// Fetch teacherlist API
export const fetchTeacherUserTypes = () =>
  apiRequest("GET", `/api/panel-fetch-usertypes`);
// Update teacher API
export const updateTeacherStatus = (id) =>
  apiRequest("PUT", `/api/panel-update-teacher-status/${id}`);
// Update Create API
export const createTeacherList = (Data) =>
  apiRequest("POST", "/api/panel-create-teacher", Data);

// Fetch Teacher by ID for Editing
export const fetchTeacherById = (id) =>
  apiRequest("GET", `/api/panel-fetch-teacher-by-id/${id}`);

// Update TeacherList  API
export const updateTeacher = (id, data) =>
  apiRequest("PUT", `/api/panel-update-teacher/${id}`, data);

// Fetch TeaacherListView API
export const TeaacherListView = (selectedYear, decryptedId) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-teacher-view/${selectedYear}/${decryptedId}`
  );

// Create Teacher sub  API
export const createTeacherSubAssign = (Data) =>
  apiRequest("POST", "/api/panel-create-teacher-subject-assign", Data);

// Update TeacherSubassign API
export const TeacherSubAssign = (selectedTeacherSubId, data) =>
  apiRequest(
    "PUT",
    `/api/panel-update-teacher-subject-assign/${selectedTeacherSubId}`,
    data
  );

// Fetch TeacherAttendanceListGETLIST API
export const TeaacherAttendanceList = (selectedYear) =>
  apiRequest("GET", `/api/panel-fetch-teacher-attendance-list/${selectedYear}`);

// Create TeacherAttendanceListCreate  API
export const CreateTeacherAttendanceList = (Data) =>
  apiRequest("POST", "/api/panel-create-teacher-attendance", Data);
// Fetch TeacherAttendanceListgetbyid API
export const TeacherAttendanceyId = (attendanceid) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-teacher-attendance-by-id/${attendanceid}`
  );
//// UpdateAttendanc  API

export const UpdateTeacherAttendanceList = (attendanceid, data) =>
  apiRequest(
    "PUT",
    `/api/panel-update-teacher-attendance/${attendanceid}`,
    data
  );
//// DeleteAttendanc  API

export const DeleteTeacherAttendanceList = (attendanceid) =>
  apiRequest("DELETE", `/api/panel-delete-teacher-attendance/${attendanceid}`);

//// View TeacherAttendancView  API
export const ViewTeacherAttendance = (data) =>
  apiRequest("POST", "/api/panel-fetch-teacher-attendance", data);
//// DeleteAttendanceView  API
export const DeleteAttendanceView = (attendanceId) =>
  apiRequest("DELETE", `/api/panel-delete-teacher-attendance/${attendanceId}`);
//// CreateTeacherAttendance API
export const CreateTeacherAttendanceView = (data) =>
  apiRequest("POST", "/api/panel-create-teacher-attendance", data);

// -----------------------STUDENT----------------------------
// Fetch fetchStudentList API
export const fetchStudentList = () =>
  apiRequest("GET", `/api/panel-fetch-student-list`);
// Fetch UpdateStudentStatus API

export const UpdateStudentStatus = (id) =>
  apiRequest("PUT", `/api/panel-update-student-status/${id}`);

// Fetch YearList API
export const YearList = () => apiRequest("GET", `/api/panel-fetch-year-list`);
// Fetch fetchAdmissionData API
export const StudentAdmissionDate = (data) =>
  apiRequest("GET", `/api/panel-fetch-student-admission-no/${data}`);
//// CreateStudent API
export const CreateStudentList = (data) =>
  apiRequest("POST", "/api/panel-create-student", data);
//// fetchStudentByID API
export const StudentById = (decryptedId) =>
  apiRequest("GET", `/api/panel-fetch-student-by-id/${decryptedId}`);
//// CreateStudent API
export const UpdateStudentByid = (decryptedId, formData) =>
  apiRequestUpdate(
    "POST",
    `/api/panel-update-student/${decryptedId}?_method=PUT`,
    formData
  );

//// ViewStudentByID API
export const ViewStudentById = (selectedYear, decryptedId) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student-view/${selectedYear}/${decryptedId}`
  );
//EditClassAndFees
export const EditClassAndFees = (feesId, formData) =>
  apiRequest("PUT", `/api/panel-update-student-class-fees/${feesId}`, formData);

//// StudentAttendanceByID API
export const StudentAttendanceById = (attendenceId) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student-attendance-by-id/${attendenceId}`
  );
export const UpdateStudentAttendanceById = (attendenceId, formData) =>
  apiRequest(
    "PUT",
    `/api/panel-update-student-attendance/${attendenceId}`,
    formData
  );
export const UpdateStudentVanFees = (classId, formData) =>
  apiRequest("PUT", `/api/panel-update-student-class/${classId}`, formData);
//CreateClassandfees
export const CreateClassandFees = (data) =>
  apiRequest("POST", "/api/panel-create-student-class", data);

//// StudentClassAndFessById
export const StudentClassAndFessById = (classId) =>
  apiRequest("GET", `/api/panel-fetch-student-class-by-id/${classId}`);

// Fetch CurrentStudentListByYear API
export const CurrentStudentListByYear = (selectedYear) =>
  apiRequest("GET", `/api/panel-fetch-current-student-list/${selectedYear}`);

//// StudentAttendanceLisyByYear
export const StudentAttendanceLisyByYear = (selectedYear) =>
  apiRequest("GET", `/api/panel-fetch-student-attendance-list/${selectedYear}`);

//// StudentAttendanceLisyById
export const StudentAttendanceLisyById = (attendanceid) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student-attendance-by-id/${attendanceid}`
  );
//// UpdateStudentAttendanceLisyById

export const UpdateStudentAttendanceLisyById = (attendanceid, data) =>
  apiRequest(
    "PUT",
    `/api/panel-update-student-attendance/${attendanceid}`,
    data
  );
export const DeleteStudentAttendanceLisyById = (attendanceid) =>
  apiRequest("DELETE", `/api/panel-delete-student-attendance/${attendanceid}`);

//CreateStudentAttendance
export const FetchStudentAttendance = (data) =>
  apiRequest("POST", "/api/panel-fetch-student-attendance", data);
//CreateStudentAttendance
export const CreateStudentAttendance = (data) =>
  apiRequest("POST", "/api/panel-create-student-attendance", data);

//// StudentAttendanceLisyById
export const StudentPendingClassFees = (selectedYear) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student-pending-class-fees/${selectedYear}`
  );
//// StudentAttendanceLisyById
export const PaymentType = () =>
  apiRequest("GET", `/api/panel-fetch-paymentType`);
//// StudentAttendanceLisyById
export const fetchStudentsByYear = (selectedYear, selectedClass) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student/${selectedYear}/${selectedClass}`
  );
/////StudentPendingClassFeesCreate
export const StudentPendingClassFeesCreate = (data) =>
  apiRequest(
    "POST",
    `/api/panel-fetch-student-pending-class-fees-for-create`,
    data
  );
/////CreateStudentPendingClassFees
export const CreateStudentPendingClassFees = (data) =>
  apiRequest("POST", `/api/panel-create-student-class-fees`, data);
//// fetchClassTimetable
export const fetchClassTimetable = (selectedYear) =>
  apiRequest("GET", `/api/panel-fetch-student-class-timetable/${selectedYear}`);
//// fetchTeacherTimetable
export const fetchTeacherTimetable = (selectedYear) =>
  apiRequest("GET", `/api/panel-fetch-teacher-class-timetable/${selectedYear}`);
//// fetchWebisteEnquiry
export const fetchWebisteEnquiry = () =>
  apiRequest("GET", `/api/panel-fetch-website-enquiry-list`);
//// fetchWebisteEnquiry
export const fetchWebisteContract = () =>
  apiRequest("GET", `/api/panel-fetch-website-contact-list`);
//// DownloadStudentDetails API
export const DownloadStudentDetails = (data) =>
  apiRequest("POST", "/api/panel-download-student-details-report", data);
//// DownloadStudentCurrentDetails API
export const DownloadStudentCurrentDetails = (data) =>
  apiRequest(
    "POST",
    "/api/panel-download-current-student-details-report",
    data
  );
//// DownloadStudentCurrentDetails API
export const DownloadTeacherDetails = (data) =>
  apiRequest("POST", "/api/panel-download-teacher-details-report", data);
//// DownloadStudentCurrentDetails API
export const DownloadStudentPending = (data) =>
  apiRequest("POST", "/api/panel-download-student-pending-fees-report", data);
//// ViewPendingFeesReport API
export const ViewPendingFeesReport = (data) =>
  apiRequest("POST", "/api/panel-fetch-student-pending-fees-report", data);
export const ChangePassword = (data) =>
  apiRequest("POST", "/api/panel-change-password", data);
// --------------------PAGE PERMISSSION----------------------
export const fetchPagePermissionData = () =>
  apiRequest("GET", `/api/panel-fetch-usercontrol-new`);
export const fetchUserControlData = () =>
  apiRequest("GET", `/api/panel-fetch-usercontrol`);
export const fetchUserTypeList = () =>
  apiRequest("GET", `/api/panel-fetch-usertype`);
export const fetchUserControlById = (permissionId) =>
  apiRequest("PUT", `/api/panel-update-usercontrol/${permissionId}`);
export const fetchUserControlNew = (permissionId) =>
  apiRequest("PUT", `/api/panel-update-usercontrol-new/${permissionId}`);
export const fetchDashboard = (selectedYear) =>
  apiRequest("GET", `/api/panel-fetch-dashboard/${selectedYear}`);
