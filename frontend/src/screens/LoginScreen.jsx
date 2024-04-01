import { useState,useEffect } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { Form,Button,Row,Col } from "react-bootstrap";
import {useDispatch,useSelector} from 'react-redux';
import FormContainer from "../components/FormContainer";
import {useLoginMutation} from '../slices/usersApiSlice';
import{setCredentials} from '../slices/authSlice'
import {toast} from 'react-toastify'
import Loader from "../components/Loader";
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const LoginScreen = () => {

  const [email,setEmail] = useState('')
  const [password,setPassword ] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch  = useDispatch();
  
  const [login, {isLoading}] = useLoginMutation();

  const {userInfo} = useSelector((state)=>state.auth)
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
  
  
  useEffect(()=>{
    if(userInfo){
      navigate('/')
    }
  },[navigate,userInfo])

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (email.trim().length === 0 || password.trim().length === 0) {
      toast.error('Enter valid data!');
    } else if (!isValidEmail(email)) {
      toast.error('Enter a valid email address.');
    } 
     else {
      try {
        const res = await login({ email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate('/');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  return ( 
  <FormContainer>
    <h1>Sign In</h1>
    {isLoading && <div style={{display:'flex',justifyContent:'center'}}><Loader/></div>}
   <Form onSubmit={submitHandler}>
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
    onChange={(e) => setPassword(e.target.value)}
  />
  <div style={passwordStyles.passwordToggle} onClick={togglePasswordVisibility}>
    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
  </div>
</div>
</Form.Group>


    <Button type="submit" variant="primary" className="mt-3">
      Sign In
    </Button>

    <Row className="py-3">
       <Col>
       New Customer ?  <Link to='/register'>Register</Link>
       </Col>
    </Row>
   </Form>
  </FormContainer>
)
}

export default LoginScreen