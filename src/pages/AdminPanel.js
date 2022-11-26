import React, { useState } from "react";
import { Container, Button, Spinner, Form, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useFirestoreUser } from "../context/UserContext";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import moment from 'moment-timezone'
import { Navigate } from "react-router-dom";
import * as Yup from 'yup';
import { useFormik } from 'formik';

function AdminPanel() {
  const { authUser } = useAuth();
  const { user } = useFirestoreUser();
  const firestore = useFirestore();
  const [error, setError] = useState(undefined);
  const [success, setSuccess] = useState(undefined);

  const loading = !authUser || !user;

  const handleNewGame = async ({ date: gameDate, maxPlayers, maxSubs }) => {

    // let gameDate = "2022-10-27";
    let regStartDate = moment(gameDate).add(-2, "days").format("yyyy-MM-DD");
    let regEndDate = gameDate;
    let organizerId = 'lBIUIcVvszNu2cGK0TwhBldZaqC3';
    let organizerEmail = 'ghaffarisahand@gmail.com';
    let organizerName = 'Sahand Ghaffari';
    let paymentPerPlayer = '6';

    if (moment(gameDate).utc().isBefore(moment.utc())) {
      throw new Error("Can't add a date from the past.");
    }
    
    const ref = doc(firestore, `games`, gameDate);
    const refData = await getDoc(ref);
    if (refData.exists()) {
      throw new Error("Can't add an existing game. Double check the date.");
    }

    await setDoc(ref, {
      history: [{
        date: moment.tz(`${regStartDate} 12:00`, 'America/Vancouver').toDate(),
        description: "Game is open for registration."
      }, {
        date: moment.tz(`${regStartDate} 12:00`, 'America/Vancouver').toDate(),
        description: "Sahand Ghaffari is automatically registered as the organizer."
      }],
      id: gameDate,
      maxPlayers: maxPlayers,
      maxSubs: maxSubs,
      organizerId: organizerId,
      organizerEmail: organizerEmail,
      paymentPerPlayer: paymentPerPlayer,
      payments: [],
      lateCancellations: [],
      players: [{id: organizerId, name: organizerName}],
      registrationStartDate: moment.tz(`${regStartDate} 12:00`, 'America/Vancouver').toDate(),
      registrationLateDate: moment.tz(`${regEndDate} 17:30`, 'America/Vancouver').toDate(),
      registrationEndDate:  moment.tz(`${regEndDate} 20:30`, 'America/Vancouver').toDate(),
    });
  };

  const formik = useFormik({
    initialValues: {
      date: '',
      maxPlayers: 20,
      maxSubs: 4,
    },
    validateOnMount: true,
    validationSchema: Yup.object({
      date: Yup.string()
        .min(4, 'Must be at least 4 characters')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        setError(undefined);
        setSuccess(undefined);
        await handleNewGame(values);
        setSuccess("Game is created successfully.");
      } catch (error) {
        setError(error.message);
      }
    },
  });

  if (!user.hidden) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container
      className="pb-4 d-flex align-items-center justify-content-center"
    >
      <div className="w-100 page-container">
        {loading && 
          <Container
            className="d-flex align-items-center justify-content-center app-mh-100"
            style={{ position: 'absolute', top: 0, left: 0, minWidth: "100vw" }}
          >
            <Spinner animation="border" variant="primary" />
          </Container>
        }

        {!loading && 
          <>
            <h2 className="mb-4">
              Create New Game
            </h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Group>
                <Form.Label>Game Date</Form.Label>
                <Form.Control
                  id="date"
                  type="text"
                  placeholder="2022-10-29" 
                  required 
                  value={formik.values.date} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.date && formik.errors.date}
                  isValid={formik.touched.date && !formik.errors.date}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Players</Form.Label>
                <Form.Control
                  id="maxPlayers"
                  type="number"
                  required 
                  value={formik.values.maxPlayers} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.maxPlayers && formik.errors.maxPlayers}
                  isValid={formik.touched.maxPlayers && !formik.errors.maxPlayers}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.maxPlayers}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Subs</Form.Label>
                <Form.Control
                  id="maxSubs"
                  type="number"
                  required 
                  value={formik.values.maxSubs} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.maxSubs && formik.errors.maxSubs}
                  isValid={formik.touched.maxSubs && !formik.errors.maxSubs}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.maxSubs}
                </Form.Control.Feedback>
              </Form.Group>
              <Button 
                type="submit" 
                className="mt-3" 
                variant={!formik.isValid || formik.isSubmitting ? "secondary" : "primary"}
                disabled={!formik.isValid || formik.isSubmitting}>
                {formik.isSubmitting ? "Creating..." : "Create New Game"}
              </Button>
            </Form>


            <h2 className="mb-4">
              All
            </h2>
          </>
        }
      </div>
    </Container>
  );
}

export default AdminPanel;
