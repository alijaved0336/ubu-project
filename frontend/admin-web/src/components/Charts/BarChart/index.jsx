import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController,
} from "chart.js";
import PropTypes from "prop-types";
import { Card, Skeleton, Spin } from "antd";
import { useEffect } from "react";
import cn from "@src/cn";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController
);
const BarChart = ({ data, isLoading, year }) => {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const BarChartdata = {
    labels,
    datasets: [
      {
        label: `Year : ${year}`,
        data: data,
        backgroundColor: ["#000000", "#FFB442", "#DFE5EC"],
        borderColor: ["#000000", "#FFB442", "#DFE5EC"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false, // This lets you control height independently
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Yearly Sales Data",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
        },
        grid: {
          display: true,
        },
      },
    },
  };
  return (
    <div className="tw-h-full">
      <Card
        title={<span className="tw-font-semibold">Yearly sales Report</span>}
        className="tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-200 tw-h-full"
      >
        <div className="tw-relative">
          {isLoading && (
            <Spin className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center" />
          )}
          <Bar
            className={cn("tw-w-full tw-min-h-[275px]", {
              "tw-opacity-50": isLoading,
            })}
            data={BarChartdata}
            options={options}
          />
        </div>
      </Card>
    </div>
  );
};

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month_year: PropTypes.string.isRequired,
      total_ad_fees: PropTypes.number,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  year: PropTypes.string,
};

export default BarChart;
