import { Container, Row } from "reactstrap"

function AuthFooter() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <div className="credits ml-auto">
            <div className="copyright">
              &copy; {new Date().getFullYear()}, fait avec <i className="fa fa-heart heart" /> par Votre Nom
            </div>
          </div>
        </Row>
      </Container>
    </footer>
  )
}

export default AuthFooter
