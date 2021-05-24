import React, {
    useState, useEffect
} from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
    Alert
} from "reactstrap";
import AuthService from './../../services/auth.service';

function ForgetPassword(props, auth) {
    useEffect(()=>{
        if(AuthService.getAdmin()) {
            props.history.push("/");
        }
    },[])
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const emailChange = (e) => {
        setEmail(e.target.value);
    }
    const submit = (e) => {
        setLoading(true);
        setError('');
        setSuccess('');
        e.preventDefault();
        AuthService.forgetPassword(email)
            .then((res) => {
                setSuccess(res.data.message);
                setLoading(false);
            }).catch((error) => {
            setError(error.response.data.message);
            setLoading(false);
        })
    }

    return (
        <>
            <Col lg = "5"
                 md = "7" >
                <Card className = "bg-secondary shadow border-0" >
                    <CardBody className = "px-lg-5 py-lg-5" >

                        <div className = "text-center text-muted mb-4" >
                            <small > Veuillez saisir l'adresse e-mail associée à votre compte: </small> </div> <Form onSubmit = {
                        submit
                    }
                                                                                                  role = "form" >
                        <FormGroup className = "mb-3" >
                            <InputGroup className = "input-group-alternative" >
                                <InputGroupAddon addonType = "prepend" >
                                    <InputGroupText >
                                        <i className = "ni ni-email-83" />

                                    </InputGroupText>
                                </InputGroupAddon >
                                <Input required onChange={emailChange}
                                       placeholder = "Email"
                                       type = "email"
                                       autoComplete = "new-email" />
                            </InputGroup>
                        </FormGroup >
                      {
                        error && < div className = "text-center" >
                            <Alert color = "danger" > {
                                error
                            } </Alert>
                        </div>
                    }
                        {
                            success && < div className = "text-center" >
                                <Alert color = "success" > {
                                    success
                                } </Alert>
                            </div>
                        }
                        <div className = "text-center" >
                            <Button disabled = {
                                loading
                            }
                                    className = "my-4"
                                    color = "primary"
                                    type = "submit" >
                                Valider
                                {  loading &&
                                <div className="spinner-border spinner-border-sm text-light ml-3" role="status">
                                </div>
                                }

                            </Button>
                        </div>
                    </Form>
                    </CardBody>
                </Card>
            </Col>
        </>

    );
}


export default ForgetPassword;
