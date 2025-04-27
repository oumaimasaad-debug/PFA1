import { Card, CardHeader, CardBody, Row, Col, Button, Container } from "reactstrap";

function Mod() {
  return (
    <>
      <div className="content d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <Card className="card-glass shadow-lg text-center">
                <CardHeader>
                  <h5 className="title gradient-text">Available Models</h5>
                  <div className="gradient-border"></div>
                </CardHeader>
                <CardBody>
                  <Row className="justify-content-center">
                    <Col md="5" className="mb-3">
                      <Button
                        className="btn-lg bg-gradient-danger text-white hover-scale shadow-lg"
                        block
                        href="https://e5c7a691335c69179c.gradio.live"
                        target="_blank"
                      >
                        <i className="tim-icons icon-bulb-63 mr-2" /> DeFocus
                      </Button>
                    </Col>
                    <Col md="5">
                      <Button
                        className="btn-lg bg-gradient-success text-white hover-scale shadow-lg"
                        block
                        href="https://e5c7a691335c69179c.gradio.live"
                        target="_blank"
                      >
                        <i className="tim-icons icon-atom mr-2" /> Flux
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Mod;
