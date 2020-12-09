import React, { Component } from "react";
import axios from "axios";

class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      airspeed: 0,
      alpha: 2,
      altitude: null,
      beta: 0,
      density: 1.225,
      mach: null,
      rate_P: 0,
      rate_Q: 0,
      rate_R: 0,
      errormessage: "",
      exampleslist: [],
      selectedFile: null,
      aircraftTemplate: null,
      stateTemplate: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  componentDidMount() {
    this.findAircraftTemplate();
    this.findStateTemplate();
  }

  findAircraftTemplate = () => {
    axios
      .get("http://localhost:8080/pytronado/aircraft_template")
      .then((response) => {
        this.setState({
          aircraftTemplate: response.data,
        });
      });
  };

  findStateTemplate = () => {
    axios.get("http://localhost:8080/pytronado/state").then((response) => {
      this.setState({
        airspeed: response.data.aero.airspeed,
        alpha: response.data.aero.alpha,
        altitude: response.data.aero.altitude,
        beta: response.data.aero.beta,
        density: response.data.aero.density,
        mach: response.data.aero.mach,
        rate_P: response.data.aero.rate_P,
        rate_Q: response.data.aero.rate_Q,
        rate_R: response.data.aero.rate_R,
      }),
        console.log("StateHHHHHH", response.data.aero.airspeed);
    });
  };

  handleChange(event) {
    const { target } = event;
    const val =
      target.type === "checkbox" ? target.checked : parseFloat(target.value);
    const { name } = target;
    let err = "";
    if (val !== "" && !Number(val)) {
      err = <strong>Input must be a number</strong>;
    }
    this.setState({
      [name]: val,
      errormessage: err,
    });
    console.log("HHHH", name, "HHHHH", val);
  }

  validateFile(file) {
    const acceptedFileExtensions = ["json"];
    try {
      const fileName = file.name.substring(file.name.lastIndexOf(".") + 1);

      if (!acceptedFileExtensions.includes(fileName)) {
        this.setState({
          errormessage: "Wrong file format! Please, choose .json file.",
        });
        return false;
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  handleFileChange(event) {
    const file = event.target.files[0];
    if (this.validateFile(file)) {
      try {
        this.setState({
          errormessage: "",
          selectedFile: file,
        });
      } catch (error) {
        this.setState({
          errormessage: "Something went wrong! Please, try again.",
        });
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const aerojson = {
      aero: {
        airspeed: this.state.airspeed,
        alpha: this.state.alpha,
        altitude: this.state.altitude,
        beta: this.state.beta,
        density: this.state.density,
        mach: this.state.mach,
        rate_P: this.state.rate_P,
        rate_Q: this.state.rate_Q,
        rate_R: this.state.rate_R,
      },
    };

    const json = JSON.stringify(aerojson);
    const template = new Blob([json], {
      type: "application/json",
    });

    const aircraftJson = JSON.stringify(this.state.aircraftTemplate);
    const aircraftT = new Blob([aircraftJson], {
      type: "application/json",
    });

    const formData = new FormData();
    formData.append("state", template);
    if (this.state.selectedFile !== null) {
      formData.append("aircraft", this.state.selectedFile);
    } else {
      formData.append("aircraft", aircraftT);
    }
    axios
      .post("http://localhost:8080/pytronado/upload", formData)
      .then((response) => console.log("responseHHHHHH", response));
  }

  resetInput() {
    document.getElementById("settingsForm").reset();
  }

  createProject = () => {
    axios.get("http://localhost:8080/pytronado/settings");
  };

  listExamplesInDB = () => {
    axios
      .get("http://localhost:8080/pytronado/exampleslist")
      .then((response) => {
        console.log(response);
        this.setState({
          exampleslist: response.data,
        });
      });
  };

  render() {
    return (
      <div className="shadow-lg flex flex-col-reverse sm:flex-row">
        <div className="w-full bg-white p-4 border-4 border-blue-500">
          <div className="text-white bg-blue-500 ">
            <h1 className="text-3xl">Input Files</h1>
          </div>

          <form id="settingsForm">
            <div className="mt-3">
              <span className="flex bg-gray-100 items-center px-3 my-5">
                <label className="w-1/2 text-left text-gray-600 text-m font-semibold mb-2 uppercase">
                  airspeed
                </label>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="bg-gray-100 p-2 w-full"
                  name="airspeed"
                  value={this.state.value}
                  placeholder={this.state.airspeed}
                  onChange={this.handleChange}
                />
              </span>
              <span className="flex bg-gray-100 items-center px-3 my-5">
                <label className="w-1/2 text-left text-gray-600 text-m font-semibold mb-2 uppercase">
                  alpha
                </label>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="bg-gray-100 p-2 w-full"
                  name="alpha"
                  value={this.state.value}
                  placeholder={this.state.alpha}
                  onChange={this.handleChange}
                />
              </span>
              <span className="flex bg-gray-100 items-center px-3 my-5">
                <label className="w-1/2 text-left text-gray-600 text-m font-semibold mb-2 uppercase">
                  altitude
                </label>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="bg-gray-100 p-2 w-full"
                  name="altitude"
                  value={this.state.value}
                  placeholder={this.state.altitude}
                  onChange={this.handleChange}
                />
              </span>
              <span className="flex bg-gray-100 items-center px-3 my-5">
                <label className="w-1/2 text-left text-gray-600 text-m font-semibold mb-2 uppercase">
                  beta
                </label>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="bg-gray-100 p-2 w-full"
                  name="beta"
                  value={this.state.value}
                  placeholder={this.state.beta}
                  onChange={this.handleChange}
                />
              </span>
              <span className="flex bg-gray-100 items-center px-3 my-5">
                <label className="w-1/2 text-left text-gray-600 text-m font-semibold mb-2 uppercase">
                  density
                </label>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="bg-gray-100 p-2 w-full"
                  name="density"
                  value={this.state.value}
                  placeholder={this.state.density}
                  onChange={this.handleChange}
                />
              </span>
              <span className="flex bg-gray-100 items-center px-3 my-5">
                <label className="w-1/2 text-left text-gray-600 text-m font-semibold mb-2 uppercase">
                  mach
                </label>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="bg-gray-100 p-2 w-full"
                  name="mach"
                  value={this.state.value}
                  placeholder={this.state.mach}
                  onChange={this.handleChange}
                />
              </span>
              <span className="flex bg-gray-100 items-center px-3 my-5">
                <label className="w-1/2 text-left text-gray-600 text-m font-semibold mb-2 uppercase">
                  rate_P
                </label>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="bg-gray-100 p-2 w-full"
                  name="rate_P"
                  value={this.state.value}
                  placeholder={this.state.rate_P}
                  onChange={this.handleChange}
                />
              </span>
              <span className="flex bg-gray-100 items-center px-3 my-5">
                <label className="w-1/2 text-left text-gray-600 text-m font-semibold mb-2 uppercase">
                  rate_Q
                </label>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="bg-gray-100 p-2 w-full"
                  name="rate_Q"
                  value={this.state.value}
                  placeholder={this.state.rate_Q}
                  onChange={this.handleChange}
                />
              </span>
              <span className="flex bg-gray-100 items-center px-3 my-5">
                <label className="w-1/2 text-left text-gray-600 text-m font-semibold mb-2 uppercase">
                  rate_R
                </label>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="bg-gray-100 p-2 w-full"
                  name="rate_R"
                  value={this.state.value}
                  placeholder={this.state.rate_R}
                  onChange={this.handleChange}
                />
              </span>

              <span className="flex bg-gray-100 items-center px-3 my-5">
                <label className=" w-1/2 text-left text-gray-600 text-m font-semibold mb-2">
                  Aircraft
                </label>
                <input
                  className="bg-gray-100 p-2 w-full"
                  type="file"
                  onChange={this.handleFileChange}
                />
              </span>
              <span className="flex bg-gray-100 items-center px-3 my-5">
                <label className=" w-full h-8 text-left text-red-600 text-m font-semibold mb-2">
                  {this.state.errormessage}
                </label>
              </span>
            </div>

            <div className="flex justify-between items-center mt-4 mx-5">
              <button
                className="bg-blue-500 hover:bg-blue-400 px-4 py-2 text-white text-xl"
                type="submit"
                onClick={this.handleSubmit}
              >
                Submit
              </button>

              <button className="bg-blue-500 hover:bg-blue-400 px-4 py-2 text-white text-xl">
                Reset
              </button>
            </div>
          </form>
        </div>
        <div className="w-full bg-blue-500 p-4 text-white text-center flex flex-col justify-center ">
          <h1 className=" text-white text-3xl pb-10 ">Start a VLM analysis</h1>
          <button className="bg-blue-700 mx-auto hover:bg-blue-600 mt-6 text-white text-xl px-4 py-6 w-3/5">
            Creating a template project
          </button>
          <button
            className="bg-blue-700 mx-auto hover:bg-blue-600 mt-6 text-white text-xl px-4 py-6 w-3/5"
            onClick={this.listExamplesInDB}
          >
            List example
          </button>
          <button
            className="bg-blue-700 mx-auto hover:bg-blue-600 mt-6 text-white text-xl px-4 py-6 w-3/5"
            onClick={this.createProject}
          >
            Settings file
          </button>
        </div>
        <div className="w-full bg-white p-4 border-4 border-blue-500">
          {this.state.exampleslist.map((txt) => (
            <p
              key={txt.value}
              className="text-left text-gray-600 text-xl font-semibold my-4"
            >
              {txt}
            </p>
          ))}
        </div>
      </div>
    );
  }
}

export default Panel;

/* function Parameters(this) {
  return (
    <span className="flex bg-gray-100 items-center px-3 my-5">
      <label className="w-1/2 text-left text-gray-600 text-m font-semibold mb-2 uppercase">
        {this.name}
      </label>
      <input
        className="bg-gray-100 p-2 w-full"
        name={this.name}
        value={this.state.value}
        type="text"
        onChange={this.handleChange}
      />
    </span>
  );
}
 */
/* const parameterList = [
  { id: 1, name: "airspeed" },
  { id: 2, name: "alpha" },
  { id: 3, name: "altitude" },
  { id: 4, name: "beta" },
  { id: 5, name: "density" },
  { id: 6, name: "mach" },
  { id: 7, name: "rate_P" },
  { id: 8, name: "rate_Q" },
  { id: 9, name: "rate_R" },
]; */
