
import React , {useState,useEffect} from "react";
import { Link } from "react-router-dom";

// reactstrap components
import {
    Badge,
    Card,
    CardHeader,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Table,
    Container,
    Row,
    Col, FormGroup, Input, UncontrolledAlert
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import FeatureService from "./../../services/feature.service";

function Features(props) {

    const [features,setFeatures] = useState([]);
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');

    useEffect(()=>{
        FeatureService.getAll()
            .then(res => {
                console.log(res.data)
                setFeatures(res.data);
            })
            .catch(err=>{
                console.log(err)
            })
    },[success]);

    const removeFeature = (e,id)=>{
        setSuccess('');
        setError('');
        FeatureService.remove(id)
            .then(res => {
                console.log(res.data)
                setSuccess(res.data.message);
            })
            .catch(err=>{
                console.log(err)
                setSuccess(err.response.data.message);
            })

    }


    return (
        <>
            <Header />

            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <Col lg="12">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Features</h3>
                                    <Row>
                                        <Col lg="6">
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
                                            <Link className="btn btn-success" to="/newfeature">Ajout feature</Link>
                                        </Col>
                                    </Row>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col">Profil</th>
                                    <th scope="col">Feature</th>
                                    <th scope="col">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {features.map((feature,i)=>{
                                    return(
                                        <tr key={i}>
                                            <td scope="row">
                                                {feature.vehicleProfile}
                                            </td>
                                            <td>
                                                {feature.name}
                                            </td>
                                            <td className="text-right">
                                                <UncontrolledDropdown>
                                                    <DropdownToggle
                                                        className="btn-icon-only text-light"
                                                        href="#"
                                                        size="sm"
                                                        color=""
                                                        onClick={e => e.preventDefault()}
                                                    >
                                                        <i className="fas fa-ellipsis-v" />
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-arrow" right>
                                                        <DropdownItem to={"/features/" + feature._id} tag={Link}>
                                                            Voir details
                                                        </DropdownItem>
                                                        <DropdownItem>
                                                            <a onClick={e => removeFeature(e,feature._id)}> Supprimer</a>
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Features;
