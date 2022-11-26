import React from "react";
import { Link, useParams } from 'react-router-dom';
import { Container, Button, ListGroup, Spinner, Card, Badge, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useFirestoreUser } from "../context/UserContext";
import { doc, arrayUnion, arrayRemove, Timestamp, runTransaction } from 'firebase/firestore';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import Moment from 'react-moment'
import moment from 'moment-timezone'
import GameThumbnail from "../components/GameThumbnail";

const fmtTime = (ts, fmt) => {
  return moment.tz(moment.unix(ts), 'America/Vancouver').format(fmt);
}

function GameDetails() {
  let { cid } = useParams();
  const { authUser } = useAuth();
  const { user } = useFirestoreUser();
  const firestore = useFirestore();

  const ref = doc(firestore, `games/${cid}`);
  const { data: game } = useFirestoreDocData(ref);

  const loading = !game;
  const [actionInProgress, setActionInProgress] = React.useState(false);
  
  const alreadyRegistered = game && game.players.some(p => p.id === user.id);
  const isGameFull = game && game.players.length === game.maxPlayers + game.maxSubs;
  const registrationsStarted = game && moment.unix(game.registrationStartDate.seconds).utc().isBefore(moment.utc())
  const registrationsLate = game && game.registrationLateDate && moment.unix(game.registrationLateDate.seconds).utc().isBefore(moment.utc())
  const registrationsEnded = game && moment.unix(game.registrationEndDate.seconds).utc().isBefore(moment.utc())
  const isAuthUserOrganizer = authUser && game && authUser.uid === game.organizerId;

  const handleShowCustomerAddModal = async () => {
    const me = {id: user.id, name: user.name};
    const hist = alreadyRegistered ? `${user.name} unregistered.` : `${user.name} registered for the game.`;
    
    setActionInProgress(true);
    
    await runTransaction(firestore, async (transaction) => {
      const gameRef = await transaction.get(ref);
      const gameData = gameRef.data();

      if (!alreadyRegistered && gameData.players.length === gameData.maxPlayers + gameData.maxSubs) {
        return Promise.reject("Sorry, game is already full :(");
      }

      transaction.update(ref, {
        players: alreadyRegistered ? arrayRemove(me) : arrayUnion(me),
        history: arrayUnion({description: hist, date: Timestamp.now()}),
        lateCancellations: alreadyRegistered && registrationsLate ? arrayUnion(me) : arrayRemove(me), 
      });
    });
    
    setActionInProgress(false);
  };

  const handleOnPayment = (id) => async () => {
    await runTransaction(firestore, async (transaction) => {
      const gameRef = await transaction.get(ref);
      const gameData = gameRef.data();
      const alreadyChecked = gameData.payments && gameData.payments.includes(id)
      transaction.update(ref, {
        payments: alreadyChecked ? arrayRemove(id) : arrayUnion(id),
        // history: arrayUnion({description: hist, date: Timestamp.now()})
      });
    });
  };

  return (
    <Container
      className="pb-4 d-flex align-items-center justify-content-center"
    >
      <div className="w-100 page-container">
        <h2 className="mb-4">
          <Link to="/games">Games</Link> / {game && game.id}
        </h2>

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
            <Card className="page-card">
              <Card.Body>
                <Card.Text>
                  <strong>Date: </strong> Thursday 9:25 PM - 11:00 PM <br />
                  <strong>Place: </strong> UBC Turf Mini Fields with lights <br /><br />
                  All players pay <mark><b>$6</b></mark>. Please bring cash or e-transfer to <mark><b>{game.organizerEmail || "ghaffarisahand@gmail.com"}</b></mark>.<br /><br />
                  Cancellations after <mark><b>5:30 PM</b></mark> on the game night are subject to penalty. <br /><br />
                  Registration is not allowed if there are outstanding payments from previous weeks.
                </Card.Text>
              </Card.Body>
            </Card>

            {!registrationsStarted && 
              <div className="callout mlr-clear">
                <h5>Registration is not open yet.</h5>
                <p className="mb-0">
                  Registration will start on Tuesday at <mark><b>{fmtTime(game.registrationStartDate.seconds, 'h:mm A z')}</b></mark> and be open 
                  until <mark><b>{fmtTime(game.registrationEndDate.seconds, 'h:mm A z')}</b></mark> on Thursday. 
                </p>
              </div>
            }

            {registrationsStarted && !registrationsEnded && 
              <>
                <div className="callout-success mlr-clear">
                  <h5>Registration is now open.</h5>
                  <p className="mb-0">Registration will be closed on the game day at {fmtTime(game.registrationEndDate.seconds, 'h:mm A z')}.</p>
                </div>

                {!alreadyRegistered && isGameFull &&
                  <div className="callout mlr-clear">
                    <h5>Sorry, game is full :(</h5>
                    <p className="mb-0">Check back here later in case someone cancels their registration.</p>
                  </div>
                }

                {registrationsLate && alreadyRegistered &&
                  <div className="callout mlr-clear">
                    <h5>Late cancellation penalty is in place. </h5>
                    <p className="mb-0">If you are going to cancel your registration now, please note that you still have to pay for the game.</p>
                  </div>
                }

                <Button 
                  onClick={handleShowCustomerAddModal} 
                  variant={alreadyRegistered ? "danger" : isGameFull ? "secondary" : "primary"} 
                  disabled={actionInProgress || (!alreadyRegistered && isGameFull)}
                >
                  {actionInProgress && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="mr-2" />}
                  {alreadyRegistered ? "Cancel Registration" : "Register"}
                </Button>
              </>
            }
    
            {registrationsStarted && registrationsEnded && 
              <div className="callout-danger mlr-clear">
                <h5>Registration is currently closed for this game.</h5>
                {/* <p className="mb-0">Registration is currently closed for this game.</p> */}
              </div>
            }

            {game && game.lateCancellations && game.lateCancellations.length > 0 && 
              <>
                <h4 className="mt-4">Late Cancellations</h4>
                <ListGroup as="ol" numbered className="mlr-clear mt-2 mb-1">
                  {isAuthUserOrganizer &&
                    <ListGroup.Item as="div" className="d-flex justify-content-between align-items-center">
                      {<strong className="ml-4">Name</strong>}
                      {<strong>Tags</strong>}
                      {<strong>Paid?</strong>}
                    </ListGroup.Item>  
                  }
                  {Array.from(Array(game.lateCancellations).keys()).map(i => 
                    <ListGroup.Item key={i} as="li" className="d-flex justify-content-between align-items-center">
                      {game.lateCancellations[i] && 
                        <>
                          {game.lateCancellations[i].id === authUser.uid && <strong>{game.lateCancellations[i].name}</strong>}
                          {game.lateCancellations[i].id !== authUser.uid && game.lateCancellations[i].name}

                          {isAuthUserOrganizer && 
                            <Form.Check 
                              onChange={handleOnPayment(game.lateCancellations[i].id)} 
                              type="checkbox" 
                              checked={game.payments ? game.payments.includes(game.lateCancellations[i].id) : false}
                              className="ml-4 float-right" 
                              label=""
                            />}
                          {game.payments && game.payments.includes(game.lateCancellations[i].id) && <Badge className="float-right" text="light" bg="success" pill>Paid</Badge>}
                          {game.lateCancellations[i].id === game.organizerId && <Badge className="float-right" text="light" bg="info" pill>Organizer</Badge>}
                        </>
                      }
                    </ListGroup.Item>  
                  )}
                </ListGroup>
              </>
            }

            <h4 className="mt-4">Players</h4>
            {game && game.players &&
              <ListGroup as="ol" numbered className="mlr-clear mt-2 mb-1">
                {isAuthUserOrganizer &&
                  <ListGroup.Item as="div" className="d-flex justify-content-between align-items-center">
                    {<strong className="ml-4">Name</strong>}
                    {<strong>Tags</strong>}
                    {<strong>Paid?</strong>}
                  </ListGroup.Item>  
                }
                {Array.from(Array(game.maxPlayers).keys()).map(i => 
                  <ListGroup.Item key={i} as="li" className="d-flex justify-content-between align-items-center">
                    {game.players[i] && 
                      <>
                        {game.players[i].id === authUser.uid && <strong>{game.players[i].name}</strong>}
                        {game.players[i].id !== authUser.uid && game.players[i].name}

                        {isAuthUserOrganizer && 
                          <Form.Check 
                            onChange={handleOnPayment(game.players[i].id)} 
                            type="checkbox" 
                            checked={game.payments ? game.payments.includes(game.players[i].id) : false}
                            className="ml-4 float-right" 
                            label=""
                          />}
                        {game.payments && game.payments.includes(game.players[i].id) && <Badge className="float-right" text="light" bg="success" pill>Paid</Badge>}
                        {game.players[i].id === game.organizerId && <Badge className="float-right" text="light" bg="info" pill>Organizer</Badge>}
                      </>
                    }
                  </ListGroup.Item>  
                )}
              </ListGroup>
            }

            <h4 className="mt-4">Subs</h4>
            {game && game.players &&
              <ListGroup as="ol" numbered className="mlr-clear mt-2 mb-1">
                {isAuthUserOrganizer &&
                  <ListGroup.Item as="div" className="d-flex justify-content-between align-items-center">
                    {<strong className="ml-4">Name</strong>}
                    {<strong>Tags</strong>}
                    {<strong>Paid?</strong>}
                  </ListGroup.Item>  
                }
                {Array.from(Array(game.maxSubs).keys()).map(i => {
                  const idx = game.maxPlayers + i;
                  return (
                    <ListGroup.Item key={idx} as="li" className="d-flex justify-content-between align-items-center">
                      {game.players[idx] && 
                        <>
                          {game.players[idx].id === authUser.uid && <strong>{game.players[idx].name}</strong>}
                          {game.players[idx].id !== authUser.uid && game.players[idx].name}

                          {isAuthUserOrganizer && 
                            <Form.Check 
                              onChange={handleOnPayment(game.players[idx].id)} 
                              type="checkbox" 
                              checked={game.payments ? game.payments.includes(game.players[idx].id) : false}
                              className="ml-4 float-right" 
                              label=""
                            />}
                          {game.payments && game.payments.includes(game.players[idx].id) && <Badge className="float-right" text="light" bg="success" pill>Paid</Badge>}
                          {game.players[idx].id === game.organizerId && <Badge className="float-right" text="light" bg="info" pill>Organizer</Badge>}
                        </>
                      }
                    </ListGroup.Item>
                  )}
                )}
              </ListGroup>
            }

            <h4 className="mt-4">Share</h4>
            {game && <GameThumbnail players={game.players}/>}

            <h4 className="mt-4">History</h4>
            {game && game.history && registrationsStarted &&
              <ListGroup variant="flush" className="app-timeline mt-2 mb-1">
                {game.history.sort((a, b) => a.date >= b.date ? 1 : -1).map((i, idx) => {
                  return (
                    <ListGroup.Item className="app-timeline-li" key={i.date.seconds + '_' + i.date.nanoseconds + '_' + idx} >
                      <small><Moment unix format="M/D h:mm A" className="text-secondary mr-4">{i.date.seconds}</Moment></small>
                      {i.description} 
                    </ListGroup.Item>  
                  )
                }
                )}
              </ListGroup>
            }
          </>
        }
      </div>
    </Container>
  );
}

export default GameDetails;
