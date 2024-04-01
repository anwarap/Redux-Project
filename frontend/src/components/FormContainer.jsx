import {Container,Row,Col} from 'react-bootstrap'

const FormContainer = (Props) => {
  return (
    <Container>
      <Row className='justify-content-md-center mt-5'>
        <Col xs={12} md={6} className='card p-5 shadow'>
          { Props.children }
        </Col>
      </Row>
    </Container>
  )
}

export default FormContainer
