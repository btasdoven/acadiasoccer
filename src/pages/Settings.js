import React from "react";
import { Card, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFirestoreUser } from "../context/UserContext";

function Dashboard() {
  const { user } = useFirestoreUser();

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
    >
      <div className="w-100 page-container">
        <h2 className="mb-3">Settings</h2>
        <Card className="page-card">
          <Card.Body>
            <Card.Text>
              <strong>Email: </strong> {user.name} <br />
              <strong>Email: </strong> {user.name} <br />
              <strong>Email: </strong> {user.name} <br />
              <strong>Email: </strong> {user.name} <br />
              <strong>Email: </strong> {user.name} <br />
              <strong>Email: </strong> {user.name} <br />
            </Card.Text>
            <Button className="mt-2" as={Link} to="/update-profile" variant="primary">Action</Button>
          </Card.Body>
        </Card>
        <Card className="page-card mt-4">
          <Card.Body>
            <Card.Text>
              <strong>Email: </strong> {user.name} <br />
            </Card.Text>
            <Button className="mt-2" as={Link} to="/update-profile" variant="primary">Action</Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Dashboard;
