import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { ListGroup, ListGroupItem, Collapse, CardBody, Card, Button, CardTitle, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import L from 'leaflet';

// import { ReactChartkick, LineChart, PieChart, ColumnChart, BarChart, AreaChart } from 'react-chartkick';
// import Chart from 'chart.js';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadialBar, RadialBarChart, BarChart, Bar
} from 'recharts';


import './App.css';

var myIcon = L.icon({
  iconUrl: 'https://cdn4.iconfinder.com/data/icons/location-flat/64/Location-map-pin-marker-favorite-place-256.png',
  iconSize: [40, 45],
  iconAnchor: [12.5, 41],
  popupAnchor: [7, -41],
});
var myAddIcon = L.icon({
  iconUrl: 'https://cdn3.iconfinder.com/data/icons/maps-and-location-6/16/16_pin-map-location-navigation-plus-256.png',
  iconSize: [50, 55],
  iconAnchor: [12.5, 41],
  popupAnchor: [7, -41],
});

const data = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400,
    "amt": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398,
    "amt": 2210
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800,
    "amt": 2290
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908,
    "amt": 2000
  },
  {
    "name": "Page E",
    "uv": 1890,
    "pv": 4800,
    "amt": 2181
  },
  {
    "name": "Page F",
    "uv": 2390,
    "pv": 3800,
    "amt": 2500
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  }
]

class App extends Component {
  state = {
    location: {
      lat: 39.690280594818034,
      lng: 34.94750976562501
    },
    haveUserLocation: false,
    zoom: 6.5,
    formVisible: false,
    chartVisible: false,
    radialChartVisible: false,
    barChartVisible: false,
    dataDayVisible: false,
    data1hVisible: false,
    lineChartVisible: true,
    UpdateformVisible: false,
    chartButtonid: "Radial Chart",
    collapse: false,
    stations: [],
    data_1h: [],
    data_1h_time: [],
    data_1h_temperature: [],
    data_1h_felttemperature: [],
    data_1h_windspeed: [],
    data_1h_precipitation_probability: [],
    data_1hchart: [],
    data_day: [],
    data_day_time: [],
    data_day_temperature_max: [],
    data_day_temperature_min: [],
    data_day_precipitation_probability: [],
    data_day_precipitation: [],
    data_day_windspeed_max: [],
    data_day_windspeed_min: [],
    data_day_windspeed_mean: [],
    data_day_relativehumidity_max: [],
    data_day_relativehumidity_min: [],
    data_day_relativehumidity_mean: [],
    data_daychart: [],
    name: '',
    city_name: '',
    searchs: [],
    city_id: '',



  }
  componentDidMount = async () => {

    await axios.get(`http://localhost:3001/stations`)
      .then(res => {
        const stations = res.data;
        this.setState({ stations });
      })

    await axios.get(`http://localhost:3001/data_1h`)
      .then(res => {
        const data_1h = res.data;
        const data_1h_time = res.data.time;
        const data_1h_temperature = res.data.temperature;
        const data_1h_felttemperature = res.data.felttemperature;
        const data_1h_precipitation_probability = res.data.precipitation_probability;
        const data_1h_windspeed = res.data.windspeed;

        this.setState({
          data_1h, data_1h_time, data_1h_temperature, data_1h_felttemperature, data_1h_precipitation_probability,
          data_1h_windspeed
        });
      })
    await axios.get(`http://localhost:3001/data_day`)
      .then(res => {
        const data_day = res.data.time;
        const data_day_time = res.data.time;
        const data_day_temperature_max = res.data.temperature_max;
        const data_day_temperature_min = res.data.temperature_min;
        const data_day_precipitation_probability = res.data.precipitation_probability;
        const data_day_precipitation = res.data.precipitation;
        const data_day_windspeed_max = res.data.windspeed_max;
        const data_day_windspeed_mean = res.data.windspeed_mean;
        const data_day_windspeed_min = res.data.windspeed_min;
        const data_day_relativehumidity_max = res.data.relativehumidity_max;
        const data_day_relativehumidity_min = res.data.relativehumidity_min;
        const data_day_relativehumidity_mean = res.data.relativehumidity_mean;
        this.setState({
          data_day, data_day_precipitation, data_day_precipitation_probability, data_day_relativehumidity_max,
          data_day_relativehumidity_mean, data_day_relativehumidity_min, data_day_temperature_max, data_day_temperature_min,
          data_day_time, data_day_windspeed_max, data_day_windspeed_min, data_day_windspeed_mean
        });
        console.log(res.data.time);


      })






  }
  //delete station
  deleteStation = async (id, e) => {

    // Issue DELETE request
    await axios.delete(`http://localhost:3001/stations/${id}`)
      .then(async () => {

        // Issue GET request after item deleted to get updated list
        // that excludes user of id
        return await axios.get(`http://localhost:3001/stations`)
      })
      .then(res => {

        // Update users in state as per-usual
        const stations = res.data;
        this.setState({ stations });
      })
  }

