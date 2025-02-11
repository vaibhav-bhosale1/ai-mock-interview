import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceBarChart = ({ feedbackList = [] }) => {
  if (!Array.isArray(feedbackList) || feedbackList.length === 0) {
    return <p>No feedback data available.</p>;
  }

  const labels = feedbackList.map((_, index) => `Q${index + 1}`);
  const data = {
    labels,
    datasets: [
      {
        label: "Question Rating",
        data: feedbackList.map(item => Number(item.rating) || 0),
        backgroundColor: feedbackList.map(item =>
          Number(item.rating) >= 7 ? "green" : Number(item.rating) >= 4 ? "orange" : "red"
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Performance per Question" },
    },
    scales: {
      y: { beginAtZero: true, max: 10 },
    },
  };

  return <Bar data={data} options={options} />;
};

export default PerformanceBarChart;
