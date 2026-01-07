"use client"
import { Container, Row, Col, Nav, Tab } from "react-bootstrap";
import LedgerTab from "./LedgerTab";
import GroupTab from "./GroupTab";
import SizingTab from "./SizingTab";
import YarnTab from "./YarnTab";
import ClothTab from "./ClothTab";

const MasterManager = () => {
  return (
    <Container className="mt-4">
      <h5 className="mb-4">Masters</h5>

      <Tab.Container defaultActiveKey="ledgers">
        <Row>
          <Col sm={12}>
            <Nav variant="pills" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="ledgers">Weaver Ledgers</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="groups">Account Groups</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="sizings">Sizings</Nav.Link>{" "}
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="yarn">Yarn</Nav.Link>{" "}
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="cloth">Cloth</Nav.Link>{" "}
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        <Tab.Content>
          <Tab.Pane eventKey="ledgers">
            <LedgerTab />
          </Tab.Pane>
          <Tab.Pane eventKey="groups">
            <GroupTab />
          </Tab.Pane>
          <Tab.Pane eventKey="sizings">
            <SizingTab />
          </Tab.Pane>
          <Tab.Pane eventKey="cloth">
            <ClothTab />
          </Tab.Pane>
          <Tab.Pane eventKey="yarn">
            <YarnTab />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default MasterManager;
