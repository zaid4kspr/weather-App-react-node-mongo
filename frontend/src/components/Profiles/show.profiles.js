import React , {useState,useEffect} from "react";
import {
    Card,
    CardHeader,
    Container,
    Row,
    Col, FormGroup, Input, Button, Form, UncontrolledAlert, CardBody, CardTitle
} from "reactstrap";
import {
  useParams
} from "react-router-dom";

// core components
import Header from "components/Headers/Header.js";
import ProfileService from "services/profile.service";
import TimePicker from "react-bootstrap-time-picker";

function ShowProfile (props) {
    const {id} = useParams();
    const [profile,setProfile] = useState({});
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        ProfileService.getOne(id)
            .then(res => {
            console.log(res.data)
            setProfile(res.data);
        })

        .catch(err=>{
          console.log(err)
        })
    },[]);

    const updateProfile = (e)=>{
        e.preventDefault();
        setLoading(true);
        let data = new FormData();
        for ( let key in profile ) {
            data.append(key, key === "intervals" ? JSON.stringify(profile[key]) : profile[key]);
        }
        for (let value of data.values()) {
            console.log(value);
        }
        console.log("profile");
        console.log(profile);
        ProfileService.updateProfile(profile._id,data).then((res)=>{
            console.log(res.data)
            setSuccess("Mise a jour avec success.")
            setLoading(false);
        }).catch(err=>{
            setLoading(false);
            setError(err.message);
        })
    }
    const changeProfile = (e)=>{
        if(e.currentTarget.id === "icon" || e.currentTarget.id === "image" ) {
            let data = {};
            data[e.currentTarget.id] = e.currentTarget.files[0];
            Object.assign(profile,data)
            setProfile(profile);
        }else{
            let data = {};
            data[e.currentTarget.id] = e.currentTarget.value;
            Object.assign(profile,data);
            setProfile(profile);
        }
        console.log(profile)
    }

    const removeInterval = (e,i)=>{
        let data = {};
        if(profile.intervals && profile.intervals.length) {
            data.intervals = profile.intervals;
            data.intervals.splice(i,1);
            if(!data.intervals.length)
                data.intervals = [];
            profile.intervals = data.intervals;
            setProfile({...profile});
            console.log(profile);
        }
    }

    const newInterval = (e)=>{
        let data = {};
        data.intervals = [];
        let inter = {days: ["Monday"],fromHour:"08:00",toHour: "09:00"};
        if(profile.intervals && profile.intervals.length) {
            data.intervals = profile.intervals;
            data.intervals.push(inter);
        }
        else{
            data.intervals[0] = inter;
        }
        profile.intervals=data.intervals;
        setProfile({...profile});
        console.log(profile);
    }
    const setFromHour = (e,i)=>{
        let hours = Math.floor(e/3600);
        let minutes = (e%3600) / 60;
        let data = [];
        data.intervals = [];
        data.intervals[i] = profile.intervals[i];
        data.intervals[i].fromHour = hours + ":" + minutes;
        console.log(data.intervals[i].fromHour);
        profile.intervals[i]=data.intervals[i];
        setProfile({...profile});
    }
    const setToHour = (e,i)=>{
        let hours = Math.floor(e/3600);
        let minutes = (e%3600) / 60;
        let data = [];
        data.intervals = [];
        data.intervals[i] = profile.intervals[i];
        data.intervals[i].toHour = hours + ":" + minutes;
        profile.intervals[i]=data.intervals[i];
        setProfile({...profile});
    }
    const setDays = (e,i)=>{
        let data = [];
        data.intervals = [];
        data.intervals[i] = profile.intervals[i];
        if(profile.intervals[i].days && profile.intervals[i].days.indexOf(e.currentTarget.id)>= 0) {
            console.log(data.intervals[i].days);
            data.intervals[i].days.splice(profile.intervals[i].days.indexOf(e.currentTarget.id),1);
            console.log(data.intervals[i].days);
        }
        else{
            console.log(e.currentTarget.name)
            data.intervals[i].days.push(e.currentTarget.id);
            console.log(data.intervals[i].days);
        }
        profile.intervals[i] = data.intervals[i];
        setProfile({...profile});
        console.log(profile);
    }
    const changeMultiple = (e,i)=>{
        let data = [];
        data.intervals = [];
        data.intervals[i] = profile.intervals[i];
        data.intervals[i].multiple = e.currentTarget.value;
        profile.intervals[i] = data.intervals[i];
        setProfile({...profile});
    }

    return (
      <>
    <Header />

        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
            <Row>
            <Col lg="11">
                <Card className="shadow bg-secondary">
                    <CardHeader className="border-0 bg-white">
                        <h3 className="mb-0">informations de profile:</h3>
                    </CardHeader>
                    <div className="pl-lg-4 mt-5">
                        <Form className="mt-5" onSubmit={updateProfile}>
                            <Row>
                                <Col lg="11">
                                    <Row>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="type">
                                                    type:
                                                </label>
                                                <Input
                                                    onChange={changeProfile}
                                                    defaultValue={profile.type  || ''}
                                                    className="form-control-alternative"
                                                    id="type"
                                                    type="select"
                                                >
                                                    <option value="Moto">Moto</option>
                                                    <option value="Taxi">Taxi</option>
                                                    <option value="Car">Car</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="name"
                                                >
                                                    Nom de profil:
                                                </label>
                                                <Input
                                                    onChange={changeProfile}
                                                    className="form-control-alternative"
                                                    defaultValue={profile.name  || ''}
                                                    id="name"
                                                    placeholder="Nom de profil"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="priceKm">
                                                    Prix d'un Km:
                                                </label>
                                                <Input
                                                    onChange={changeProfile}
                                                    defaultValue={profile.priceKm || ''}
                                                    className="form-control-alternative"
                                                    id="priceKm"
                                                    placeholder="Prix 1 km"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="priceKm">
                                                    Prix minimum:
                                                </label>
                                                <Input
                                                    onChange={changeProfile}
                                                    defaultValue={profile.minPrice || ''}
                                                    className="form-control-alternative"
                                                    id="minPrice"
                                                    placeholder="Prix min"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="priceKmOutZone">
                                                    Prix du km hors zone:
                                                </label>
                                                <Input onChange={changeProfile}
                                                       name="priceKmOutZone"
                                                       className="form-control-alternative"
                                                       id="priceKmOutZone"
                                                       placeholder="Prix du km hors zone"
                                                       type="text"
                                                       defaultValue={profile.priceKmOutZone}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="status">
                                                    Prix d'une minute:
                                                </label>
                                                <Input onChange={changeProfile} defaultValue={profile.priceMinute} type="text" name="priceMinute" id="priceMinute">
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                    htmlFor="fixedPrice">
                                                    Prix Fix:
                                                </label>
                                                <Input
                                                    onChange={changeProfile}
                                                    className="form-control-alternative"
                                                    defaultValue={profile.fixedPrice  || ''}
                                                    id="fixedPrice"
                                                    placeholder="Prix fix"
                                                    type="text"
                                                    defaultValue={profile.fixedPrice}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="priceMinuteWaiting">
                                                    Prix à la minute d'attente:
                                                </label>
                                                    <Input onChange={changeProfile} name="priceMinuteWaiting" id="priceMinuteWaiting" type="text" defaultValue={profile.priceMinuteWaiting}/>
                                            </FormGroup>
                                        </Col>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="basePrice">
                                                    Prix de départ:
                                                </label>
                                                    <Input  onChange={changeProfile} name="basePrice" id="basePrice" type="text" defaultValue={profile.basePrice} />
                                            </FormGroup>
                                        </Col>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="radius">
                                                    Rayon:
                                                </label>
                                                <Input  onChange={changeProfile} name="radius" id="radius" type="text" defaultValue={profile.radius} />
                                            </FormGroup>

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="failedAlarms">
                                                    Numéro d'alarmes ayant échoué:
                                                </label>
                                                <Input  onChange={changeProfile} name="failedAlarms" id="failedAlarms" type="text" defaultValue={profile.failedAlarms} />
                                            </FormGroup>

                                        </Col>

                                        <Col lg="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="timeAlarm">
                                                    Temps alarm (ms):
                                                </label>
                                                <Input  onChange={changeProfile} name="timeAlarm" id="timeAlarm" type="text" defaultValue={profile.timeAlarm} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="icon">
                                                    Icone:
                                                </label>
                                                <Input  onChange={changeProfile} name="icon" id="icon" type="file" />
                                            </FormGroup>
                                        </Col>
                                        <Col lg="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="image">
                                                    Image:
                                                </label>
                                                <Input  onChange={changeProfile} name="image" id="image" type="file" />
                                            </FormGroup>

                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col lg="12">
                                            <Row>
                                                <Col lg = "6">
                                                    Intervals:
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {profile.intervals && profile.intervals.map((interval,i)=>{
                                        console.log(profile.intervals);
                                        return (
                                            <Row key={i} className="bg-white mb-3">
                                                <Col lg="12">
                                                    <Row>
                                                        <Col lg="12" align = "right" className="p-0">
                                                            <Button type="button" onClick={e=>{removeInterval(e,i)}} className="btn btn-danger">X</Button>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg="11">
                                                            <FormGroup>
                                                                <label className="form-control-label" htmlFor="Monday">
                                                                    Lundi:
                                                                </label>
                                                                <label className="custom-toggle mr-5">
                                                                    <Input onChange={e => (setDays(e,i))} defaultChecked={interval.days && interval.days.indexOf("Monday")>= 0 } type="checkbox" name="Monday" id="Monday"></Input>
                                                                    <span className="custom-toggle-slider rounded-circle" />
                                                                </label>
                                                                <label className="form-control-label" htmlFor="Tuesday">
                                                                    Mardi:
                                                                </label>
                                                                <label className="custom-toggle mr-5">
                                                                    <Input onChange={e => (setDays(e,i))} defaultChecked={interval.days && interval.days.indexOf("Tuesday")>= 0} type="checkbox" name="Tuesday" id="Tuesday"></Input>
                                                                    <span className="custom-toggle-slider rounded-circle" />
                                                                </label>
                                                                <label className="form-control-label" htmlFor="Wednesday">
                                                                    Mercredi:
                                                                </label>
                                                                <label className="custom-toggle mr-5">
                                                                    <Input onChange={e => (setDays(e,i))} defaultChecked={interval.days && interval.days.indexOf("Wednesday")>= 0} type="checkbox" name="Wednesday" id="Wednesday"></Input>
                                                                    <span className="custom-toggle-slider rounded-circle" />
                                                                </label>
                                                                <label className="form-control-label" htmlFor="Thursday">
                                                                    Jeudi:
                                                                </label>
                                                                <label className="custom-toggle mr-5">
                                                                    <Input onChange={e => (setDays(e,i))} defaultChecked={interval.days && interval.days.indexOf("Thursday")>= 0} type="checkbox" name="Thursday" id="Thursday"></Input>
                                                                    <span className="custom-toggle-slider rounded-circle" />
                                                                </label>
                                                                <label className="form-control-label" htmlFor="Friday">
                                                                    Vendredi:
                                                                </label>
                                                                <label className="custom-toggle mr-5">
                                                                    <Input onChange={e => (setDays(e,i))} defaultChecked={interval.days && interval.days.indexOf("Friday")>= 0} type="checkbox" name="Friday" id="Friday"></Input>
                                                                    <span className="custom-toggle-slider rounded-circle" />
                                                                </label>
                                                                <label className="form-control-label" htmlFor="Saturday">
                                                                    Samedi:
                                                                </label>
                                                                <label className="custom-toggle mr-5">
                                                                    <Input onChange={e => (setDays(e,i))} defaultChecked={interval.days && interval.days.indexOf("Saturday") >= 0} type="checkbox" name="Saturday" id="Saturday"></Input>
                                                                    <span className="custom-toggle-slider rounded-circle" />
                                                                </label>
                                                                <label className="form-control-label" htmlFor="Sunday">
                                                                    Dimanche:
                                                                </label>
                                                                <label className="custom-toggle mr-5">
                                                                    <Input onChange={e => (setDays(e,i))} defaultChecked={interval.days && interval.days.indexOf("Sunday") >= 0} type="checkbox" name="Sunday" id="Sunday"></Input>
                                                                    <span className="custom-toggle-slider rounded-circle" />
                                                                </label>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg="11" className="mb-5">
                                                            <FormGroup>
                                                                <label htmlFor="fromHour">Date debut:</label>
                                                                <TimePicker
                                                                    format={24}
                                                                    step={30}
                                                                    id="fromHour"
                                                                    name="fromHour"
                                                                    onChange={e=>{setFromHour(e,i)}}
                                                                    value={interval.fromHour}
                                                                />
                                                            </FormGroup>
                                                            <label htmlFor="toHour">Date fin:</label>
                                                            <TimePicker
                                                                format={24}
                                                                step={30}
                                                                id="toHour"
                                                                name="toHour"
                                                                onChange={e=>{setToHour(e,i)}}
                                                                value={interval.toHour}

                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg="3">
                                                            <FormGroup>
                                                                <label className = "form-control-label" htmlFor="multiple"> Prix de course x ? :</label>
                                                                <Input onChange={e=>{changeMultiple(e,i)}} defaultValue={interval.multiple} type="text" name="multiple" id="multiple"></Input>

                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        );
                                    })}
                                    <Row>
                                        <Col lg="12" align = "right">
                                            <Button onClick={newInterval} className = "btn btn-success"> Ajout interval</Button>
                                        </Col>
                                    </Row>
                                    <Row className="my-5">
                                        <Col lg="6" >
                                            { error && <UncontrolledAlert className="alert-danger" fade={true}>
          <span className="alert-inner--icon">
            <i className="ni ni-bell-55" />
          </span>{" "}
                                                <span className="alert-inner--text">
            <strong>{error}</strong>
          </span>
                                            </UncontrolledAlert>
                                            }
                                            { success && <UncontrolledAlert className="success" fade={true}>
          <span className="alert-inner--icon">
            <i className="ni ni-bell-55" />
          </span>{" "}
                                                <span className="alert-inner--text">
            <strong>{success}</strong>
          </span>
                                            </UncontrolledAlert>
                                            }
                                        </Col>
                                        <Col lg="6" align="right">
                                            <Button disabled={loading} color = "primary" size = "lg" type = "submit" >
                                                Sauvgarder
                                                {loading &&
                                                <div className="spinner-border spinner-border-sm text-light ml-3" role="status">
                                                </div>
                                                }
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
            </Col>
        </Row>
        </Container>
      </>
    );
}

export default ShowProfile;
