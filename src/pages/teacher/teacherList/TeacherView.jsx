import React, { useContext, useEffect, useState } from "react";
import {
  IconUser,
  IconCalendar,
  IconSchool,
  IconHome,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import { Card, CardBody } from "@material-tailwind/react";
import { ContextPanel } from "../../../context/ContextPanel";
import TeacherDetailsView from "./TeacherDetailsView";
import { Phone } from "lucide-react";
import { IconArrowBack } from "@tabler/icons-react";
import TeacherSubList from "./TeacherSubList";

const TeacherView = () => {
  const { id } = useParams();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { selectedYear } = useContext(ContextPanel);
  const navigate = useNavigate();

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-teacher-view/${selectedYear}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeacherData(response.data);
    } catch (error) {
      console.error("Error fetching student data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id, selectedYear]);

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
