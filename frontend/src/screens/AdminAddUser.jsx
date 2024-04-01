import { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Form } from "react-bootstrap";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useAddNewUserMutation } from "../slices/adminApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes ,faCheck } from '@fortawesome/free-solid-svg-icons';



const AdminAddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const [addNewUser, { isLoading }] = useAddNewUserMutation();
  
  const isStrongPassword = (password) => {
    const rules = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        digit: /\d/.test(password),
        specialCharacter: /[\W_]/.test(password),
    };

    return rules;
};


  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if(name.trim().length === 0 ||
    email.trim().length === 0 ||
    password.trim().length === 0){
      toast.error("Fields can't be empty");
      return;
    }
  
  
    if (!isValidEmail(email)) {
      toast.error('Enter a valid email address.');
      return;
    }
  
     if (!isStrongPassword(password)) {
      toast.error('Enter a strong password.');
      return;
    }
  
    if (confirmPassword.trim().length === 0) {
      toast.error('Confirm Password is required.');
      return;
    } else if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
  
    try {
      await addNewUser({ name, email, password }).unwrap();
      navigate('/admin/users');
  
    } catch (err) {
      toast.error(err?.data?.message || err.error);
  
    }
  };
  
  return (
    <FormContainer>
      <h1 className="text-center">Add User</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
          </Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          >
          </Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          >
          </Form.Control>
          <div className="password-strength">
  {password.length >= 1 && (
    <div className={`strength-rule ${isStrongPassword(password).length ? 'valid' : ''}`}>
      {isStrongPassword(password).length ? (
        <FontAwesomeIcon icon={faCheck} className="valid" />
      ) : (
        <FontAwesomeIcon icon={faTimes} />
      )}
      <span className="text" style={{ marginLeft: '8px' }}>At least 8 characters</span>
    </div>
  )}

  {password.length >= 1 && (
    <div className={`strength-rule ${isStrongPassword(password).lowercase ? 'valid' : ''}`}>
      {isStrongPassword(password).lowercase ? (
        <FontAwesomeIcon icon={faCheck} className="valid" />
      ) : (
        <FontAwesomeIcon icon={faTimes} />
      )}
      <span className="text" style={{ marginLeft: '8px' }}>At least one lowercase letter</span>
    </div>
  )}

  {password.length >= 1 && (
    <div className={`strength-rule ${isStrongPassword(password).uppercase ? 'valid' : ''}`}>
      {isStrongPassword(password).uppercase ? (
        <FontAwesomeIcon icon={faCheck} className="valid" />
      ) : (
        <FontAwesomeIcon icon={faTimes} />
      )}
      <span className="text" style={{ marginLeft: '8px' }}>At least one uppercase letter</span>
    </div>
  )}

  {password.length >= 1 && (
    <div className={`strength-rule ${isStrongPassword(password).digit ? 'valid' : ''}`}>
      {isStrongPassword(password).digit ? (
        <FontAwesomeIcon icon={faCheck} className="valid" />
      ) : (
        <FontAwesomeIcon icon={faTimes} />
      )}
      <span className="text" style={{ marginLeft: '8px' }}>At least one digit</span>
    </div>
  )}

  {password.length >= 1 && (
    <div className={`strength-rule ${isStrongPassword(password).specialCharacter ? 'valid' : ''}`}>
      {isStrongPassword(password).specialCharacter ? (
        <FontAwesomeIcon icon={faCheck} className="valid" />
      ) : (
        <FontAwesomeIcon icon={faTimes} />
      )}
      <span className="text" style={{ marginLeft: '8px' }}>At least one special character</span>
    </div>
  )}
</div>

        </Form.Group>

        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          >
          </Form.Control>
        </Form.Group>

        {isLoading && <Loader />}

        <Button type="submit" variant="primary" className="mt-3">
          Add User
        </Button>

      </Form>
    </FormContainer>
  );
};

export default AdminAddUser;