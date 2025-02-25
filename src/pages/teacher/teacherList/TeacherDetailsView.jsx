import React from "react";
import { Card } from "@material-tailwind/react";
import {
  IconUser,
  IconMail,
  IconId,
  IconHome,
  IconCategory,
  IconEye,
} from "@tabler/icons-react";
import moment from "moment";
import { Phone } from "lucide-react";
import { IconCalendar } from "@tabler/icons-react";

const InfoBlock = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors duration-300">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-blue-600" />
      <span className="text-xs text-gray-700">{label}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-900">{value || "-"}</span>
    </div>
  </div>
);

const BankDetailsCard = ({ title, fields, bgColor }) => (
  <div className={`rounded-lg overflow-hidden ${bgColor} p-3`}>
    <h3 className="text-sm font-medium text-gray-800 mb-2">{title}</h3>
    <div className="grid grid-cols-2 gap-2">
      {fields.slice(0, 2).map(({ label, value }) => (
        <div key={label}>
          <span className="text-xs text-gray-700 block">{label}</span>
          <span className="text-sm font-medium text-gray-900">
            {value || "-"}
          </span>
        </div>
      ))}
    </div>
    {fields.length > 2 && (
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100 mt-2">
        {fields.slice(2).map(({ label, value }) => (
          <div key={label}>
            <span className="text-xs text-gray-700 block">{label}</span>
            <span className="text-sm font-medium text-gray-900">
              {value || "-"}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const TeacherDetailsView = ({ teacherData }) => {
  if (!teacherData) return null;

  return (
    <Card className="p-4 mb-2">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center mb-3">
          <div className="flex-1 border-b border-gray-200"></div>
          <h2 className="px-4 text-base font-medium text-blue-900">
            Teacher Information
          </h2>
          <div className="flex-1 border-b border-gray-200"></div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <InfoBlock
            icon={IconUser}
            label="Teacher Name"
            value={`${teacherData.teacher.teacher_title} ${teacherData.teacher.teacher_name}`}
          />
          <InfoBlock
            icon={IconId}
            label="Designation"
            value={teacherData.teacher.teacher_designation}
          />
          <InfoBlock
            icon={IconMail}
            label="Email"
            value={teacherData.teacher.teacher_email_id}
          />
          <InfoBlock
            icon={IconCalendar}
            label="DOB"
            value={moment(teacherData.teacher.teacher_dob).format(
              "DD MMM, YYYY"
            )}
          />
          <InfoBlock
            icon={IconCalendar}
            label="DOJ"
            value={moment(teacherData?.teacher?.teacher_doj).format(
              "DD MMM, YYYY"
            )}
          />
          <InfoBlock
            icon={Phone}
            label="Phone"
            value={teacherData.teacher.teacher_mobile}
          />
        </div>

        {/* Bank & Other Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BankDetailsCard
            title="Bank Details"
            bgColor="bg-blue-50"
            fields={[
              {
                label: "Bank Name",
                value: teacherData.teacher.teacher_bank_name,
              },
              {
                label: "Account No",
                value: teacherData.teacher.teacher_acct_no,
              },
              { label: "IFSC", value: teacherData.teacher.teacher_ifsc },
              { label: "Branch", value: teacherData.teacher.teacher_branch },
            ]}
          />

          <BankDetailsCard
            title="Other Details"
            bgColor="bg-purple-50"
            fields={[
              { label: "PAN No", value: teacherData.teacher.teacher_pan_no },
              {
                label: "Aadhar No",
                value: teacherData.teacher.teacher_adhar_no,
              },
              { label: "PF No", value: teacherData.teacher.teacher_pf_no },
              { label: "UAN No", value: teacherData.teacher.teacher_uan_no },
            ]}
          />
        </div>
      </div>
    </Card>
  );
};

export default TeacherDetailsView;
