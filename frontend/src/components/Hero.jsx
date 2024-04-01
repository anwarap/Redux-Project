import { Container, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {useSelector} from 'react-redux';

const Hero = () => {

  const {userInfo} = useSelector((state)=>state.auth)
  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
          <h2 className='text-center mb-4'>Welcome {userInfo?userInfo.name:''}</h2>
       
          <img
            src={'https://dresma.ai/wp-content/uploads/2022/01/mern-stack-developer.gif'} 
            alt={userInfo?userInfo.name:''}
            style={{
              width: '310px',
              height: '170px', 
            }}
            className=""
          />

          {userInfo?'':
          
          <div className='d-flex' style={{marginTop: '15px'}}>
            <LinkContainer to='/login' >
            <Button variant='primary' className='me-3'>
              Sign In
            </Button>
            </LinkContainer>
            <LinkContainer to='/register'>
            <Button variant='secondary'>
              Signup
            </Button>
            </LinkContainer>
          </div>
          }
        </Card>
      </Container>
    </div>
  );
};

export default Hero;