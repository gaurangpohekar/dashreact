import React from "react";
import MaterialTable from "material-table";
import axios from "axios";

class Table extends React.Component {
  state = {
    airdata: [],
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

        console.log("data received");
      })
      .catch(() => {
        alert("error");
      });
  };

  render() {
    return (
      <div>
        <MaterialTable
          title="Air Quality Table"
          data={this.state.airdata}
          columns={[
            { title: "Date", field: "Date" },
            { title: "Time", field: "Time" },
            { title: "NO2", field: "NO2" },
            { title: "NOx", field: "NOx" },
            { title: "NMHC", field: "NMHC" },
          ]}
          options={
            ({
              exportButton: true,
            },
            {
              filtering: true,
            },
            {
              grouping: true,
            })
          }
        />
      </div>
    );
  }
}
export default Table;
