import React, { useState } from 'react';
import { Form, Modal, Button, Alert } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const FormikField = ({id, type, label, formik, ...rest}) => {
  return (
    <Form.Group className="mb-2">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        id={id}
        type={type}
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

function CustomerEditModal({ initialData, show, handleClose, handleSave }) {
  const [error, setError] = useState(undefined);
  const formik = useFormik({
    initialValues: {
      email: (initialData && initialData?.email) || '',
      mobile: (initialData && initialData?.mobile) || '',
      address: (initialData && initialData?.address) || '',
      surname: (initialData && initialData?.surname) || '',
      name: (initialData && initialData?.name) || '',
    },
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      name: Yup.string()
        .required('Required'),
      surname: Yup.string()
        .required('Required'),
      address: Yup.string()
        .required('Required'),
      mobile: Yup.string()
        .matches(/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/, 'Invalid phone number')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        setError(undefined);
        await handleSave({...values, id: initialData.id});
        formik.resetForm();
        handleClose();
      } catch (error) {
        setError(error.message);
      }
    },
  });

  const handleCloseInternal = () => {
    formik.resetForm();
    handleClose();
  };

  return (
      <Modal show={show} onHide={handleCloseInternal}>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
              <FormikField formik={formik} type="text" id="name" label="First Name" required autoFocus />
              <FormikField formik={formik} type="text" id="surname" label="Last Name" required />
              <FormikField formik={formik} type="text" id="address" label="Address" required />
              <FormikField formik={formik} type="email" id="email" label="E-mail Address" required />
              <FormikField formik={formik} type="text" id="mobile" label="Phone Number" required />
          </Modal.Body>
          <Modal.Footer>
            <Button 
              type="submit"
              variant={!formik.isValid || formik.isSubmitting ? "secondary" : "primary"}
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {formik.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
  );
}

export default CustomerEditModal;