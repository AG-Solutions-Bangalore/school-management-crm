import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { useSelector } from "react-redux";
////////////////////*****************All Api is Called Here Except UseManagement Page And Sigin And Forgot Password************************************** */

// Generic API Request Function
const apiRequest = async (method, endpoint, data = null, token) => {
  try {
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
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} request to ${endpoint}`, error);
    return { code: 500, msg: "Internal Server Error" };
  }
};

// ---------------------------LOGOUT------------------------------
// Create LOGOUT API
export const LogoutApi = (token) =>
  apiRequest("POST", "/api/panel-logout", null, token);
// --------------------------HOLIDAY------------------------
// Fetch Holidays API
export const HOLIDAY_LIST = (selectedYear, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-holiday-list/${selectedYear}`,
    null,
    token
  );

// Fetch Holiday by ID for Editing
export const FETCH_HOLIDAY_ID = (id, token) =>
  apiRequest("GET", `/api/panel-fetch-holiday-list-by-id/${id}`, null, token);

// Create Holiday API
export const CREATE_HOLIDAY = (holidayData, token) =>
  apiRequest("POST", "/api/panel-create-holiday-list", holidayData, token);

// Update Holiday API
export const UPDATE_HOLIDAY = (id, holidayData, token) =>
  apiRequest("PUT", `/api/panel-update-holiday-list/${id}`, holidayData, token);

// Delete Holiday API
export const DELETE_HOLIDAY = (deleteId, token) =>
  apiRequest(
    "DELETE",
    `/api/panel-delete-holiday-list/${deleteId}`,
    null,
    token
  );
// -------------------------SUBJECT-----------------------
// Fetch SUBJECT API
export const FETCH_SUBJECT_LIST = (token) =>
  apiRequest("GET", `/api/panel-fetch-subject-list`, null, token);
// Fetch class API
export const FETCH_CLASS_LIST = (token) =>
  apiRequest("GET", `/api/panel-fetch-classes`, null, token);

// Update subject API
export const UPDATE_SUBJECT = (id, status, token) =>
  apiRequest("PUT", `/api/panel-update-subject-status/${id}`, status, token);
// Update Create API
export const CREATE_SUBJECT = (studentData, token) =>
  apiRequest("POST", "/api/panel-create-subject", studentData, token);

// ------------SCHOOL FEES STUCTURE----------------

// Fetch fee API
export const FEES_STUCTURE = (token) =>
  apiRequest("GET", `/api/panel-fetch-fee-structure-list`, null, token);

// -----------------------TEACHER LIST--------------------------------
// Fetch teacherlist API
export const TEACHER_LIST = (token) =>
  apiRequest("GET", `/api/panel-fetch-teacher-list`, null, token);
// Fetch teacherlist API
export const TEACHER_USER_TYPES = (token) =>
  apiRequest("GET", `/api/panel-fetch-usertypes`, null, token);
// Update teacher API
export const UPDATE_TEACHER_STATUS = (id, token) =>
  apiRequest("PUT", `/api/panel-update-teacher-status/${id}`, null, token);
// Update Create API
export const CREATE_TEACHER = (data, token) =>
  apiRequest("POST", "/api/panel-create-teacher", data, token);

// Fetch Teacher by ID for Editing
export const FETCH_TEACHER_BY_ID = (id, token) =>
  apiRequest("GET", `/api/panel-fetch-teacher-by-id/${id}`, null, token);

// Update TeacherList  API
export const UPDATE_TEACHER = (id, data, token) =>
  apiRequest("PUT", `/api/panel-update-teacher/${id}`, data, token);

// Fetch TeaacherListView API
export const TEACHER_VIEW_BY_ID = (selectedYear, decryptedId, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-teacher-view/${selectedYear}/${decryptedId}`,
    null,
    token
  );
//fetch school period
export const TEACHER_SCHOOL_PERIOD = (token) =>
  apiRequest("GET", `/api/panel-fetch-school-period`, null, token);
//fetch school period
export const FETCH_SUBJECT_BY_CLASS = (className, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-subject-by-class/${className}`,
    null,
    token
  );
export const FETCH_TEACHER_SUBJECT_BY_ID = (id, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-teacher-subject-assign-by-id/${id}`,
    null,
    token
  );

// Create Teacher sub  API
export const CREATE_TEACHER_SUBJECT_ASSIGN = (data, token) =>
  apiRequest("POST", "/api/panel-create-teacher-subject-assign", data, token);

// Update TeacherSubassign API
export const UPDATE_TEACHER_SUBJECT_ASSIGN = (
  selectedTeacherSubId,
  data,
  token
) =>
  apiRequest(
    "PUT",
    `/api/panel-update-teacher-subject-assign/${selectedTeacherSubId}`,
    data,
    token
  );

// Fetch TeacherAttendanceListGETLIST API
export const TEACHER_ATTENDANCE_LIST = (selectedYear, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-teacher-attendance-list/${selectedYear}`,
    null,
    token
  );

