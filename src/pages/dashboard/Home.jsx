import React, { useContext, useEffect, useState } from "react";
import { FileText, Users, Briefcase, Download } from "lucide-react";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import { ContextPanel } from "../../context/ContextPanel";
import ReactApexChart from "react-apexcharts";
import LoaderComponent from "../../components/common/LoaderComponent";
import { fetchDashboard } from "../../components/common/UseApi";

const StatCard = ({ title, value, icon: Icon, color = "yellow" }) => (
  <div className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-600 font-medium text-sm md:text-base">
        {title}
      </h3>
      <Icon className={`h-6 w-6 text-${color}-500`} />
    </div>
    <div className="mt-2">
      <p className="text-2xl md:text-3xl font-bold text-gray-800">
        {value || 0}
      </p>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
  </div>
);

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const { selectedYear } = useContext(ContextPanel);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetchDashboard(selectedYear);

        setDashboardData(response);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setErrorMessage(err.message || "Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedYear]);

  if (errorMessage) {
    return (
      <Layout>
        <div className="p-6 text-center">
          <div className="bg-red-100 p-4 rounded-lg text-red-800">
            <p className="font-medium">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const allClasses = [
    "NURSERY",
    "LKG",
    "UKG",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
  ];

  const chartData = allClasses.map((className) => {
    const classData = dashboardData?.graph1?.find(
      (item) => item.studentClass_class === className
    );
    const totalCount = classData ? classData.total_count : 0;
    const pendingCount = classData ? classData.pending_count : 0;
    const nonPendingCount = totalCount - pendingCount;

    return {
      studentClass_class: className,
      total_count: totalCount,
      pending_count: pendingCount,
      non_pending_count: nonPendingCount,
    };
  });

  const chartSeries = [
    {
      name: "Pending Students",
      data: chartData.map((item) => item.pending_count),
      color: "#E63946",
    },
    {
      name: "Total Students",
      data: chartData.map((item) => item.total_count),
      color: "#2A9D8F",
    },
  ];

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
        export: {
          svg: {
            filename: "pendingFees-chart",
          },
          png: {
            filename: "pendingFees-chart",
          },
          csv: {
            filename: "pendingFees-data",
            columnDelimiter: ",",
            headerCategory: "Class",
            headerValue: "Value",
          },
        },
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        if (opts.seriesIndex === 0) {
          return val;
        }
        if (opts.seriesIndex === 1) {
          const dataPointIndex = opts.dataPointIndex;
          return chartData[dataPointIndex].total_count;
        }
        return "";
      },
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#fff", "#fff"],
      },
      offsetY: -5,
    },
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
    xaxis: {
      categories: chartData.map((item) => item.studentClass_class),
      title: {
        text: "Classes",
        style: {
          fontSize: "14px",
          fontWeight: 600,
          cssClass: "apexcharts-xaxis-title",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      title: {
        text: "Number of Students",
        style: {
          fontSize: "14px",
          fontWeight: 600,
          cssClass: "apexcharts-yaxis-title",
        },
      },
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      followCursor: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const className = w.globals.labels[dataPointIndex];
        const pendingCount = chartData[dataPointIndex].pending_count;
        const totalCount = chartData[dataPointIndex].total_count;
        const activeCount = chartData[dataPointIndex].non_pending_count;

        return `
          <div class="apexcharts-tooltip-title" style="font-weight: bold; padding: 6px 10px; background: #f8f9fa; border-bottom: 1px solid #ddd;">
            Class: ${className}
          </div>
          <div style="padding: 8px 10px;">
           
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-weight: 500; color: #555; display: flex; align-items: center;">
                <span style="width: 10px; height: 10px; background: #2A9D8F; display: inline-block; margin-right: 5px; border-radius: 50%;"></span>
                Total Students:
              </span>
              <span style="font-weight: 600; color: #2A9D8F;">${totalCount}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 500; color: #555; display: flex; align-items: center;">
                <span style="width: 10px; height: 10px; background: #E63946; display: inline-block; margin-right: 5px; border-radius: 50%;"></span>
                Pending Students:
              </span>
              <span style="font-weight: 600; color: #E63946;">${pendingCount}</span>
            </div>
          </div>
        `;
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      offsetY: 10,
      fontSize: "14px",
      fontWeight: 500,
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        strokeColor: "#fff",
        fillColors: ["#E63946", "#2A9D8F"],
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
      onItemClick: {
        toggleDataSeries: false,
      },
      onItemHover: {
        highlightDataSeries: false,
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10,
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.9,
        },
      },
      active: {
        filter: {
          type: "darken",
          value: 0.85,
        },
      },
    },
    title: {
      text: "Pending Fees by Class",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#263238",
      },
    },
  };

  return (
    <Layout>
      <div className="p-4 bg-white rounded-lg md:p-6 shadow-md">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
          Dashboard Overview
        </h1>

        {isLoading ? (
          <LoaderComponent />
        ) : (
          <>
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Total Students"
                value={dashboardData?.allstudentCount}
                icon={Users}
              />
              <StatCard
                title="Current Students"
                value={dashboardData?.currentstudentCount}
                icon={FileText}
                color="blue"
              />
              <StatCard
                title="Total Teachers"
                value={dashboardData?.allteacherCount}
                icon={Briefcase}
                color="green"
              />
            </div>

            <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Pending Fees{" "}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Academic Year: {selectedYear}
                  </span>
                </div>
              </div>
              <div className="h-96">
                <ReactApexChart
                  options={chartOptions}
                  series={chartSeries}
                  type="bar"
                  height="100%"
                  width="98%"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