  updateStation = async (id, e) => {

    e.preventDefault();
    const { name } = this.state;
    const { lat, lng } = this.state.location;
    const station = {
      name, lat, lng
    };
    await axios.put(`http://localhost:3001/stations/${id}`, station)
      .then(async () => {

        // Issue GET request after item deleted to get updated list
        // that excludes user of id
        return await axios.get(`http://localhost:3001/stations`)
      })
      .then(res => {

        // Update users in state as per-usual
        const stations = res.data;
        this.setState({ stations });
      })
    this.setState({
      formVisible: !this.state.UpdateformVisible
    })





    await axios.get(`http://localhost:3001/stations`)
      .then(res => {
        const stations = res.data;
        this.setState({ stations });
      })


  }

  // city name i stataden alıyor arama yapıyor aldığı sonucun lat ve lng 'nu state deki location a yazıyor
  searchStation = async () => {
    const { city_name } = this.state;
    // const searchs = await axios.get('https://nominatim.openstreetmap.org/?format=json&addressdetails=1&q=' + city_name + '&format=json&limit=1')
    axios.get("https://nominatim.openstreetmap.org/search/" + city_name + "?format=json&addressdetails=1&limit=1&polygon_svg=1")
      .then(response => {
        this.setState({
          location: {
            lat: response.data[0].lat,
            lng: response.data[0].lon
          }
        });

        console.log("lat : " + response.data[0].lat, "lon : " + response.data[0].lon)
      })

    this.setState({
      collapse: !this.state.collapse
    });


  }
  getChartData = async (e) => {

    await axios.get(`http://localhost:3001/data_daychart`)
      .then(res => {
        const data_daychart = res.data;
        this.setState({
          data_daychart,
          chartVisible: !this.state.chartVisible
        });
      })
    if (this.state.data_daychart.length <= 0) {
      for (var i = 0; i < this.state.data_day_time.length; i++) {
        let name = this.state.data_day_time[i];
        let temperature_max = this.state.data_day_temperature_max[i];
        let temperature_min = this.state.data_day_temperature_min[i];
        let precipitation_probability = this.state.data_day_precipitation_probability[i];
        let precipitation = this.state.data_day_precipitation[i];
        let windspeed_max = this.state.data_day_windspeed_max[i];
        let windspeed_mean = this.state.data_day_windspeed_mean[i];
        let windspeed_min = this.state.data_day_windspeed_min[i];
        let relativehumidity_max = this.state.data_day_relativehumidity_max[i];
        let relativehumidity_min = this.state.data_day_relativehumidity_min[i];
        let relativehumidity_mean = this.state.data_day_relativehumidity_mean[i];
        const data_daychart = {
          name, temperature_max, temperature_min, precipitation_probability, windspeed_max, precipitation, windspeed_mean,
          windspeed_min, relativehumidity_max, relativehumidity_min, relativehumidity_mean
        }
        await axios.post(`http://localhost:3001/data_daychart`, data_daychart)

      }
    }



    await axios.get(`http://localhost:3001/data_1hchart`)
      .then(res => {
        const data_1hchart = res.data;
        this.setState({
          data_1hchart,
        });
      })
    if (this.state.data_1hchart.length <= 0) {
      for (var j = 0; j < this.state.data_1h_time.length; j++) {
        let name = this.state.data_1h_time[j];
        let temperature = this.state.data_1h_temperature[j];
        let felttemperature = this.state.data_1h_felttemperature[j];
        let windspeed = this.state.data_1h_windspeed[j];
        let precipitation_probability = this.state.data_1h_precipitation_probability[j];

        const data_1hchart = {
          name, temperature, felttemperature, windspeed, precipitation_probability
        }
        await axios.post(`http://localhost:3001/data_1hchart`, data_1hchart)

      }
    }



  }

  // runs when form submitted
  handleSubmit = async (event) => {
    event.preventDefault();
    const { name } = this.state;
    const { lat, lng } = this.state.location;
    const station = {
      name, lat, lng
    };

    const response = await axios.post(`http://localhost:3001/stations`, station)

    console.log(response);
    this.setState({
      formVisible: !this.state.formVisible
    })


    await axios.get(`http://localhost:3001/stations`)
      .then(res => {
        const stations = res.data;
        this.setState({ stations });
      })
  }
  //station submit buttton events
  handleChange = event => {
    this.setState({ name: event.target.value });
    
  }