// Create TeacherAttendanceListCreate  API
export const CREATE_TEACHER_ATTENDANCE = (Data, token) =>
  apiRequest("POST", "/api/panel-create-teacher-attendance", Data, token);
// Fetch TeacherAttendanceListgetbyid API
export const TEACHER_ATTENDANCELIST_BY_ID = (attendanceid, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-teacher-attendance-by-id/${attendanceid}`,
    null,
    token
  );
//// UpdateAttendanc  API

export const UPDATE_TEACHERATTENDANCE_LIST = (attendanceid, data, token) =>
  apiRequest(
    "PUT",
    `/api/panel-update-teacher-attendance/${attendanceid}`,
    data,
    token
  );
//// DeleteAttendanc  API

export const DELETE_TEACHERATTENDANCE_LIST = (attendanceid, token) =>
  apiRequest(
    "DELETE",
    `/api/panel-delete-teacher-attendance/${attendanceid}`,
    null,
    token
  );

//// View TeacherAttendancView  API
export const TEACHER_VIEW_LIST = (data, token) =>
  apiRequest("POST", "/api/panel-fetch-teacher-attendance", data, token);

// -----------------------STUDENT----------------------------
// Fetch fetchStudentList API
export const STUDENT_LIST = (token) =>
  apiRequest("GET", `/api/panel-fetch-student-list`, null, token);
// Fetch UpdateStudentStatus API

export const UPDATE_STUDENT_STATUS = (id, token) =>
  apiRequest("PUT", `/api/panel-update-student-status/${id}`, null, token);

// Fetch YearList API
export const YearList = (token) =>
  apiRequest("GET", `/api/panel-fetch-year-list`, null, token);
// Fetch fetchAdmissionData API
export const STUDENT_ADMISSION_NO = (data, token) =>
  apiRequest("GET", `/api/panel-fetch-student-admission-no/${(data, token)}`);
//// CreateStudent API
export const CREATE_STUDENT_LIST = (data, token) =>
  apiRequest("POST", "/api/panel-create-student", data, token);
//// fetchStudentByID API
export const STUDENT_BY_ID = (decryptedId, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student-by-id/${decryptedId}`,
    null,
    token
  );
//// CreateStudent API
export const UPDATE_STUDENT_BY_ID = (decryptedId, data, token) =>
  apiRequest(
    "POST",
    `/api/panel-update-student/${decryptedId}?_method=PUT`,
    data,
    token
  );

//// ViewStudentByID API
export const VIEW_STUDENT_BY_ID = (selectedYear, decryptedId, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student-view/${selectedYear}/${decryptedId}`,
    null,
    token
  );
//EditClassAndFees
export const UPDATE_STUDENT_CLASS_FEES = (feesId, formData, token) =>
  apiRequest(
    "PUT",
    `/api/panel-update-student-class-fees/${feesId}`,
    formData,
    token
  );

//// StudentAttendanceByID API
export const STUDENTATTENDANCE_BY_ID = (attendenceId, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student-attendance-by-id/${attendenceId}`,
    null,
    token
  );
export const UPDATE_STUDENT_ATTENDANCE_BY_ID = (
  attendenceId,
  formData,
  token
) =>
  apiRequest(
    "PUT",
    `/api/panel-update-student-attendance/${attendenceId}`,
    formData,
    token
  );
export const UPDATESTUDENT_FEES = (classId, formData, token) =>
  apiRequest(
    "PUT",
    `/api/panel-update-student-class/${classId}`,
    formData,
    token
  );
//CreateClassandfees
export const CREATE_CLASS_FEES = (data, token) =>
  apiRequest("POST", "/api/panel-create-student-class", data, token);

//// StudentClassAndFessById
export const STUDENT_CLASS_AND_FEES_BY_ID = (classId, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student-class-by-id/${classId}`,
    null,
    token
  );

// Fetch CurrentStudentListByYear API
export const CURRENT_STUDENT_LIST_BY_YEAR = (selectedYear, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-current-student-list/${selectedYear}`,
    null,
    token
  );

//// StudentAttendanceLisyByYear
export const STUDENT_ATTENDANCE_LIST_BY_YEAR = (selectedYear, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student-attendance-list/${selectedYear}`,
    null,
    token
  );

export const DELETE_STUDENTT_ATTENDANCE_BY_ID = (attendanceid, token) =>
  apiRequest(
    "DELETE",
    `/api/panel-delete-student-attendance/${attendanceid}`,
    null,
    token
  );

//CreateStudentAttendance
export const FETCH_STUDENT_ATTENDANCE = (data, token) =>
  apiRequest("POST", "/api/panel-fetch-student-attendance", data, token);
//CreateStudentAttendance
export const CREATE_STUDENT_ATTENDANCE = (data, token) =>
  apiRequest("POST", "/api/panel-create-student-attendance", data, token);

//// StudentAttendanceLisyById
export const STUDENT_PENDING_CLASS_FEES = (selectedYear, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student-pending-class-fees/${selectedYear}`,
    null,
    token
  );
