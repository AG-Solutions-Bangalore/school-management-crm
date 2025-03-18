import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import CrmLogo from "../../../assets/Companylogo/ppvn-logo.png";
import ReactToPrint from "react-to-print";
import { Printer, Download, ArrowLeft } from "lucide-react";
import { ContextPanel } from "../../../context/ContextPanel";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import LoaderComponent from "../../../components/common/LoaderComponent";
import html2pdf from "html2pdf.js";
import { TEACHER_VIEW_BY_ID } from "../../../components/common/UseApi";
import useApiToken from "../../../components/common/useApiToken";

const TeacherPrint = () => {
  const componentRef = useRef();
  const { id } = useParams();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { selectedYear } = useContext(ContextPanel);
  const navigate = useNavigate();
  const token = useApiToken();
  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const response = await TEACHER_VIEW_BY_ID(selectedYear, id, token);
      setTeacherData(response?.teacher);
    } catch (error) {
      console.error("Error fetching teacher data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [selectedYear, id]);
  const handlePdf = () => {
    const element = componentRef.current;

    const images = element.getElementsByTagName("img");
    let loadedImages = 0;

    if (images.length === 0) {
      generatePDF(element);
      return;
    }

    Array.from(images).forEach((img) => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === images.length) {
          generatePDF(element);
        }
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            generatePDF(element);
          }
        };
        img.onerror = () => {
          console.error(`Error loading image: ${img.src}`);
          loadedImages++;
          if (loadedImages === images.length) {
            generatePDF(element);
          }
        };
      }
    });
  };
  const generatePDF = (element) => {
    const opt = {
      margin: [5, 5, 5, 5],
      filename: `${teacherData?.teacher_name || "Teacher"}_Report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        letterRendering: true,
        // proxy: '/api'
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <Layout>
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-5 bg-white rounded-lg p-4 container mx-auto">
          <div className="mb-4 flex items-center justify-between">
            {/* Back Button (Left) */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to teachers list
            </button>

            {/* Buttons (Right) */}
            <div className="flex space-x-4">
              <ReactToPrint
                trigger={() => (
                  <button className="flex items-center text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">
                    <Printer className="mr-2" size={16} /> Print
                  </button>
                )}
                content={() => componentRef.current}
                documentTitle={`${
                  teacherData?.teacher_name || "Teacher"
                }_Report`}
              />
              <button
                onClick={handlePdf}
                className="flex items-center text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
              >
                <Download className="mr-2" size={16} /> Save as PDF
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="w-full">
              <div className="bg-white border border-gray-300">
                <div
                  ref={componentRef}
                  className="print-container flex flex-col w-full"
                >
                  {/* Improved Header with Logo */}
                  <div className="p-5 border-b w-full flex items-start gap-4 border-gray-300 bg-gray-50">
                    <div className="w-4/5 flex flex-col space-y-4">
                      <div className="flex items-center gap-4">
                        <img src={CrmLogo} alt="School Logo" className="h-16" />
                        <div className="border-l-2 border-gray-400 pl-4">
                          <h1 className="text-2xl font-bold text-gray-800">
                            Teacher Information{" "}
                          </h1>
                          <p className="text-sm text-gray-600">
                            Academic Year: {selectedYear}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 bg-white p-3 rounded-md shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800">
                          {teacherData?.teacher_title}{" "}
                          {teacherData?.teacher_name}
                        </h2>
                        <div className="flex flex-wrap gap-x-4 mt-1">
                          <p className="text-sm bg-blue-50 px-2 py-1 rounded">
                            {teacherData?.teacher_designation}
                          </p>
                          <p className="text-sm bg-gray-100 px-2 py-1 rounded">
                            ID: {teacherData?.teacher_ref}
                          </p>
                          <p className="text-sm bg-gray-100 px-2 py-1 rounded">
                            Qualification:{" "}
                            {teacherData?.teacher_qualification || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-1/5 h-48 border border-gray-300 shadow-md overflow-hidden rounded-md">
                      <img
                        src="https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Teacher Photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="p-4">
                    {/* Personal Details with centered colons */}
                    <div className="mb-3">
                      <h3 className="text-base font-bold border-b border-gray-300 mb-2 pb-1">
                        PERSONAL DETAILS
                      </h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                        <div className="flex items-center">
                          <span className="font-medium w-32">Full Name</span>
                          <span className="mx-2">:</span>
                          <span>
                            {teacherData?.teacher_title}{" "}
                            {teacherData?.teacher_name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Teacher ID</span>
                          <span className="mx-2">:</span>
                          <span>{teacherData?.teacher_ref || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Designation</span>
                          <span className="mx-2">:</span>
                          <span>
                            {teacherData?.teacher_designation || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">
                            Qualification
                          </span>
                          <span className="mx-2">:</span>
                          <span>
                            {teacherData?.teacher_qualification || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">
                            Date of Birth
                          </span>
                          <span className="mx-2">:</span>
                          <span>
                            {teacherData?.teacher_dob
                              ? moment(teacherData.teacher_dob).format(
                                  "DD-MM-YYYY"
                                )
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">
                            Date of Joining
                          </span>
                          <span className="mx-2">:</span>
                          <span>
                            {teacherData?.teacher_doj
                              ? moment(teacherData.teacher_doj).format(
                                  "DD-MM-YYYY"
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information with centered colons */}
                    <div className="mb-3">
                      <h3 className="text-base font-bold border-b border-gray-300 mb-2 pb-1">
                        CONTACT INFORMATION
                      </h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                        <div className="flex items-center">
                          <span className="font-medium w-32">Mobile</span>
                          <span className="mx-2">:</span>
                          <span>{teacherData?.teacher_mobile || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Email ID</span>
                          <span className="mx-2">:</span>
                          <span>{teacherData?.teacher_email_id || "N/A"}</span>
                        </div>
                        <div className="flex items-center col-span-2">
                          <span className="font-medium w-32">Address</span>
                          <span className="mx-2">:</span>
                          <span>{teacherData?.teacher_address || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Emergency No</span>
                          <span className="mx-2">:</span>
                          <span>
                            {teacherData?.teacher_emergency_no || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Identity Information with centered colons */}
                    <div className="mb-3">
                      <h3 className="text-base font-bold border-b border-gray-300 mb-2 pb-1">
                        IDENTITY INFORMATION
                      </h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                        <div className="flex items-center">
                          <span className="font-medium w-32">
                            Aadhar Number
                          </span>
                          <span className="mx-2">:</span>
                          <span>{teacherData?.teacher_adhar_no || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">PAN Number</span>
                          <span className="mx-2">:</span>
                          <span>{teacherData?.teacher_pan_no || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">PF Number</span>
                          <span className="mx-2">:</span>
                          <span>{teacherData?.teacher_pf_no || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">UAN Number</span>
                          <span className="mx-2">:</span>
                          <span>{teacherData?.teacher_uan_no || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bank Details with centered colons */}
                    <div className="mb-3">
                      <h3 className="text-base font-bold border-b border-gray-300 mb-2 pb-1">
                        BANK DETAILS
                      </h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center">
                          <span className="font-medium w-32">Bank Name</span>
                          <span className="mx-2">:</span>
                          <span>{teacherData?.teacher_bank_name || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Account No</span>
                          <span className="mx-2">:</span>
                          <span>{teacherData?.teacher_acct_no || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">IFSC Code</span>
                          <span className="mx-2">:</span>
                          <span>{teacherData?.teacher_ifsc || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Branch</span>
                          <span className="mx-2">:</span>
                          <span>{teacherData?.teacher_branch || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Signature Section */}
                    <div className="mt-48 grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="mt-6 pt-2 border-t border-black w-28 mx-auto"></div>
                        <div className="font-medium">Teacher's Signature</div>
                        <div className="text-xs text-gray-900">
                          ({teacherData?.teacher_name})
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="mt-6 pt-2 border-t border-black w-28 mx-auto"></div>
                        <div className="font-medium">
                          Administrative Officer
                        </div>
                        <div className="text-xs text-gray-900">
                          (Office Seal)
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="mt-6 pt-2 border-t border-black w-28 mx-auto"></div>
                        <div className="font-medium">Principal</div>
                        <div className="text-xs text-gray-900">
                          (School Authority)
                        </div>
                      </div>
                    </div>

                    {/* Official Footer */}
                    <div className="mt-8 pt-2 border-t border-gray-300 text-xs">
                      <div className="grid grid-cols-3 text-center text-gray-900">
                        <div>
                          REF: {teacherData?.teacher_ref}/
                          {moment().format("YYYY/MM")}
                        </div>
                        <div>Generated on: {moment().format("DD-MM-YYYY")}</div>
                        <div>Page 1 of 1</div>
                      </div>
                      <div className="mt-1 text-center text-gray-500">
                        This document is computer generated. The information
                        contained is official and confidential.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TeacherPrint;
