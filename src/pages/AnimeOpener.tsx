import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

//import ACRCloudAPI from "../ACRCloudAPI";
import AudioRecorder from '../AudioRecorder';

export function AnimeOpener() {
  return (
    <section>
            <Container fluid className="text-center position-absolute top-50 start-50 translate-middle">
              <Row>
                <h1>
                  <AudioRecorder />
                </h1>
              </Row>
            </Container>
      </section>
  )
}