  //search butonundan city name i alıp state e yazıyor 
  handleSearch = async (event) => {
    this.setState({
      city_name: event.target.value,

    });


  }


  //search toogle
  toggle = (event) => {
    this.setState({
      collapse: !this.state.collapse
    });
  }

  //opens form with onclick on the popup
  openForm = (event) => {
    this.setState({
      formVisible: !this.state.formVisible
    })


  }
  //Opens chart
  openChart = (event) => {
    this.setState({
      chartVisible: !this.state.chartVisible
    });
  }
  dataDayVisible = (event) => {
    this.setState({
      dataDayVisible: !this.state.dataDayVisible,
      data1hVisible: false,

    });
  }
  data1hVisible = (event) => {
    this.setState({
      data1hVisible: !this.state.data1hVisible,
      dataDayVisible: false


    });
  }
  radialChartVisible = (event) => {
    this.setState({
      radialChartVisible: !this.state.radialChartVisible,
      lineChartVisible: !this.state.lineChartVisible,


    });
  }
  lineChartVisible = (event) => {
    this.setState({
      lineChartVisible: !this.state.lineChartVisible,
      radialChartVisible: false,
      barChartVisible: false


    });
  }
  barChartVisible = (event) => {
    this.setState({
      barChartVisible: !this.state.barChartVisible,
      radialChartVisible: false,
      lineChartVisible: false,



    });
  }

  //opens update form
  openUpdateForm = (event) => {
    this.setState({
      UpdateformVisible: !this.state.UpdateformVisible
    })
    console.log(this.state.UpdateformVisible);

  }

  // get current latlng  and locate the marker
  DragEndEvent = (event) => {
    const latlng = event.target.getLatLng();
    console.log(latlng.lat, latlng.lng)
    this.setState({
      location: {
        lat: latlng.lat,
        lng: latlng.lng
      }
    });
  }




