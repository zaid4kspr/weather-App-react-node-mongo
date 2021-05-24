import React, {
    useState,
    useEffect
} from "react";
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

export function AddFeature(props) {
    const [feature,setFeature] = useState({});
    const [profiles,setProfiles] = useState([]);
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');
    const [loading,setLoading] = useState(false);
useEffect(()=>{
    ProfileService.getAll().then(res=>{
        setProfiles(res.data);
    }).catch(err=>{
        if(err.response)
        setError(err.response.data.message)
    })


},[])

    const changeFeature = (ev)=>{
    console.log(ev.currentTarget.id)
        feature[ev.currentTarget.id] = ev.currentTarget.value;
        setFeature({...feature});
    }

    const saveFeature = (e)=>{
        e.preventDefault();
        console.log(feature);
        setLoading(true);
        setSuccess('');
        setError('');
        FeatureService.add(feature).then((res)=>{
            console.log(res)
            setSuccess(res.data.message);
            setLoading(false);
            props.history.push("/features");


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
                                <h3 className="mb-0">Ajout feature:</h3>
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
                                                                <Input required
                                                                       onChange={changeFeature}
                                                                       className="form-control-alternative"
                                                                       id="vehicleProfile"
                                                                       type="select">
                                                                    <option value="">...</option>

                                                                    {profiles.map((profile,i)=>{
                                                                        return(
                                                                            <option key={i} value={profile.name}>{profile.name}</option>
                                                                        )
                                                                    })
                                                                    }
                                                                </Input>
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

export default AddFeature;
