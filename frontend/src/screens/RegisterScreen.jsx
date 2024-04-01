import React,{useState,useEffect} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {Form,Button,Row,Col} from 'react-bootstrap';
import { useDispatch,useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes ,faCheck } from '@fortawesome/free-solid-svg-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';



const RegisterScreen = () => {
    const [email,setEmail] = useState('')
    const [name,setName] = useState('')
    const [password,setPassword ] = useState('')
    const [confirmPassword,setConfirmPassword ] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false);

    const navigate = useNavigate();
    const dispatch  = useDispatch();

    const {userInfo} = useSelector((state)=>state.auth)
    const [register, {isLoading}] = useRegisterMutation();

    useEffect(()=>{
      if(userInfo){
        navigate('/')
      }
    },[navigate,userInfo])

    const passwordStyles = {
      passwordInput: {
        position: 'relative'
      },
      passwordToggle: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        right: '10px',
        cursor: 'pointer'
      }
    };
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
    

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
      

    
      if (name.trim().length === 0) {
        toast.error('Name is required.');
        return;
      }
    
      if (email.trim().length === 0) {
        toast.error('Email is required.');
        return;
      } else if (!isValidEmail(email)) {
        toast.error('Enter a valid email address.');
        return;
      }
    
      if (password.trim().length === 0) {
        toast.error('Password is required.');
        return;
      } else if (!isStrongPassword(password)) {
        toast.error('Enter a strong password.');
        return;
      }
      const passwordRules = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        digit: /\d/.test(password),
        specialCharacter: /[\W_]/.test(password),
      };
    
      if (!Object.values(passwordRules).every((rule) => rule)) {
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
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate('/');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    };
    
  
    return ( 
    <FormContainer>
      {isLoading && <Loader/>}
      <h1>Sign Up</h1>
     <Form onSubmit={submitHandler}>
       
     <Form.Group className="my-2" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e)=>{ setName(e.target.value)}}
        >
        </Form.Control>
      </Form.Group>

      <Form.Group className="my-2" controlId="email">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e)=>{ setEmail(e.target.value)}}
        >
        </Form.Control>
      </Form.Group>

      <Form.Group className="my-2" controlId="password">
        <Form.Label>Password</Form.Label>
        <div style={passwordStyles.passwordInput}>
        <Form.Control
         type={passwordVisible ? "text" : "password"}
        placeholder="Enter Password"
        value={password}
        onChange={(e)=>{ setPassword(e.target.value)}}
        />
          <div style={passwordStyles.passwordToggle} onClick={togglePasswordVisibility}>
      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
    </div>
  </div>
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
        onChange={(e)=>{ setConfirmPassword(e.target.value)}}
        >
        </Form.Control>
      </Form.Group>

      <Button type="submit" variant="primary" className="mt-3">
        Sign Up
      </Button>
      <Row className="py-3">
         <Col>
         Already Have An Account ?  <Link to='/login'>Login</Link>
         </Col>
      </Row>
     </Form>
    </FormContainer>
  )
}

export default RegisterScreen
