import React from 'react';
import { Card } from "@material-tailwind/react";
import { IconUser, IconUsers, IconMail, IconId, IconHome, IconCategory, IconEye } from "@tabler/icons-react";

const StudentDetailsView = ({ studentData ,setIsAadharDialogOpen}) => {
  if (!studentData) return null;

  const InfoBlock = ({ icon: Icon, label, value,isAadhar = false }) => (
    <div className="bg-white rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-blue-600" />
        <span className="text-xs text-gray-700">{label}</span>
      </div>
    <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">{value || "-"}</span>
            {isAadhar && value && (
              <IconEye
                className="w-4 h-4 text-blue-600 cursor-pointer"
                onClick={() => setIsAadharDialogOpen(true)}
              />
            )}
          </div>
    </div>
  );

  const FamilyMemberCard = ({ title, data, bgColor }) => (
    <div className={`rounded-lg overflow-hidden ${bgColor}`}>
      <div className="px-4 py-2 bg-opacity-10 backdrop-blur-sm">
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
      </div>
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs text-gray-700 block">Name</span>
            <span className="text-sm font-medium text-gray-900">{data.name}</span>
          </div>
          <div>
            <span className="text-xs text-gray-700 block">Mobile</span>
            <span className="text-sm font-medium text-gray-900">{data.mobile}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-700 block">PAN</span>
            <span className="text-sm font-medium text-gray-900">{data.pan}</span>
          </div>
          <div>
            <span className="text-xs text-gray-700 block">Aadhar</span>
            <span className="text-sm font-medium text-gray-900">{data.aadhar}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="p-4 mb-2">
      <div className="space-y-6">
        {/* Personal & Additional Info Combined */}
        <div>
          <div className="flex items-center mb-3">
            <div className="flex-1 border-b border-gray-200"></div>
            <h2 className="px-4 text-base font-medium text-blue-900">Student Information</h2>
            <div className="flex-1 border-b border-gray-200"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <InfoBlock 
              icon={IconUser} 
              label="Student Name" 
              value={studentData.student.student_name} 
            />
            <InfoBlock 
              icon={IconId} 
              label="SATS Number" 
              value={studentData.student.student_stats_no} 
            />
            <InfoBlock 
              icon={IconMail} 
              label="Email ID" 
              value={studentData.student.student_email} 
            />
            <InfoBlock 
              icon={IconCategory} 
              label="Category" 
              value={studentData.student.student_category} 
            />
            <InfoBlock 
              icon={IconHome} 
              label="Address" 
              value={studentData.student.student_address} 
            />
            <InfoBlock 
              icon={IconCategory} 
              label="Aadhar" 
              value={studentData.student.student_adhar_no}
              isAadhar={true} 
            />
          </div>
        </div>

        {/* Family Information */}
        <div>
          <div className="flex items-center mb-3">
            <div className="flex-1 border-b border-gray-200"></div>
            <h2 className="px-4 text-base font-medium text-blue-900">Family Information</h2>
            <div className="flex-1 border-b border-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FamilyMemberCard 
              title="Father's Details"
              bgColor="bg-blue-50"
              data={{
                name: studentData.student.student_father_name,
                mobile: studentData.student.student_father_mobile,
                pan: studentData.student.student_father_pan_no,
                aadhar: studentData.student.student_father_adhar_no
              }}
            />
            <FamilyMemberCard 
              title="Mother's Details"
              bgColor="bg-purple-50"
              data={{
                name: studentData.student.student_mother_name,
                mobile: studentData.student.student_mother_mobile,
                pan: studentData.student.student_mother_pan_no,
                aadhar: studentData.student.student_mother_adhar_no
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StudentDetailsView;