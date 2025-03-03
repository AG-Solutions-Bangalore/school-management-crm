import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import CrmLogo from "../../../assets/Companylogo/ppvn-logo.png";
import ReactToPrint from "react-to-print";
import { Printer, Download, ArrowLeft } from 'lucide-react';
import { ContextPanel } from '../../../context/ContextPanel';
import BASE_URL from '../../../base/BaseUrl';

import html2pdf from 'html2pdf.js';
import Layout from '../../../layout/Layout';
import LoaderComponent from '../../../components/common/LoaderComponent';

const StudentPrint = () => {
  const componentRef = useRef();
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { selectedYear } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [studentPhotoBase64, setStudentPhotoBase64] = useState("");
  const [error, setError] = useState(null);
  
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-student-view/${selectedYear || '2024-25'}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response?.data.student?.student_photo) {
        setLoading(true);
        setError("Letter head data is missing");
        return;
      }
      setStudentData(response.data.student);
    } catch (error) {
      console.error("Error fetching student data", error);
      setError("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [selectedYear, id]);

  useEffect(() => {
   if (!studentData?.student_photo) {
     setLoading(false);
     return;
   }
   
   const convertStudentPhotoToBase64 = async () => {
     try {
       // Use proxy URL for development
       const photoUrl = `/api/public/assets/student/${studentData?.student_photo}`;
       
       const response = await fetch(photoUrl);
       const blob = await response.blob();
       
       const reader = new FileReader();
       reader.onloadend = () => {
         setStudentPhotoBase64(reader.result);
       };
       reader.readAsDataURL(blob);
     } catch (error) {
       console.error("Error converting student photo to base64:", error);
       setError("Failed to load student photo");
     }
   };
   
   if (studentData?.student_photo) {
     convertStudentPhotoToBase64();
   }
  }, [studentData?.student_photo]);

  const handlePdf = () => {
    if (!studentPhotoBase64) {
      console.error("Student photo not yet loaded");
      setError("Please wait for the student photo to load");
      return;
    }
    
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
      margin: [5, 5,5, 5],
      filename: `${studentData?.student_name || 'Student'}_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true, 
        allowTaint: true,
        logging: true,
        letterRendering: true,
        proxy: '/api' 
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save();
  };
  
  return (
    <Layout>
      {loading ? (
       <LoaderComponent/>
      ) : error ? (
        <div className="mt-5 bg-white rounded-lg p-4 container mx-auto">
          <div className="text-red-600 p-4 rounded-md bg-red-100 mb-4">
            {error}
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to students list
          </button>
        </div>
      ) : (
        <div className="mt-5 bg-white rounded-lg p-4 container mx-auto">
     <div className="mb-4 flex items-center justify-between">
  {/* Back Button (Left) */}
  <button 
    onClick={() => navigate(-1)} 
    className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
  >
    <ArrowLeft size={16} className="mr-1" /> Back to students list
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
      documentTitle={`${studentData?.student_name || 'Student'}_Report`}
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
                          <h1 className="text-2xl font-bold text-gray-800">Student Information </h1>
                          <p className="text-sm text-gray-600">Academic Year: {studentData?.student_year || selectedYear}</p>
                        </div>
                      </div>
                      
                      <div className="mt-2 bg-white p-3 rounded-md shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800">{studentData?.student_name}</h2>
                        <div className="flex flex-wrap gap-x-4 mt-1">
                          <p className="text-sm bg-blue-50 px-2 py-1 rounded">Class : {studentData?.student_class || "N/A"}</p>
                          <p className="text-sm bg-gray-100 px-2 py-1 rounded">ID: {studentData?.student_admission_no || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-1/5 h-48 border border-gray-300 shadow-md overflow-hidden rounded-md">
                      {/* Use the base64 image if available, otherwise use the proxy URL */}
                      <img 
                        src={studentPhotoBase64 || `/api/public/assets/student/${studentData?.student_photo}`}
                        alt="Student Photo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="p-4">
                    {/* Personal Details with centered colons */}
                    <div className="mb-3">
                      <h3 className="text-base font-bold border-b border-gray-300 mb-2 pb-1">PERSONAL DETAILS</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                        <div className="flex items-center ">
                          <span className="font-medium w-32">Full Name</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_name || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Admission No</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_admission_no || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Class <span className='text-[10px]'>(when joined)</span></span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_class || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Gender</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_gender || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Date of Birth</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_dob ? moment(studentData.student_dob).format("DD-MM-YYYY") : "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Admission Date</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_admission_date ? moment(studentData.student_admission_date).format("DD-MM-YYYY") : "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Stats No</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_stats_no || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Primary No</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_primary_no || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Email ID</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_email || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Aadhar Number</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_adhar_no || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Category</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_category || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Caste</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_caste || "N/A"}</span>
                        </div>
                        <div className="flex items-center col-span-2">
                          <span className="font-medium w-32">Address</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_address || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Contact</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_contact || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">CC Number</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_cc_no || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Father Information with centered colons */}
                    <div className="mb-3">
                      <h3 className="text-base font-bold border-b border-gray-300 mb-2 pb-1">FATHER INFORMATION</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                        <div className="flex items-center">
                          <span className="font-medium w-32">Father's Name</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_father_name || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Mobile Number</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_father_mobile || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">PAN Number</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_father_pan_no || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Aadhar Number</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_father_adhar_no || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Mother Information with centered colons */}
                    <div className="mb-3">
                      <h3 className="text-base font-bold border-b border-gray-300 mb-2 pb-1">MOTHER INFORMATION</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                        <div className="flex items-center">
                          <span className="font-medium w-32">Mother's Name</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_mother_name || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Mobile Number</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_mother_mobile || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">PAN Number</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_mother_pan_no || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-32">Aadhar Number</span>
                          <span className="mx-2">:</span>
                          <span>{studentData?.student_mother_adhar_no || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Signature Section */}
                    <div className="mt-48 grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="mt-6 pt-2 border-t border-black w-28 mx-auto"></div>
                        <div className="font-medium">Parent/Guardian's Signature</div>
                        <div className="text-xs text-gray-900">({studentData?.student_father_name || "Parent"})</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="mt-6 pt-2 border-t border-black w-28 mx-auto"></div>
                        <div className="font-medium">Administrative Officer</div>
                        <div className="text-xs text-gray-900">(Office Seal)</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="mt-6 pt-2 border-t border-black w-28 mx-auto"></div>
                        <div className="font-medium">Principal</div>
                        <div className="text-xs text-gray-900">(School Authority)</div>
                      </div>
                    </div>

                    {/* Official Footer */}
                    <div className="mt-8 pt-2 border-t border-gray-300 text-xs">
                      <div className="grid grid-cols-3 text-center text-gray-900">
                        <div>REF: {studentData?.student_admission_no}/{moment().format("YYYY/MM")}</div>
                        <div>Generated on: {moment().format("DD-MM-YYYY")}</div>
                        <div>Page 1 of 1</div>
                      </div>
                      <div className="mt-1 text-center text-gray-500">
                        This document is computer generated. The information contained is official and confidential.
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

export default StudentPrint;