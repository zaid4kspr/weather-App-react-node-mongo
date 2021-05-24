import React, {
    useState, useEffect
} from "react";
import {Link, useParams} from "react-router-dom";
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

function ResetPassword(props, auth) {
    const{token} = useParams();
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const passwordChange = (e) => {
        setPassword(e.target.value);
    }
    const password2Change = (e) => {
        setPassword2(e.target.value);
    }

    const submit = (e) => {
        setError('');
        setSuccess('');
        if(password !== password2) {
            e.preventDefault();
            setError("Les champs de mot de passe ne sont pas identiques! veuillez réécrire votre nouveau mot de passe.");
            return;
        }
        setLoading(true);
        e.preventDefault();
        AuthService.resetPassword({token: token,password: password})
            .then((res) => {
                setSuccess(res.data.message);
                setLoading(false);
            }).catch((error) => {
            console.log(error.response.data.message)
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
                            <small > Veuillez saisir votre nouveau mot de passe: </small> </div> <Form onSubmit = {
                        submit
                    }
                                                                                                  role = "form" >
                        <FormGroup >
                            <InputGroup className = "input-group-alternative" >
                                <InputGroupAddon addonType = "prepend" >
                                    <InputGroupText >
                                        <i className = "ni ni-lock-circle-open" />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input required minLength = "6"
                                       onChange = {
                                           passwordChange
                                       }
                                       placeholder = "Mot de passe"
                                       type = "password"
                                       autoComplete = "new-password" />
                            </InputGroup>
                        </FormGroup >
                        <FormGroup >
                            <InputGroup className = "input-group-alternative" >
                                <InputGroupAddon addonType = "prepend" >
                                    <InputGroupText >
                                        <i className = "ni ni-lock-circle-open" />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input required minLength = "6"
                                       onChange = {
                                           password2Change
                                       }
                                       placeholder = "Vérification du mot de passe"
                                       type = "password"
                                       autoComplete = "new-password" />

                            </InputGroup>
                        </FormGroup > {
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
                                Réinitialiser le mot de passe!
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


export default ResetPassword;
