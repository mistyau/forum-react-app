import ThreadList from "./ThreadList";
import TopTagsList from "./TopTagsList";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";

export default function Home({ user }) {

    return (
        <Container fluid className="homepage">
            <Row>
                <Col xl={9}>
                    <ThreadList user={user} />
                </Col>
                <Col xl={3} className="d-none d-md-block">
                    <Container fluid className="right-button">
                        <TopTagsList />
                    </Container>
                </Col>
            </Row>
        </Container>
        
    );
};