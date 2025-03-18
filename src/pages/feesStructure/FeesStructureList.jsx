import { Book, Calculator } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CreateButton } from "../../components/common/ButttonConfig";
import LoaderComponent from "../../components/common/LoaderComponent";
import { FEES_STUCTURE } from "../../components/common/UseApi";
import useApiToken from "../../components/common/useApiToken";
import Layout from "../../layout/Layout";

const FeesStructureList = () => {
  const [feesStructureData, setFeesStructureData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const token = useApiToken();

  const fetchFeesStructureData = async () => {
    setLoading(true);
    const fees = await FEES_STUCTURE(token);
    setFeesStructureData(fees.feeStructure || []);
    setLoading(false);
  };
  useEffect(() => {
    fetchFeesStructureData();
  }, []);
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 ">
        <div className="mx-auto w-full">
          <div className="mb-4 rounded-xl bg-white p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  School Fees Structure
                </h1>
              </div>
            </div>
          </div>

          <div className="mb-6 flex space-x-4 ">
            <button
              onClick={() => setActiveTab("basic")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-color w-[11.1rem] ${
                activeTab === "basic"
                  ? `${CreateButton}`
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Calculator className="h-4 w-4" />
              Basic Fees
            </button>
            <button
              onClick={() => setActiveTab("additional")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors  w-[11.1rem] ${
                activeTab === "additional"
                  ? `${CreateButton}`
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Book className="h-4 w-4" />
              Additional Fees
            </button>
          </div>

          {/* Table Sections */}
          <div className="space-y-6">
            {loading ? (
              <LoaderComponent />
            ) : (
              <>
                {/* Basic Fees Table */}
                <div className={activeTab === "basic" ? "block" : "hidden"}>
                  <div className="rounded-xl bg-white shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max table-auto text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Class
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Tuition Fee
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Application Fee
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Admin Fee
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Library
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Reading Room
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Printing
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Test Exam
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {feesStructureData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border-b p-4 font-medium text-gray-900">
                                {row.className}
                              </td>
                              <td className="border-b p-4">{row.tuitionFee}</td>
                              <td className="border-b p-4">{row.applnfee}</td>
                              <td className="border-b p-4">{row.admnfee}</td>
                              <td className="border-b p-4">{row.library}</td>
                              <td className="border-b p-4">
                                {row.readingRoom}
                              </td>
                              <td className="border-b p-4">
                                {row.printingStationary}
                              </td>
                              <td className="border-b p-4">
                                {row.testExamination}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Additional Fees Table */}
                <div
                  className={activeTab === "additional" ? "block" : "hidden"}
                >
                  <div className="rounded-xl bg-white shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max table-auto text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Class
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              SWFTWF
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              RR
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              C.A.
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Medical
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Lab
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              CDF
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Building Fund
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              SWF
                            </th>
                            <th className="border-b p-4 text-left font-semibold text-gray-900">
                              Grand Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {feesStructureData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border-b p-4 font-medium text-gray-900">
                                {row.className}
                              </td>
                              <td className="border-b p-4">{row.SWFTWF}</td>
                              <td className="border-b p-4">{row.RR}</td>
                              <td className="border-b p-4">
                                {row.cilturalActivities}
                              </td>
                              <td className="border-b p-4">{row.medical}</td>
                              <td className="border-b p-4">{row.lab}</td>
                              <td className="border-b p-4">{row.cdf}</td>
                              <td className="border-b p-4">
                                {row.buildingFund}
                              </td>
                              <td className="border-b p-4">{row.swf}</td>
                              <td className="border-b p-4 font-semibold text-blue-600">
                                {row.grandTotal}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeesStructureList;
