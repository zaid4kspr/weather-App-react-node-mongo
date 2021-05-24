import React , {useState,useEffect} from "react";
import {
    Card,
    CardHeader,
    Container,
    Row,
    Col,
    FormGroup,
    Input,
    Button,
    Form,
    UncontrolledAlert
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import AuthService from './../../services/auth.service';

function CashierProfile(props) {
    const [fleetUser, setFleetUser] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        if(AuthService.getUser()) {
            console.log(AuthService.getUser()._id)
            AuthService.getOne(AuthService.getUser()._id).then((res)=>{
                setFleetUser(res.data);
            }).catch((err)=>{
                setError(err.message);
            })
        }
        },[])

    const updateProfile = (e) => {
        e.preventDefault();
        setLoading(true);
        AuthService.update(fleetUser).then((res) => {
            console.log(res.data)
            if (res.data.data) {
                localStorage.setItem("user", JSON.stringify(res.data.data));
            }
            setSuccess(res.data.message);
            setLoading(false);
        }).catch(err => {
            console.log(err)
            setError(err.message);
            setLoading(false);

        })
    }
    const changeFleetUser = (e) => {
        fleetUser[e.currentTarget.id] = e.currentTarget.value;
        setFleetUser({...fleetUser});
    }

    return (
        <>
            <Header />

            <Container className = "mt--7" fluid >
                <Row>
                    <Col lg = "11" >
                        <Card className = "shadow bg-secondary" >
                            <CardHeader className = "border-0 bg-white" >
                                <h3 className = "mb-0" > Profil: </h3>
                            </CardHeader>
                            <div className = "pl-lg-4 mt-5" >
                                <Form className = "mt-5"
                                      onSubmit = {updateProfile}>
                                    <Row >
                                        <Col lg = "11" >
                                            <Row>
                                                <Col lg="4">
                                                    <FormGroup>
                                                        <label className = "form-control-label"
                                                               htmlFor = "firstName">
                                                            Prénom:
                                                        </label>
                                                        <Input defaultValue={fleetUser.firstName} onChange={changeFleetUser}
                                                               className="form-control-alternative"
                                                               id="firstName"
                                                               type="text">
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col lg = "4" >
                                                    <div className="d-block">
                                                        <FormGroup>
                                                            <label className = "form-control-label"
                                                                   htmlFor = "lastName">
                                                                Nom:
                                                            </label>
                                                            <Input defaultValue={fleetUser.lastName}
                                                                   required onChange={changeFleetUser}
                                                                   className="form-control-alternative"
                                                                   id="lastName"
                                                                   type="text">
                                                            </Input>
                                                        </FormGroup>
                                                    </div>
                                                </Col>
                                                <Col lg = "4" >
                                                    <FormGroup>
                                                        <label className = "form-control-label"
                                                               htmlFor = "email">
                                                            Email:
                                                        </label>
                                                        <Input defaultValue={fleetUser.email}
                                                               required onChange={changeFleetUser}
                                                               className="form-control-alternative"
                                                               id="email"
                                                               type="text">
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg = "4" >
                                                    <FormGroup>
                                                        <label className = "form-control-label"
                                                               htmlFor = "tel">
                                                            Téléphone:
                                                        </label>
                                                        <Input defaultValue={fleetUser.tel}
                                                               required onChange={changeFleetUser}
                                                               className="form-control-alternative"
                                                               id="tel"
                                                               type="text">
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col lg = "4" >
                                                    <FormGroup>
                                                        <label className = "form-control-label"
                                                               htmlFor = "password">
                                                            Mot de passe:
                                                        </label>
                                                        <Input onChange={changeFleetUser}
                                                               className="form-control-alternative"
                                                               id="password"
                                                               type="text">
                                                        </Input>
                                                    </FormGroup>
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
                                                        {  loading &&
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
export default CashierProfile;







