import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUpdateUserMutation, useUpdateUserDataMutation } from "../slices/adminApiSlice";
import { Button, Form } from "react-bootstrap";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes ,faCheck } from '@fortawesome/free-solid-svg-icons';

const AdminUserUpdate = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);

    const navigate = useNavigate();

    const [getUpdateUser] = useGetUpdateUserMutation();
    const [updateUserData, { isLoading }] = useUpdateUserDataMutation();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("file", image);

    useEffect(() => {
        async function fetchUser(id) {
            const res = await getUpdateUser(id);
            const data = res.data;
            setUserData(data);
            setName(data.name);
            setEmail(data.email);
        }
        fetchUser(id);
    }, [id, getUpdateUser]);
  
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

      const submitHandler = async (e) => {
        e.preventDefault();
      
        if (
          name.trim().length === 0 
          
        ) {
          toast.error("Fields can't be empty");
          return;
        }

        if (
          !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ) {
          return toast.error("Please enter a valid email address!");
        }
      
        if(password){
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
        }
       
        if (password !== confirmPassword) {
          toast.error('Passwords do not match.');
          return;
        }
      
        try {
            await updateUserData(formData).unwrap("");
            toast.success('Profile updated!');
            navigate('/admin/users');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
      };



    return (
        <div>
            <FormContainer>
                <h1 className="text-center">Update User</h1>
                {userData && (
                    <Form onSubmit={submitHandler} >
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

                        <Form.Group className="my-2" controlId="imageUpload">
                            <Form.Label>Image Upload</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            >
                            </Form.Control>
                        </Form.Group>
                        {isLoading && <Loader />}
                        <Button type="submit" variant="primary" className="mt-3">
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>

        </div>
    );
};

export default AdminUserUpdate;