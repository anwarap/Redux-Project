
import { useEffect, useState } from "react";
import { Button, Container, Form, Table, Modal, Row, Col } from "react-bootstrap";
import { useDeleteUserMutation, useGetUsersDataMutation } from "../slices/adminApiSlice";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const UsersListScreen = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [data, setData] = useState(true);
    const [deleteUserId, setDeleteUserId] = useState(null);

    const [getUsersData, { isLoading }] = useGetUsersDataMutation(); 
    const [deleteUser] = useDeleteUserMutation();

    useEffect(() => {
        async function fetchUser() {
            const res = await getUsersData().unwrap("");
            setUsers(res.user);
        }
        fetchUser();
    }, [data, getUsersData]);

    const filteredUsers = users.filter(user => {
        const userName = user.name.toLowerCase();
        const searchValue = search.toLowerCase();
        return userName.includes(searchValue);
    });

    const showDeleteConfirmation = (id) => {
        setDeleteUserId(id);
    };

    const confirmDelete = async () => {
        console.log(deleteUserId,'deleteUserId')
        if (deleteUserId) {
          const user=  await deleteUser(deleteUserId).unwrap("");
          console.log(user,'user')
            setData(prevData => !prevData);
            setDeleteUserId(null);
            console.log('clicked')
        }
    };

    const closeConfirmationModal = () => {
        setDeleteUserId(null);
    };

    return (
        <Container>
            <Row>
                <Col style={{marginTop:'43px', display: 'flex',
    justifyContent: 'end',
    position: 'relative',
    left: '163px'}}>
                <Link to='/admin/users/add'>
                <Button className="btn-primary rounded-5 mt-4" >
                Add User</Button>
            </Link>
                </Col>
                <Col style={{marginTop:'20px',display: 'flex',
           justifyContent: 'end'}}>
           
            <Form.Group className="mt-3 mt-5 d-flex align-items-center" controlId="searchForm">

<Form.Label className="me-3"></Form.Label>
<Form.Control
    style={{ width: "28vw", marginBottom: "10px" }}
    type="text"
    placeholder="Search"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
/>
</Form.Group>
                </Col>
            </Row>
            {isLoading && <div style={{display:'flex',justifyContent:'center'}}><Loader /></div>}
            <div className="table-responsive">
                <Table striped bordered hover className="mt-5">
                    <thead>
                        <tr>
                            <th style={{textAlign:'center'}}>#</th>
                            <th style={{textAlign:'center'}}>Name</th>
                            <th style={{textAlign:'center'}}>Email</th>
                            <th style={{textAlign:'center'}}> Delete</th>
                            <th style={{textAlign:'center'}}>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users &&
                            filteredUsers.map((user, index) => (
                                <tr key={index}>
                                    <td style={{textAlign:'center'}}>{index + 1}</td>
                                    <td style={{textAlign:'center'}}>{user.name}</td>
                                    <td style={{textAlign:'center'}}>{user.email}</td>
                                    <td style={{textAlign:'center'}}>
                                        <Button className="btn-danger" onClick={() => showDeleteConfirmation(user._id)}>Delete</Button>
                                    </td>
                                    <td style={{textAlign:'center'}}>
                                        <Link to={`/admin/users/update/${user._id}`}><Button className="btn-success">Update</Button></Link>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </div>

            {/* Modal for delete confirmation */}
            <Modal show={deleteUserId !== null} onHide={closeConfirmationModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeConfirmationModal}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UsersListScreen;