//// StudentAttendanceLisyById
export const PAYMENT_TYPE = (token) =>
  apiRequest("GET", `/api/panel-fetch-paymentType`, null, token);
//// StudentAttendanceLisyById
export const FETCH_STUDENT_BY_YEAR = (selectedYear, selectedClass, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student/${selectedYear}/${selectedClass}`,
    null,
    token
  );
/////StudentPendingClassFeesCreate
export const STUDENT_PENDING_CLASS_FEES_CREATE = (data, token) =>
  apiRequest(
    "POST",
    `/api/panel-fetch-student-pending-class-fees-for-create`,
    data,
    token
  );
/////CreateStudentPendingClassFees
export const CREATE_STUDENT_PENDING_CLASS_FEES = (data, token) =>
  apiRequest("POST", `/api/panel-create-student-class-fees`, data, token);
//// fetchClassTimetable
export const FETCH_STUDENT_CLASS_FEES_BY_ID = (feesId, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student-class-fees-by-id/${feesId}`,
    null,
    token
  );

//// fetchClassTimetable
export const FETCH_ALL_STUDENT_DATA = (selectedYear, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-all-student-data/${selectedYear}`,
    null,
    token
  );
//// fetchClassTimetable
export const FETCH_CLASS_TIME_TABLE = (selectedYear, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-student-class-timetable/${selectedYear}`,
    null,
    token
  );
//// fetchTeacherTimetable
export const FETCH_TEACHER_TIME_TABLE = (selectedYear, token) =>
  apiRequest(
    "GET",
    `/api/panel-fetch-teacher-class-timetable/${selectedYear}`,
    null,
    token
  );
//// fetchWebisteEnquiry
export const FETCH_WEBSITE_ENQUIRY = (token) =>
  apiRequest("GET", `/api/panel-fetch-website-enquiry-list`, null, token);
//// fetchWebisteEnquiry
export const FETCH_WEBSITE_CONTRACT = (token) =>
  apiRequest("GET", `/api/panel-fetch-website-contact-list`, null, token);
//// DownloadStudentDetails API
export const DOWNLOAD_STUDENT_DETAILS = (data, token) =>
  apiRequest("POST", "/api/panel-download-student-details-report", data, token);
//// DownloadStudentCurrentDetails API
export const DOWNLOAD_STUDENT_CURRENT_DETAILS = (data, token) =>
  apiRequest(
    "POST",
    "/api/panel-download-current-student-details-report",
    data,
    token
  );
//// DownloadStudentCurrentDetails API
export const DownloadTeacherDetails = (data, token) =>
  apiRequest("POST", "/api/panel-download-teacher-details-report", data, token);
//// DownloadStudentCurrentDetails API
export const DOWNLOAD_STUDNET_PENDING = (data, token) =>
  apiRequest(
    "POST",
    "/api/panel-download-student-pending-fees-report",
    data,
    token
  );
//// ViewPendingFeesReport API
export const VIEW_PENDING_FEES_REPORT = (data, token) =>
  apiRequest(
    "POST",
    "/api/panel-fetch-student-pending-fees-report",
    data,
    token
  );
export const ChangePassword = (data, token) =>
  apiRequest("POST", "/api/panel-change-password", data, token);
// --------------------PAGE PERMISSSION----------------------
export const fetchPagePermissionData = (token) =>
  apiRequest("GET", `/api/panel-fetch-usercontrol-new`, null, token);
export const fetchUserControlData = (token) =>
  apiRequest("GET", `/api/panel-fetch-usercontrol`, null, token);
export const fetchUserTypeList = (token) =>
  apiRequest("GET", `/api/panel-fetch-usertype`, null, token);
export const FetchUserTypeDataById = (id, token) =>
  apiRequest("GET", `/api/panel-fetch-usertype-by-id/${id}`, null, token);
export const UpdateUserTypeData = (id, payload, token) =>
  apiRequest("PUT", `/api/panel-update-usertype/${id}`, payload, token);
export const fetchUserControlById = (permissionId, token) =>
  apiRequest(
    "PUT",
    `/api/panel-update-usercontrol/${permissionId}`,
    null,
    token
  );
export const fetchUserControlNew = (permissionId, token) =>
  apiRequest(
    "PUT",
    `/api/panel-update-usercontrol-new/${permissionId}`,
    null,
    token
  );
export const fetchDashboard = (selectedYear, token) =>
  apiRequest("GET", `/api/panel-fetch-dashboard/${selectedYear}`, null, token);
