import React, { useState } from "react";
import { Form, Container, Card, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navigation from '../layout/Navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Login() {
  const { login } = useAuth();
  const [error, setError] = useState(undefined);
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validateOnMount: true,
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        setError(undefined);
        await login(values.email, values.password);
      } catch (error) {
        setError(error.message);
      }
    },
  });

  return (
    <>
      <Navigation brandOnly/>
      <Container
        className="d-flex align-items-center justify-content-center app-mh-100"
        style={{ position: 'absolute', top: 0, left: 0, minHeight: "100vh", minWidth: "100vw" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Log In</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form noValidate onSubmit={formik.handleSubmit}>
                <Form.Group className="mt-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    id="email"
                    type="email" 
                    required 
                    value={formik.values.email} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.email && formik.errors.email}
                    isValid={formik.touched.email && !formik.errors.email}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    id="password"
                    type="password"
                    required
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.password && formik.errors.password}
                    isValid={formik.touched.password && !formik.errors.password}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button 
                  type="submit" 
                  className="w-100 mt-3" 
                  variant={!formik.isValid || formik.isSubmitting ? "secondary" : "primary"}
                  disabled={!formik.isValid || formik.isSubmitting}>
                  {formik.isSubmitting ? "Logging in..." : "Log in"}
                </Button>
              </Form>
              <div className="text-center w-100 mt-3">
                <Link to="/forget-password">Forget password?</Link>
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
