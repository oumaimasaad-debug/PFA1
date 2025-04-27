import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Container
} from "reactstrap";
import "./Dashboard.css"; // Ajout d'un fichier CSS pour le style

function Dashboard() {
  return (
    <div className="content dashboard-background">
      <Container fluid>

        {/* About Us Section */}
        <Row className="mb-4">
          <Col md="12">
            <Card className="card-user shadow hover-effect">
              <CardBody>
                <CardTitle tag="h3" className="text-center mb-3 text-info">
                  Welcome to Jase
                </CardTitle>
                <p className="description text-center">
                  At <strong>Jase</strong>, we empower developers, researchers, and businesses 
                  by generating synthetic datasets from simple text descriptions or by enhancing existing datasets.
                  <br /><br />
                  Powered by cutting-edge <strong>Text-to-Image</strong> and <strong>Image-to-Image</strong> models,
                  we deliver ultra-high-resolution outputs tailored for your AI training needs.
                  <br /><br />
                  Join us and elevate your AI projects with the finest synthetic data technology.
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Features Section */}
        <Row className="mb-4">
          <Col md="4">
            <Card className="card-stats shadow hover-effect">
              <CardBody className="text-center">
                <div className="icon icon-shape bg-info text-white rounded-circle mb-3 big-icon">
                  <i className="tim-icons icon-image-02" />
                </div>
                <CardTitle tag="h5" className="text-info">Text-to-Image</CardTitle>
                <p className="description">
                  Generate synthetic images from any description with stunning realism and diversity.
                </p>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card className="card-stats shadow hover-effect">
              <CardBody className="text-center">
                <div className="icon icon-shape bg-primary text-white rounded-circle mb-3 big-icon">
                  <i className="tim-icons icon-image-02" />
                </div>
                <CardTitle tag="h5" className="text-primary">Image-to-Image</CardTitle>
                <p className="description">
                  Upload existing images and generate high-resolution variants, enriching your datasets.
                </p>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card className="card-stats shadow hover-effect">
              <CardBody className="text-center">
                <div className="icon icon-shape bg-success text-white rounded-circle mb-3 big-icon">
                  <i className="tim-icons icon-components" />
                </div>
                <CardTitle tag="h5" className="text-success">Full HD Resolution</CardTitle>
                <p className="description">
                  Obtain images at up to Full HD resolution, delivering unmatched quality for your AI models.
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Statistics Section */}
        <Row className="mt-4">
          <Col md="3">
            <Card className="card-stats text-center shadow hover-effect">
              <CardBody>
                <CardTitle tag="h2" className="text-primary">10,000+</CardTitle>
                <p className="description">Images Generated</p>
              </CardBody>
            </Card>
          </Col>

          <Col md="3">
            <Card className="card-stats text-center shadow hover-effect">
              <CardBody>
                <CardTitle tag="h2" className="text-success">99%</CardTitle>
                <p className="description">User Satisfaction</p>
              </CardBody>
            </Card>
          </Col>

          <Col md="3">
            <Card className="card-stats text-center shadow hover-effect">
              <CardBody>
                <CardTitle tag="h2" className="text-info">4K</CardTitle>
                <p className="description">Max Resolution</p>
              </CardBody>
            </Card>
          </Col>

          <Col md="3">
            <Card className="card-stats text-center shadow hover-effect">
              <CardBody>
                <CardTitle tag="h2" className="text-warning">5 min</CardTitle>
                <p className="description">Avg Generation Time</p>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  );
}

export default Dashboard;
