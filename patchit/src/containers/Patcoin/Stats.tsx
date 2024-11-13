import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from "react-chartjs-2";

//types & css
import "./patcoinwallet.css";
import { charttype } from './types';

function Stats() {

  //states
  const [chartType, setChartType] = useState<charttype>("bar");

  //handlers
  const handleActiveChart: (chart: charttype) => void = (chart) => {
    const activeChart = document.getElementById(chartType);
    if (activeChart) {
      activeChart.classList.remove("blue-text");
    }

    const newActiveChart = document.getElementById(chart);
    setChartType(chart);
    if (newActiveChart) {
      newActiveChart.classList.add("blue-text")
    }
  }

  useEffect(() => {
    handleActiveChart("bar");
  }, [])

  return (
    <>
      <div className="wallettranxhead">
        Stats
        <div className="wallettranxheadactions">
          <i className="material-icons wallettranxheadicns" id="pie" onClick={() => handleActiveChart("pie")}>
            pie_chart
          </i>
          <i className="material-icons wallettranxheadicns" id="line" onClick={() => handleActiveChart("line")}>
            multiline_chart
          </i>
          <i className="material-icons wallettranxheadicns" id="bar" onClick={() => handleActiveChart("bar")}>
            insert_chart
          </i>
          <i className="material-icons wallettranxheadicns" id="bubble" onClick={() => handleActiveChart("bubble")}>
            bubble_chart
          </i>
        </div>
      </div>
      <div className="wallettranxbody">
      </div>
    </>
  )
}

export default Stats;