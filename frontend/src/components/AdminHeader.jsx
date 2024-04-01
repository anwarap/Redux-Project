import { Navbar, Nav, Container,Modal, Button ,NavDropdown} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../slices/authSlice';
import { useAdminLogoutMutation } from '../slices/adminApiSlice';
import { useState } from 'react';

const AdminHeader = () => {
    const { adminInfo } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [adminLogoutApi] = useAdminLogoutMutation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleShowLogoutModal = () => {
      setShowLogoutModal(true);
    };
    
    const handleCloseLogoutModal = () => {
      setShowLogoutModal(false);
    };
    
    const logoutHandler = async () => {
        try {
            await adminLogoutApi().unwrap();
            dispatch(adminLogout());
            navigate('/admin');
            handleCloseLogoutModal();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <header>
            <Navbar variant='dark' expand='lg' collapseOnSelect style={{background:'#4169E1'}}>
                <Container>
                    <LinkContainer to='/admin'>
                        <Navbar.Brand><h2>ADMIN</h2></Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto d-flex align-items-lg-center'>
                            {!adminInfo ? (
                                <>
                                    <LinkContainer to='/admin/login'>
                                        <Nav.Link >
                                            Login
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            ) : (
                                <>
                                  <NavDropdown title={adminInfo.email} id='username'>
                                     <div>
                                     <LinkContainer to='/admin/users'>
                                    <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                     </div>

                                   <NavDropdown.Item onClick={handleShowLogoutModal}>Logout</NavDropdown.Item>
                                </NavDropdown>

                                </>
                            )}

                        </Nav>
                    </Navbar.Collapse>
                    <Modal show={showLogoutModal} onHide={handleCloseLogoutModal}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Logout</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to log out?</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseLogoutModal}>
      Cancel
    </Button>
    <Button variant="primary" onClick={logoutHandler}>
      Logout
    </Button>
  </Modal.Footer>
</Modal>
                </Container>
            </Navbar>
        </header >
    );
};

export default AdminHeader;