import React, { useState, useEffect } from "react";
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
  Col,
  Alert,
} from "reactstrap";
import AuthService from "./../../services/auth.service";

function Login(props) {
  useEffect(() => {
    if (AuthService.getUser()) {
      props.history.push("/");
    }
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailChange = (e) => {
    setEmail(e.target.value);
  };
  const passwordChange = (e) => {
    setPassword(e.target.value);
  };
  const register = (e) => {
      console.log("here i am");
    props.history.push("/auth/register");
};

  const submit = (e) => {
    setLoading(true);
    setError("");

    e.preventDefault();
    AuthService.login(email, password)
      .then((response) => {
        console.log(response);
        if (response.data.token) {
          localStorage.setItem("token", JSON.stringify(response.data.token));
        }
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        props.history.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
        setLoading(false);
      });
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="shadow border-0 no-radius">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="row my-3">
              <img
                className="login-logo mx-auto"
                alt="..."
                src={require("assets/img/brand/orange.jpg")}
              />
            </div>
            <div className="text-center text-muted mb-4">
              <small> Connectez - vous avec vos identifiants </small>{" "}
            </div>{" "}
            <Form onSubmit={submit} role="form">
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
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    required
                    minLength="6"
                    onChange={passwordChange}
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>{" "}
              {error && (
                <div className="text-center">
                  <Alert color="danger"> {error} </Alert>
                </div>
              )}
              <div className="text-center">
                <Button
                  disabled={loading}
                  className="my-4"
                  color="primary"
                  type="submit"
                >
                  Se connecter
                  {loading && (
                    <div
                      className="spinner-border spinner-border-sm text-light ml-3"
                      role="status"
                    ></div>
                  )}
                </Button>
                <div>
                Vous n'avez pas encore de compte?
                  <a
                    className="my-4 text-info pointer"
                    onClick={()=>register()}
                  >
                    
             Rejoignez Nous
                    {loading && (
                      <div
                        className="spinner-border spinner-border-sm text-light ml-3"
                        role="status"
                      ></div>
                    )}
                  </a>
                </div>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

export default Login;
