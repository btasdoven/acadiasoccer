import React, { useRef, useState } from "react";
import { Form, Container, Card, Button, Alert } from "react-bootstrap";
import Navigation from '../layout/Navigation';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const emailRef = useRef(null);
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setLoading(true);
      setError("");
      await resetPassword(emailRef.current.value);
      setMessage("check your inbox for futher instructions");
    } catch (error) {
      setError("failed to reset password");
    }
    setLoading(false);
  };

  return (
    <>
      <Navigation brandOnly/>
      <Container
        className="d-flex align-items-center justify-content-center app-mh-100"
        style={{ position: 'absolute', top: 0, left: 0, minWidth: "100vw" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Password Reset</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" required ref={emailRef}></Form.Control>
                </Form.Group>
                <Button type="submit" className="w-100 mt-3" disabled={loading}>
                  Reset password
                </Button>
              </Form>
              <div className="text-center w-100 mt-3">
                <Link to="/login">Log In</Link>
              </div>
            </Card.Body>
          </Card>
          <div className="text-center w-100 mt-2">
            Not registered yet? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Login;
