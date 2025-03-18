import { Card, CardBody } from "@material-tailwind/react";
import { IconArrowBack, IconSchool, IconUser } from "@tabler/icons-react";
import { Phone } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { decryptId } from "../../../components/common/EncryptionDecryption";
import { TEACHER_VIEW_BY_ID } from "../../../components/common/UseApi";
import { ContextPanel } from "../../../context/ContextPanel";
import Layout from "../../../layout/Layout";
import TeacherDetailsView from "./TeacherDetailsView";
import TeacherSubList from "./TeacherSubList";
import useApiToken from "../../../components/common/useApiToken";

const TeacherView = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { selectedYear } = useContext(ContextPanel);
  const navigate = useNavigate();
  const token = useApiToken();
  const fetchStudentData = async () => {
    setLoading(true);
    const response = await TEACHER_VIEW_BY_ID(selectedYear, decryptedId, token);

    setTeacherData(response);

    setLoading(false);
  };

  useEffect(() => {
    fetchStudentData();
  }, [decryptedId, selectedYear]);

  return (
    <Layout>
      <div className="max-w-screen p-2">
        <Card className="mb-2 overflow-hidden">
          <CardBody className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="bg-blue-50 p-4 md:w-1/3">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-lg font-medium text-blue-900 border-b-2 border-blue-500 pb-1 flex">
                    <IconArrowBack
                      className="text-red-500 cursor-pointer"
                      onClick={() => navigate("/teacher-list")}
                    />{" "}
                    Teacher Details
                  </h1>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <IconUser className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Teacher No: {teacherData?.teacher?.teacher_no}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconSchool className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Ref: {teacherData?.teacher?.teacher_ref}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Emergency No: {teacherData?.teacher?.teacher_emergency_no}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <span className="text-xs text-gray-700 block">
                      Qualification
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {teacherData?.teacher?.teacher_qualification}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <span className="text-xs text-gray-700 block">
                      Academic Year
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {teacherData?.teacher?.teacher_year}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <span className="text-xs text-gray-700 block">Status</span>
                    <span
                      className={`text-sm font-medium ${
                        teacherData?.teacher?.teacher_status === "Active"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {teacherData?.teacher?.teacher_status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2 text-center col-span-2 md:col-span-3">
                    <span className="text-xs text-gray-700 block">
                      {" "}
                      Address
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      {/* <IconHome className="w-4 h-4 text-blue-600" /> */}
                      <span className="text-sm font-medium text-gray-800">
                        {teacherData?.teacher.teacher_address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <TeacherDetailsView teacherData={teacherData} />
        <TeacherSubList
          teacherData={teacherData}
          fetchStudentData={fetchStudentData}
        />
      </div>
    </Layout>
  );
};

export default TeacherView;
