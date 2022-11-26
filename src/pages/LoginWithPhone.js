import React, { useState, useRef } from "react";
import { Form, Container, Card, Button, Alert, Tab, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navigation from '../layout/Navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MaskedInput from "react-maskedinput";  

const useFocus = () => {
  const htmlElRef = useRef(null)
  const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

  return [ htmlElRef, setFocus ] 
}

const FormikFieldWithPrefix = React.forwardRef(({id, label, type, required, formik, ...rest}, ref) => {
  return (
    <Form.Group className="mt-2">
      <Form.Label>{label}</Form.Label>
      <InputGroup className="mb-3">
        <Form.Control
          id={id}
          ref={ref}
          type={type} 
          required={required}
          value={'+' + formik.values[id]} 
          onChange={(e) => {
            if (e.target.value && e.target.value.length > 0)
            {
              e.target.value = e.target.value.slice(1);
            }

            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched[id] && formik.errors[id]}
          isValid={formik.touched[id] && !formik.errors[id]}
          {...rest}
        ></Form.Control>
      </InputGroup>
      <Form.Control.Feedback type="invalid">
        {formik.errors[id]}
      </Form.Control.Feedback>
    </Form.Group>
  )
});

const FormikField = React.forwardRef(({id, label, type, required, formik, ...rest}, ref) => {
  return (
    <Form.Group className="mt-2">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        id={id}
        ref={ref}
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
});

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

function Login() {
  const { loginWithPhoneNumber } = useAuth();
  const [error, setError] = useState(undefined);
  const [step, setStep] = useState("step1");
  const [confirmationFn, setConfirmationFn] = useState(undefined);
  const [phoneNumberInputRef, setPhoneNumberInputFocus] = useFocus()
  const [verifCodeInputRef, setVerifCodeInputFocus] = useFocus()

  const formikStep1 = useFormik({
    initialValues: {
      phoneNumber: '',
    },
    validateOnMount: true,
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .min(6, 'Invalid phone number')
        .matches(/^[1-9][0-9]+$/, "Invalid phone number")
        .required('Required'),
    }),
    onSubmit: (values, formikBag) => {
      setError(undefined);
      loginWithPhoneNumber('+'+values.phoneNumber)
        .then((confirmFn) => {
          // console.log(confirmFn);
          setConfirmationFn(confirmFn)
          setStep("step2");
          formikBag.setSubmitting(false)
          setVerifCodeInputFocus();
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
          formikBag.setSubmitting(false)
          setPhoneNumberInputFocus();
        });
    },
  });

  const formikStep2 = useFormik({
    initialValues: {
      verificationCode: '',
    },  
    validateOnMount: true,
    validationSchema: Yup.object({
      verificationCode: Yup.string()
        .matches(/\d{6}/, 'Should contain 6 digits')
        .required('Required'),  
    }),
    onSubmit: async (values) => {
      try {
        setError(undefined);

        if (!confirmationFn) {
          setError("Confirmation was not sent. Go back to Step 1.")
        } else {
          await confirmationFn.confirm(values.verificationCode);
        }
      } catch (error) {
        setError(error.message);
      }
    },
  });

  // console.log(step, formikStep1);

  return (
    <>
      <Navigation brandOnly/>
      <Container
        className="d-flex align-items-center justify-content-center app-mh-100"
        style={{ position: 'absolute', top: 0, left: 0, minWidth: "100vw" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Tab.Container id="left-tabs-example" activeKey={step}>
            <Tab.Content>
              <Tab.Pane eventKey="step1">
                <Card>
                  <Card.Body>
                    <h2 className="text-center mb-4">Log In</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form id="form-step1" noValidate onSubmit={formikStep1.handleSubmit}>
                      <FormikFieldWithPrefix 
                        autoFocus
                        id="phoneNumber" 
                        label="Phone Number (Ex: +1 604 123 456)" 
                        className="phone-number-input"
                        ref={phoneNumberInputRef}
                        required 
                        inputMode='numeric'
                        formik={formikStep1} 
                      />
                      {/* <FormikButton id="sign-in-button" defaultText="Send Verification Code" submittingText="Sending..." formik={formikStep1} /> */}
                      <Button 
                        type="submit" 
                        onClick={formikStep1.handleSubmit}
                        id="sign-in-button"
                        className="w-100 mt-3" 
                        variant={!formikStep1.isValid || formikStep1.isSubmitting ? "secondary" : "primary"}
                        disabled={!formikStep1.isValid || formikStep1.isSubmitting}>
                        {formikStep1.isSubmitting ? "Sending..." : "Send Verification Code"}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="step2">
                <Card>
                  <Card.Body>
                    <h2 className="text-center mb-4">Enter Verification Code </h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form id="form-step2" noValidate onSubmit={formikStep2.handleSubmit}>
                      <FormikField 
                        ref={verifCodeInputRef}
                        id="verificationCode" 
                        label="" 
                        className="verif-code-input"
                        as={MaskedInput}
                        mask='111111'
                        type="text" 
                        required 
                        inputMode='numeric'
                        autoComplete="new-password"
                        formik={formikStep2} />
                      <FormikButton id="submit-btn-step2" defaultText="Log in" submittingText="Logging in..." formik={formikStep2} />
                    </Form>
                    <div className="text-center w-100 mt-3">
                      <Link onClick={() => { setStep("step1"); setError(undefined); setPhoneNumberInputFocus();}}>Back to Step 1</Link>
                    </div>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>
    </>
  );
}

export default Login;
