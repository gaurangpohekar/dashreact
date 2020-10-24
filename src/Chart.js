import React from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import { MenuItem, Select, FormControl, Typography } from "@material-ui/core";
import "./Chart.css";
class Chart extends React.Component {
  state = {
    airdata: [],
    serdata: "NO2",
    charttype: "line",
    seriesNO2: [],
    seriesNMHC: [],
    seriesNOx: [],
    options: {
      chart: {
        id: "area-datetime",
        type: "area",
        height: 350,
        zoom: {
          autoScaleYaxis: true,
        },
      },
      annotations: {
        yaxis: [
          {
            y: 100,
            borderColor: "#999",
            label: {
              show: true,
              text: "Support",
              style: {
                color: "#fff",
                background: "#00E396",
              },
            },
          },
        ],
        xaxis: [
          {
            borderColor: "#999",
            yAxisIndex: 0,
            label: {
              show: true,
              text: "Rally",
              style: {
                color: "#fff",
                background: "#775DD0",
              },
            },
          },
        ],
      },
      dataLabels: {
        enabled: false,
      },

      markers: {
        size: 0,
        style: "hollow",
      },
      xaxis: {
        type: "datetime",

        tickAmount: 6,
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
    },
  };

  componentDidMount = () => {
    this.getAirData();
  };

  getAirData = () => {
    axios
      .get("https://airqualitydashboard.herokuapp.com/")
      .then((response) => {
        const data = response.data;
        this.setState({ ...this.state, airdata: data });

        this.formatdataNO2(data);
        this.formatdataNMHC(data);
        this.formatdataNOx(data);
        console.log("data received");
      })
      .catch(() => {
        alert("error");
      });
  };

  totimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum;
  };
  totime = (strDate) => {
    var res1 = strDate.slice(0, 2);
    var res2 = strDate.slice(3, 5);
    var res3 = strDate.slice(6, 7);
    var res4 = res1 + ":" + res2 + ":" + res3 + "0";
    return res4;
  };
  todate = (strDate) => {
    var chunks = strDate.split("/");
    var formated = chunks[1] + "/" + chunks[0] + "/" + chunks[2];
    return formated;
  };
  displayAirData = (airdata) => {
    if (!airdata.length) return null;

    return airdata.map((airdata, index) =>
      console.log(
        airdata.Date +
          " " +
          airdata.Time +
          " " +
          this.totimestamp(
            this.todate(airdata.Date) + " " + this.totime(airdata.Time)
          )
      )
    );
  };
  formatdataNMHC = (airdata) => {
    const data = airdata.map((airdata, index) => [
      this.totimestamp(this.todate(airdata.Date), this.totime(airdata.Time)),
      airdata.NMHC,
    ]);
    console.log(data);

    this.setState({ ...this.state, seriesNMHC: [{ data: data }] });
  };
  formatdataNO2 = (airdata) => {
    const data = airdata.map((airdata, index) => [
      this.totimestamp(this.todate(airdata.Date), this.totime(airdata.Time)),
      airdata.NO2,
    ]);
    console.log(data);

    this.setState({ ...this.state, seriesNO2: [{ data: data }] });
  };
  formatdataNOx = (airdata) => {
    const data = airdata.map((airdata, index) => [
      this.totimestamp(this.todate(airdata.Date), this.totime(airdata.Time)),
      airdata.NOx,
    ]);
    console.log(data);

    this.setState({ ...this.state, seriesNOx: [{ data: data }] });
  };
  serrender = (str) => {
    if (str === "NO2") {
      return this.state.seriesNO2;
    } else if (str === "NOx") {
      return this.state.seriesNOx;
    } else {
      return this.state.seriesNMHC;
    }
  };
  onSerChange = (event) => {
    const ser = event.target.value;
    this.setState({ ...this.state, serdata: ser });
    console.log("ser", ser);
  };

  render() {
    return (
      <div>
        <div>
          <h1 className="chart_texthead">AIR QUALITY ANALYSIS</h1>
          <div className="empty"></div>
          <FormControl className="dropdown_button">
            <Typography variant="button" color="textPrimary">
              SELECT GAS
            </Typography>
            <Select
              className="dropdown"
              variant="outlined"
              onChange={this.onSerChange}
              value={this.state.serdata}
            >
              <MenuItem value="NO2">NO2</MenuItem>
              <MenuItem value="NOx">NOx</MenuItem>
              <MenuItem value="NMHC">NMHC</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="empty"></div>
        {this.displayAirData}
        <h1 className="chart_head">BAR CHART</h1>
        <ReactApexChart
          options={this.state.options}
          series={this.serrender(this.state.serdata)}
          type="bar"
          height={600}
          width={1150}
        />
        <div className="empty"></div>
        <h1 className="chart_head">LINE CHART</h1>
        <ReactApexChart
          options={this.state.options}
          series={this.serrender(this.state.serdata)}
          type={this.state.charttype}
          height={600}
          width={1150}
        />
        <div className="empty"></div>
        <h1 className="chart_head">AREA CHART</h1>
        <ReactApexChart
          options={this.state.options}
          series={this.serrender(this.state.serdata)}
          type="area"
          height={600}
          width={1150}
        />
      </div>
    );
  }
}
export default Chart;