  render() {

    return (
      <div className="map">

        <Map className="map" center={this.state.location} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />



          <Marker
            icon={myAddIcon}
            position={this.state.location}
            draggable={true}
            ondragend={this.DragEndEvent}
          >


            {
              this.state.formVisible ?

                <Popup >
                  <p>Please fill the Form!  </p>
                  <Button onClick={this.openForm} color="info"><i class="fa fa-close"></i> Close</Button>
                </Popup>
                :

                <Popup >
                  <Button onClick={this.openForm} color="info">Add here as a station!</Button>
                </Popup>
            }

          </Marker>



          {this.state.stations.map(station => (
            <Marker
              key={station._id}
              position={[station.lat, station.lng]}
              draggable={false}
              icon={myIcon}>
              <Popup>

                <p style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                  {station.name}
                </p>

                <Button onClick={this.deleteStation.bind(this, station.id)}><i class="fa fa-trash"></i></Button>
                &emsp;
                <Button onClick={this.openUpdateForm}><i class="far fa-edit"></i></Button>
                {
                  this.state.UpdateformVisible
                    ?
                    <Card body className="update-station-form" >
                      <Button onClick={this.openUpdateForm} color="info"><i class="fa fa-close"></i> Close</Button>
                      <CardTitle>Welcome to Update station form!</CardTitle>

                      <Form onSubmit={this.updateStation.bind(this, station.id)}>
                        <FormGroup>
                          <Label for="name">Update Station Name</Label>
                          <Input
                            onChange={this.handleChange}
                            type="text"
                            name="name"
                            placeholder="New Station Name"
                            required

                          />
                        </FormGroup>
                        <FormGroup>
                          <p>Location:<br />{this.state.location.lat}<br />{this.state.location.lng}</p>

                        </FormGroup>
                        <Button onClick={this.openUpdateForm} type="submit" color="info" >Add</Button>
                      </Form>

                    </Card>
                    : null
                }
                {/* <Button onClick={this.updateStation.bind(this, station.id)}>Düzenle</Button> */}
              </Popup>
            </Marker>
          ))}




        </Map>

        <div className="toggle">
          <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}><i class="fas fa-plus"></i> &emsp;Add Station</Button>
          <Collapse isOpen={this.state.collapse}>
            <Card className="Search-city">
              <CardBody>
                <Label for="name" color="info">Search Area</Label>
                <Input
                  onChange={this.handleSearch}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter a City Name"
                  required

                />

                <Button onClick={this.searchStation} color="primary" className="float-right" style={{ marginTop: '5px' }}>Search</Button>
              </CardBody>
            </Card>
          </Collapse>
        </div>

        {
          this.state.formVisible
            ?
            <Card body className="add-station-form" >
              <Button onClick={this.openForm} color="info"><i class="fa fa-close"></i></Button>
              <CardTitle>Welcome to Add Station form!</CardTitle>

              <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                  <Label for="name">Station Name</Label>
                  <Input
                    onChange={this.handleChange}
                    type="text"
                    name="name"
                    placeholder="Enter Station Name"

                  />
                </FormGroup>
                <FormGroup>
                  <p>Location:<br />{this.state.location.lat}<br />{this.state.location.lng}</p>

                </FormGroup>
                <Button type="submit" color="info" >Add</Button>
              </Form>

            </Card>
            : null
        }

        <div className="StationList" >
          <Card id="StationList">
            <Label style={{ textAlign: "center", textTransform: "uppercase", fontWeight: "bold" }}><b>Stations</b></Label>

            {/* Listing stations */}
            <ListGroup >

              {this.state.stations.map(station =>
                <ListGroupItem className="list-group-item list-group-item-warning" tag="button" onClick={this.getChartData} style={{ textAlign: "center", textTransform: "uppercase" }}>
                  {station.name}



                </ListGroupItem>)
              }
            </ListGroup>


          </Card>
        </div>

        <div className={"chart"} style={{ width: "4%", height: "39%" }}>
          {
            this.state.chartVisible ?
              <div>
                <Card style={{ width: "max-content" }}>
                  <Button onClick={this.data1hVisible} color="info">7 gün saatlik tahmin</Button>
                  <Button onClick={this.dataDayVisible} color="info">7 günlük tahmin</Button>
                </Card>
                {
                  this.state.dataDayVisible ?
                    <Card style={{ width: "fit-content" }}>

                      {
                        this.state.lineChartVisible ?
                          <p style={{ textAlign: "center" }}>Come over the points to see all details</p>
                          : null
                      }
                      {/* <Chart options={options} series={options.series} type="bar" width={500} height={320} /> */}
                      {
                        this.state.lineChartVisible ?

                          <LineChart width={730} height={300} data={this.state.data_daychart}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="temperature_max" stroke="#8884d8" />
                            <Line type="monotone" dataKey="temperature_min" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="precipitation_probability" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="windspeed_max" stroke="#8884d8" />
                            <Line type="monotone" dataKey="precipitation" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="windspeed_mean" stroke="#8884d8" />
                            <Line type="monotone" dataKey="windspeed_min" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="relativehumidity_max" stroke="#8884d8" />
                            <Line type="monotone" dataKey="relativehumidity_min" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="relativehumidity_mean" stroke="#8884d8" />

                          </LineChart>


                          : null
                      }
                      {
                        this.state.radialChartVisible ?
                          <RadialBarChart
                            width={730}
                            height={350}
                            innerRadius="10%"
                            outerRadius="80%"
                            data={this.state.data_daychart}
                            startAngle={180}
                            endAngle={0}
                          >
                            <RadialBar minAngle={15} label={{ fill: '#FFFFFF', position: 'insideStart' }} background clockWise={true} dataKey='temperature_max' />
                            <Legend iconSize={15} width={120} height={150} layout='vertical' verticalAlign='middle' align="right" />
                            <Tooltip />
                          </RadialBarChart>
                          : null
                      }
                      {
                        this.state.barChartVisible ?
                          <BarChart width={730} height={250} data={this.state.data_daychart}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="windspeed_mean" fill="#8884d8" />
                            <Bar dataKey="windspeed_min" fill="#82ca9d" />
                          </BarChart>
                          : null
                      }
                      <div>
                        <Button onClick={this.radialChartVisible} color="info">Radial Bar Chart</Button>
                        <Button onClick={this.lineChartVisible} color="info">Line Chart</Button>
                        <Button onClick={this.barChartVisible} color="info">Bar Chart</Button>

                      </div>

                    </Card>
                    : null
                }
                {
                  this.state.data1hVisible ?
                    <Card style={{ width: "fit-content" }}>
                      <LineChart width={730} height={300} data={this.state.data_1hchart}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                        <Line type="monotone" dataKey="felttemperature" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="windspeed" stroke="#8884d8" />
                        <Line type="monotone" dataKey="precipitation" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="precipitation_probability" stroke="#8884d8" />


                      </LineChart>

                    </Card>

                    : null
                }
              </div>
              : null
          }

        </div>

      </div>

    );
  }
}

export default App;
