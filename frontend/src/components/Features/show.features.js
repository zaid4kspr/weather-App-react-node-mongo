import React, {
    useState,
    useEffect
} from "react";
import {
    Link,  useParams
} from "react-router-dom";
import {
    UncontrolledAlert,
    Form,
    Card,
    CardHeader,
    Container,
    Row,
    Col,
    FormGroup,
    Input,
    Button
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import FeatureService from "services/feature.service";
import ProfileService from "services/profile.service";

export function ShowFeature(props) {
    const{id} = useParams();

    const [feature,setFeature] = useState({});
    const [profiles,setProfiles] = useState([]);
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');
    const [loading,setLoading] = useState(false);
    useEffect(()=>{

        FeatureService.getOne(id).then(res=>{
            setFeature(res.data);
        }).catch(err=>{
            if(err.response)
                setError(err.response.data.message)
        })
        ProfileService.getAll().then(res=>{
            setProfiles(res.data);
        }).catch(err=>{
            if(err.response)
                setError(err.response.data.message)
        })


    },[id])

    const changeFeature = (ev)=>{
        feature[ev.currentTarget.id] = ev.currentTarget.value;
        setFeature({...feature});
    }

    const saveFeature = (e)=>{
        e.preventDefault();
        console.log(feature);
        setLoading(true);
        setSuccess('');
        setError('');
        FeatureService.update(feature).then((res)=>{
            console.log(res)
            setSuccess(res.data.message);
            setLoading(false);

        }).catch((err)=>{
            console.log(err)
            setLoading(false);
            setError(err.response.data.message);
        });
    }

    return (
        <>
            <Header/>
            <Container className="mt--7" fluid>
                <Row>
                    <Col lg="11">
                        <Card className="shadow bg-secondary">
                            <CardHeader className="border-0 bg-white">
                                <h3 className="mb-0"> Feature:</h3>
                            </CardHeader>
                            <div className="pl-lg-4 mt-5">
                                <Form className="mt-5" onSubmit={saveFeature}>
                                    <Row>
                                        <Col lg="12">
                                            <Row>
                                                <Col lg="6">
                                                    <Row>
                                                        <Col lg="5">
                                                            <FormGroup>
                                                                <label
                                                                    className="form-control-label"
                                                                    htmlFor="firstName">
                                                                    Profil:
                                                                </label>
                                                                {feature && <Input required
                                                                                   onChange={changeFeature}
                                                                                   value={feature.vehicleProfile}
                                                                                   className="form-control-alternative"
                                                                                   id="firstName"
                                                                                   placeholder="vehicleProfile"
                                                                                   type="select">
                                                                    {profiles.map((profile,i)=>{
                                                                        return(
                                                                            <option key={i} value={profile.name}>{profile.name}</option>
                                                                        )
                                                                    })
                                                                    }
                                                                </Input>
                                                                }
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg="5">
                                                            <FormGroup>
                                                                <label
                                                                    className="form-control-label"
                                                                    htmlFor="name"
                                                                >
                                                                    Nom de feature:
                                                                </label>
                                                                <Input
                                                                    required
                                                                    onChange={changeFeature}
                                                                    defaultValue={feature.name}
                                                                    className="form-control-alternative"
                                                                    id="name"
                                                                    placeholder="Nom de feature"
                                                                    type="text"
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="8">
                                                    { error && <UncontrolledAlert className="alert-danger" fade={true}>
          <span className="alert-inner--icon">
            <i className="ni ni-bell-55" />
          </span>{" "}
                                                        <span className="alert-inner--text">
            <strong>{error}</strong>
          </span>
                                                    </UncontrolledAlert>
                                                    }
                                                    { success && <UncontrolledAlert className="alert-success" fade={true}>
          <span className="alert-inner--icon">
            <i className="ni ni-bell-55" />
          </span>{" "}
                                                        <span className="alert-inner--text">
            <strong>{success}</strong>
          </span>
                                                    </UncontrolledAlert>
                                                    }

                                                </Col>
                                                <Col className="mr-3 mt-1" align="right" lg="3">
                                                    <FormGroup>
                                                        <Button disabled={loading} color="primary" size="lg" type="submit">
                                                            Sauvgarder
                                                            {  loading &&
                                                            <div className="spinner-border spinner-border-sm text-light ml-3" role="status">
                                                            </div>
                                                            }
                                                        </Button>
                                                    </FormGroup>
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

export default ShowFeature;
