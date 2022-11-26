import React, { useState } from "react";
import { Form, Container, Card, Button, Alert } from "react-bootstrap";
import Navigation from '../layout/Navigation';
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import * as Yup from 'yup';

function Signup() {
  const { signup } = useAuth();
  const [error, setError] = useState(undefined);
  const firestore = useFirestore();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validateOnMount: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(4, 'Must be at least 4 characters')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, // eslint-disable-line
          "Must contain at least one uppercase, one lowercase, one number and one special case character"
        )
        .required('Required'),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        setError(undefined);
        const authUser = await signup(values.email, values.password);
        const ref = doc(firestore, `users`, authUser.user.uid);
        await setDoc(ref, {
          ...values,
          id: ref.id,
          joinedAt: authUser.user.metadata.createdAt,
        });

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
        style={{ position: 'absolute', top: 0, left: 0, minWidth: "100vw" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form noValidate onSubmit={formik.handleSubmit}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    id="name"
                    type="text" 
                    required 
                    value={formik.values.name} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.name && formik.errors.name}
                    isValid={formik.touched.name && !formik.errors.name}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
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
                <Form.Group>
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
                <Form.Group>
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control
                    id="passwordConfirm"
                    type="password"
                    required
                    value={formik.values.passwordConfirm}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
                    isValid={formik.touched.passwordConfirm && !formik.errors.passwordConfirm}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.passwordConfirm}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button 
                  type="submit" 
                  className="w-100 mt-3" 
                  variant={!formik.isValid || formik.isSubmitting ? "secondary" : "primary"}
                  disabled={!formik.isValid || formik.isSubmitting}>
                  {formik.isSubmitting ? "Signing up..." : "Sign up"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="text-center w-100 mt-2">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Signup;
