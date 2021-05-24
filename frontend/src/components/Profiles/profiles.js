import React , {useState,useEffect} from "react";
import { Link } from "react-router-dom";
import {

    Card,
    CardHeader,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Table,
    Container,
    Row,
    Col, UncontrolledAlert,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import FullPagination from "components/Helpers/FullPagination.js";
import ProfileService from "services/profile.service";

function Profiles (props) {
    
    const [profiles,setProfiles] = useState([]);
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');

    useEffect(()=>{
        ProfileService.getAll()
            .then(res => {
            setProfiles(res.data);
        }).catch(err=>{
            setError(err.message);
        })
    },[success]);

    const removeProfile = (id)=>{
        ProfileService.remove(id).then((res)=>{
            setSuccess(res.data.message)
        }).catch(err=>{
            setError(err.message);
        })
    }
       
    return (
      <>
    <Header />
        
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
                <Card className="shadow">
                    <CardHeader className="border-0">
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
                                <Link className="btn btn-success" to="/createprofile">Ajout Profil</Link>
                            </Col>
                        </Row>
                    </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Nom de profil</th>
                      <th scope="col">Type</th>
                      <th scope="col">Limite de zone</th>
                      <th scope="col">Prix de base</th>
                      <th scope="col">Prix par KM</th>
                      <th scope="col">Prix par minute</th>
                    <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
            {profiles.map((profile,i)=>{
        
        return(
                   <tr key={i}>
                        <td scope="row">
                            {profile.name}
                            </td>
                        <td scope="row">
                            {profile.type} 
                            </td>
                            <td scope="row">
                            {profile.radius}M 
                                </td>
                            <td scope="row">
                            {profile.basePrice} 
                                </td>
                            <td scope="row">
                            {profile.priceKm} 
                                </td>
                            <td scope="row">
                            {profile.priceMinute} 
                                </td>
                        <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#"
                            role="button"
                            size="sm"
                            color=""
                            onClick={e => e.preventDefault()}>
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem to={"/profiles/" + profile._id} tag={Link}>
                             Voir details
                            </DropdownItem>
                              <DropdownItem>
                                  <a onClick={ e => removeProfile(profile._id)}>Effacer</a>
                              </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
        )
    }
    )}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
}

export default Profiles;
