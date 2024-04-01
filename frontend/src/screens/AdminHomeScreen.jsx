import { Container, Card} from 'react-bootstrap';
const AdminHomeScreen = () => {
    return (
      <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
          <h2 className='text-center mb-4'>Welcome Admin</h2>
          <img
            src={'https://www.multidots.com/wp-content/uploads/2020/01/code-quality-standard.png?quality=90'} 
            alt='image'
            style={{
              width: '400px',
              height: '230px',
            }}
            className=""
          />
       
        </Card>
      </Container>
    </div>
    );
  };
  
  export default AdminHomeScreen;