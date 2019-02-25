import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { ListGroup, ListGroupItem, Collapse, CardBody, Card, Button, CardTitle, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import L from 'leaflet';



import './App.css';

var myIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
});


class App extends Component {
  state = {
    location: {
      lat: 39.690280594818034,
      lng: 34.94750976562501
    },
    haveUserLocation: false,
    zoom: 6.1,
    formVisible: false,
    UpdateformVisible: false,
    collapse: false,
    stations: [],
    name: '',
    city_name: '',
    searchs: [],
    city_id: ''

  }
  componentDidMount = async () => {

    await axios.get(`http://localhost:3001/stations`)
      .then(res => {
        const stations = res.data;
        this.setState({ stations });
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
    console.log(this.state.formVisible);

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
            icon={myIcon}
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
              draggable={true}
              icon={myIcon}>
              <Popup>

                <p>
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
                        <Button onClick={this.openUpdateForm }type="submit" color="info" >Add</Button>
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
            <Label style={{ textAlign: "center", textDecoration: "bold" }}><b></b>Stations</Label>

            {/* Listing stations */}
            <ListGroup>

              {this.state.stations.map(station =>
                <ListGroupItem tag="button" onClick={this.deleteStation}>
                  {station.name}


                </ListGroupItem>)
              }
            </ListGroup>


          </Card>
        </div>
      </div>

    );
  }
}

export default App;
