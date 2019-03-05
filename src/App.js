import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { ListGroup, ListGroupItem, Collapse, CardBody, Card, Button, CardTitle, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import L from 'leaflet';

// import { ReactChartkick, LineChart, PieChart, ColumnChart, BarChart, AreaChart } from 'react-chartkick';
// import Chart from 'chart.js';
import Chart from 'react-apexcharts';


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
var data1 = [
  { "name": "Workout", "data": { "2017-01-01": 3, "2017-01-02": 4 } },
  { "name": "Call parents", "data": { "2017-01-01": 5, "2017-01-02": 3 } }
];
var options = {
  chart: {
    height: 350,
    type: 'line',
    shadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 10,
      opacity: 1
    },
    toolbar: {
      show: false
    }
  },
  colors: ['#77B6EA', '#545454'],
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: 'smooth'
  },
  series: [{
    name: "High - 2013",
    data: [28, 29, 33, 36, 32, 32, 33]
  },
  {
    name: "Low - 2013",
    data: [12, 11, 14, 18, 17, 13, 13]
  }
  ],
  title: {
    text: 'Average High & Low Temperature',
    align: 'left'
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  markers: {

    size: 6
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    title: {
      text: 'Month'
    }
  },
  yaxis: {
    title: {
      text: 'Temperature'
    },
    min: 5,
    max: 40
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
}

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
    UpdateformVisible: false,
    collapse: false,
    stations: [],
    data_1h: [],
    data_1h_time: [],
    data_1h_temperature: [],
    data_1h_felttemperature: [],
    data_1h_windspeed: [],
    data_1h_precipitation_probability: [],
    data_day: [],
    data_day_time: [],
    data_day_temperature_max: [],
    data_day_temperature_min: [],
    data_day_precipitation_probability: [],
    data_day_precipitation: [],
    data_day_windspeed_max: [],
    data_day_windspeed_min: [],
    data_day_relativehumidity_max: [],
    data_day_relativehumidity_min: [],
    data_day_relativehumidity_mean: [],
    name: '',
    city_name: '',
    searchs: [],
    city_id: '',
    options: {
      chart: {
        id: 'apexchart-example'
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
      }
    },
    series: [{
      name: 'series-1',
      data: [30, 40, 45, 50, 49, 60, 70, 91]
    }]


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
        const data_day_windspeed_min = res.data.windspeed_min;
        const data_day_relativehumidity_max = res.data.relativehumidity_max;
        const data_day_relativehumidity_min = res.data.relativehumidity_min;
        const data_day_relativehumidity_mean = res.data.relativehumidity_mean;
        this.setState({
          data_day, data_day_precipitation, data_day_precipitation_probability, data_day_relativehumidity_max,
          data_day_relativehumidity_mean, data_day_relativehumidity_min, data_day_temperature_max, data_day_temperature_min,
          data_day_time, data_day_windspeed_max, data_day_windspeed_min
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
                  <Button onClick={this.openForm} color="info">Close Form</Button>
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

                <Button onClick={this.deleteStation.bind(this, station.id)}>Sil</Button>
                <Button onClick={this.openUpdateForm}>Düzenle</Button>
                {
                  this.state.UpdateformVisible
                    ?
                    <Card body className="update-station-form" >
                      <Button onClick={this.openUpdateForm} color="info">Close</Button>
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
          <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>Add Station</Button>
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
              <Button onClick={this.openForm} color="info">Close</Button>
              <CardTitle>Welcome to Adding station page!</CardTitle>

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

        <div className="StationList">
          <Card>
            <Label style={{ textAlign: "center", textTransform: "uppercase", fontWeight: "bold" }}><b>Stations</b></Label>

            {/* Listing stations */}
            <ListGroup>

              {this.state.stations.map(station =>
                <ListGroupItem tag="button" onClick={this.openChart }  style={{ textAlign: "center", textTransform: "uppercase" }}>
                  {station.name}
                  


                </ListGroupItem>)
              }
            </ListGroup>


          </Card>
        </div>

        <div className={"chart"} style={{ width: "4%", height: "39%" }}>
          {
            this.state.chartVisible ?
              <Card style={{ width: "fit-content" }}>
                <Chart options={options} series={options.series} type="bar" width={500} height={320} />
              </Card>
              : null
          }
        </div>
      </div>

    );
  }
}

export default App;
