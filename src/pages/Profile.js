import React from "react";
import { Card, Container, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useFirestoreUser } from "../context/UserContext";

function Dashboard() {
  const { logout, authUser } = useAuth();
  const { user } = useFirestoreUser();
  
  const handleLogout = async () => {
      await logout();
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
    >
      <div className="w-100 page-container">
        <h2 className="mb-3">Profile</h2>
        <Card className="page-card">
          <Card.Body>
            <Card.Text>
              <strong>Name: </strong> {user.name} <br />
              <strong>Email: </strong> {user.email} <br />
              <strong>Phone Number: </strong> {authUser.phoneNumber} <br />

              <Button className="mt-4" onClick={handleLogout} variant="danger">Logout</Button>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Dashboard;
