import React, { useState } from "react";
import { Form, Container, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from 'reactfire';

const FormikField = ({id, label, type, required, formik, ...rest}) => {
  return (
    <Form.Group className="mt-2">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        id={id}
        type={type} 
        required={required}
        value={formik.values[id]} 
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isInvalid={formik.touched[id] && formik.errors[id]}
        isValid={formik.touched[id] && !formik.errors[id]}
        {...rest}
      ></Form.Control>
      <Form.Control.Feedback type="invalid">
        {formik.errors[id]}
      </Form.Control.Feedback>
    </Form.Group>
  )
}

const FormikButton = ({id, formik, defaultText, submittingText}) => {
  return (
    <Button 
      type="submit" 
      id={id}
      className="w-100 mt-3" 
      variant={!formik.isValid || formik.isSubmitting ? "secondary" : "primary"}
      disabled={!formik.isValid || formik.isSubmitting}>
      {formik.isSubmitting ? submittingText : defaultText}
    </Button>
  )
}

function UpdateProfile() {
  const [error, setError] = useState(undefined);
  const { authUser } = useAuth();
  const firestore = useFirestore();
  const ref = doc(firestore, `users/${authUser.uid}`);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validateOnMount: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'Too short')
        .required('Required'),
    }),
    onSubmit: (values, formikBag) => {
      setError(undefined);
      setDoc(ref, 
        {
          name: values.name,
          id: authUser.uid,
          joinedAt: authUser.metadata.createdAt
        })
        .then((res) => {
            formikBag.setSubmitting(false)
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
          formikBag.setSubmitting(false)
        });
    },
  });

  return (
    <>
      {/* <Navigation brandOnly/> */}
      <Container
        className="d-flex align-items-center justify-content-center app-mh-100"
        style={{ position: 'absolute', top: 0, left: 0, minWidth: "100vw" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Complete Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form id="form-step2" noValidate onSubmit={formik.handleSubmit}>
                <FormikField 
                  autoFocus
                  id="name" 
                  label="First and last name" 
                  type="text" 
                  required 
                  formik={formik} />
                <FormikButton defaultText="Save" submittingText="Saving..." formik={formik} />
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}

export default UpdateProfile;
