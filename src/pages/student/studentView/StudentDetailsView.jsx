import React from 'react';
import { Card, Typography } from "@material-tailwind/react";

const StudentDetailsView = ({ studentData }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderSection = (title, fields) => (
    <div className="mb-6">
      <div className="border-l-4 border-blue-500 pl-3 mb-2">
        <Typography variant="h6" className="text-blue-gray-800 font-medium">
          {title}
        </Typography>
      </div>
      <div className="bg-white rounded-lg p-2 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
          {fields.map(field => (
            <div key={field.key} className="bg-green-50 p-2 rounded-md">
              <Typography variant="small" className="text-blue-900 text-xs mb-1">
                {field.label}
              </Typography>
              <Typography className="text-gray-900 text-sm  font-semibold">
                {field.value || "-"}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!studentData) return null;

  const personalInfo = [
    { key: "name", label: "Student Name", value: studentData.student.student_name },
    { key: "admissionNo", label: "Admission No", value: studentData.student.student_admission_no },
    { key: "class", label: "Joining Class", value: studentData.student.student_class },
    { key: "gender", label: "Gender", value: studentData.student.student_gender }
  ];

  const academicInfo = [
    { key: "year", label: "Academic Year", value: studentData.student.student_year },
    { key: "admissionDate", label: "Admission Date", value: formatDate(studentData.student.student_admission_date) },
    { key: "status", label: "Status", value: studentData.student.student_status },
    { key: "statsNo", label: "Stats No", value: studentData.student.student_stats_no }
  ];

  const fatherInfo = [
    { key: "fatherName", label: "Name", value: studentData.student.student_father_name },
    { key: "fatherMobile", label: "Mobile", value: studentData.student.student_father_mobile },
    { key: "fatherPan", label: "PAN No", value: studentData.student.student_father_pan_no },
    { key: "fatherAadhar", label: "Aadhar", value: studentData.student.student_father_adhar_no }
  ];

  const motherInfo = [
    { key: "motherName", label: "Name", value: studentData.student.student_mother_name },
    { key: "motherMobile", label: "Mobile", value: studentData.student.student_mother_mobile },
    { key: "motherPan", label: "PAN No", value: studentData.student.student_mother_pan_no },
    { key: "motherAadhar", label: "Aadhar", value: studentData.student.student_mother_adhar_no }
  ];

  const otherInfo = [
    { key: "email", label: "Email", value: studentData.student.student_email },
    { key: "address", label: "Address", value: studentData.student.student_address },
    { key: "category", label: "Category", value: studentData.student.student_category },
    { key: "caste", label: "Caste", value: studentData.student.student_caste }
  ];

  return (
    <div className="p-4 bg-white rounded-xl mb-4">
      <div className="max-w-full mx-auto space-y-2">
        {renderSection("Personal Information", personalInfo)}
        {renderSection("Academic Information", academicInfo)}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {renderSection("Father's Information", fatherInfo)}
          </div>
          <div>
            {renderSection("Mother's Information", motherInfo)}
          </div>
        </div>
        {renderSection("Additional Information", otherInfo)}
      </div>
    </div>
  );
};

export default StudentDetailsView;