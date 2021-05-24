import React, { useEffect, useState } from "react";
// node.js library that concatenates classes (strings)

// reactstrap components
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

// core components

import Header from "components/Headers/Header.js";
import AnalyticsService from "services/analytics.service";
import publicIp from "public-ip";

function Index(props) {

  const { buttonLabel, className } = props;
  const [analytics, setAnalytics] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [error, setError] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [city, setCity] = useState({});
  let   [cities, setCities] = useState([]);
  const [dataToShare, setDataToShare] = useState({});
  const [forecast, setForecast] = useState({});
  const [myCityInfo, setMyCityInfo] = useState({});
  const [modal, setModal] = useState(false);

  const toggle = (region) => {
    setModal(!modal);
    console.log(region);
    setDataToShare(region);
  };
  const [email, setEmail] = useState("");

  useEffect(() => {
    AnalyticsService.watchList()
      .then((res) => {
        setWatchList(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        if (err.response) setError(err.response.data.message);
      });

    publicIp.v4().then((myIp) => {
      console.log(myIp);
      AnalyticsService.getWeatherByIp(myIp)
        .then((res) => {
          setMyCityInfo(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          if (err.response) setError(err.response.data.message);
        });
      AnalyticsService.getForecastByIp(myIp)
        .then((res) => {
          setForecast(res.data);
        })
        .catch((err) => {
          if (err.response) setError(err.response.data.message);
        });
    });
  }, []);
  const emailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUserChange = (e) => {
    console.log(e);
    AnalyticsService.getCities(e)
      .then((res) => {
        console.log(res);
        setCities(res.data);
      })
      .catch((err) => {
        if (err.response) setError(err.response.data.message);
      });
  };
  const cityChanged = (e) => {
    console.log(e[0]);
    if (e[0] && e[0].id)
      AnalyticsService.addToMyWatchList({
        regionId: e[0].id,
      })
        .then(async (res) => {
          let r = await AnalyticsService.watchList();
          setWatchList(r.data);
        })
        .catch((err) => {
          if (err.response) setError(err.response.data.message);
        });

    // setCity(e.target.value);
  };

  const submit = (e) => {
    e.preventDefault();

    setModal(!modal);

    AnalyticsService.shareWeather({
      data: dataToShare,
      email: email,
    })
      .then((res) => {})
      .catch((err) => {
        if (err.response) setError(err.response.data.message);
      });
  };
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          {myCityInfo && myCityInfo.weather ? (
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow mb-3">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <div>
                        {" " +
                          new Date(myCityInfo.createdAt).toLocaleTimeString()}
                      </div>
                      <h2 className="text-primary mb-0">
                        {myCityInfo.name},
                        {myCityInfo && myCityInfo.sys
                          ? myCityInfo.sys.country
                          : ""}
                      </h2>
                      <div>
                        {myCityInfo && myCityInfo.weather ? (
                          <img
                            className="moveToLeft"
                            src={
                              "http://openweathermap.org/img/wn/" +
                              myCityInfo.weather[0].icon +
                              "@2x.png"
                            }
                          />
                        ) : (
                          ""
                        )}
                        <span className="mainTemp">
                          {myCityInfo.main ? myCityInfo.main.temp : ""}°C
                        </span>
                      </div>
                    </div>

                    <div className="col">
                      <div className="row">
                        <div className="col">
                          Feels like {myCityInfo.main.feels_like}°C{". "}
                          {myCityInfo.weather[0].main},{" "}
                          {myCityInfo.weather[0].description}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col">
                          Humidity :{" "}
                          <span className="text-info">
                            {myCityInfo.main.humidity}%
                          </span>
                        </div>
                        <div className="col">
                          Pressure :{" "}
                          <span className="text-info">
                            {myCityInfo.main.pressure}hPa
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md">
                          Wind speed :{" "}
                          <span className="text-info">
                            {myCityInfo.wind.speed}
                          </span>
                        </div>
                        <div className="col-md">
                          Visibility:{" "}
                          <span className="text-info">
                            {myCityInfo.visibility / 1000}km
                          </span>
                        </div>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {forecast && forecast.daily ? (
                    <Row className="mx-auto">
                      {forecast.daily.map((forecast) => (
                        <Col
                          key={forecast.dt}
                          lg="3"
                          className="text-center borderForecast mb-3"
                        >
                          <div>
                            {new Date(forecast.dt * 1000).toDateString()}
                          </div>
                          <div className="tempValue avgTemp mt-2">
                            {forecast.temp.day}°
                          </div>
                          <div className="tempValue minTemp mt-2">
                            {forecast.temp.min}°
                          </div>
                          <div>
                            <img
                              src={
                                "http://openweathermap.org/img/wn/" +
                                forecast.weather[0].icon +
                                "@2x.png"
                              }
                            />
                          </div>
                          <div className="moveUp">
                            {forecast.weather[0].description}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    ""
                  )}
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
        </Row>

        <Row>
          {
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow mb-3">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h2 className="text-primary mb-0">Watch List</h2>
                    </div>
                    <div className="col">
                      {/* <Typeahead
                        id="my-typeahead-id"
                        labelKey="name"
                        onChange={cityChanged}
                        options={cities}
                      /> */}
                      <AsyncTypeahead
                        id="my-typeahead-id"
                        emptyLabel="No matches found."
                        placeholder="Search a Location..."
                        isLoading={false}
                        minLength={2}
                        onChange={cityChanged}
                        labelKey="name"
                        onSearch={handleUserChange}
                        options={cities}
                      />
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row className="mx-auto">
                    {watchList.map((region) => (
                      <Col lg="4" key={region.id}>
                        <div>
                          <Card className="card-stats mb-4 mb-lg-3 card-watchItem">
                            <CardBody>
                              <Row>
                                <div className="col">
                                  <CardTitle className="watchItemTitle mb-0">
                                    {region.sys.country} . {region.name}
                                    <img
                                      onClick={() => toggle(region)}
                                      className="ml-3 pointer"
                                      height="15"
                                      src={require("assets/img/icons/share.png")}
                                    />
                                  </CardTitle>

                                  <Row>
                                    <Col className="text-white ft-12">
                                      Updated at
                                      {" " +
                                        new Date(
                                          region.createdAt
                                        ).toLocaleTimeString()}
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col className="text-white watchItemTemp">
                                      {region.main.temp}°
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col className="text-white watchItemDesc">
                                      {region.weather[0].main +
                                        ", " +
                                        region.weather[0].description}
                                    </Col>
                                  </Row>
                                </div>
                                <Col className="col-auto my-auto">
                                  <div className="icon icon-shape  text-white shadow">
                                    <img
                                      src={
                                        "http://openweathermap.org/img/wn/" +
                                        region.weather[0].icon +
                                        "@2x.png"
                                      }
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          }
        </Row>

        <div>
          <Modal isOpen={modal} toggle={toggle} className={className}>
            <ModalHeader toggle={toggle}>Share city's weather </ModalHeader>
            <Form onSubmit={submit} role="form">
              <ModalBody>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      required
                      onChange={emailChange}
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
                    />
                  </InputGroup>
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                <Button type="submit" color="primary">
                  Share
                </Button>
                <Button color="secondary" onClick={toggle}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </div>
      </Container>
    </>
  );
}

export default Index;
