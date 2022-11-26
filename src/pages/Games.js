import { Container, ListGroup, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { collection } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { useFirestoreUser } from "../context/UserContext";
import moment from 'moment-timezone'

function Customers() {
  const navigate = useNavigate();
  const firestore = useFirestore();
  const { user } = useFirestoreUser();

  const ref = collection(firestore, `games`);
  const { data: games } = useFirestoreCollectionData(ref);

  const showHiddenGames = user && user.hidden;

  const handleOnClick = (id) => () => {
    navigate(`/games/${id}`)
  };

  return (
    <Container
      className="pb-4 d-flex align-items-center justify-content-center"
    >
      <div className="w-100 page-container">
        <h2 className="mb-3">Games</h2>

        {games &&
          <ListGroup className="mt-4 mlr-clear">
            {games.filter(g => showHiddenGames || g.hidden !== true).sort((a, b) => a.id < b.id ? 1 : -1).map(game => { 

              const registrationsStarted = game && moment.unix(game.registrationStartDate.seconds).utc().isBefore(moment.utc())
              const registrationsEnded = game && moment.unix(game.registrationEndDate.seconds).utc().isBefore(moment.utc())
              const registrationState = 
                (registrationsStarted && registrationsEnded) ? "Closed" :
                  (registrationsStarted && !registrationsEnded) ? "Open" : "Opens " + moment.utc().to(moment.unix(game.registrationStartDate.seconds).utc()); 
              const registrationColor = 
                (registrationsStarted && registrationsEnded) ? "danger" :
                  (registrationsStarted && !registrationsEnded) ? "success" : "info"; 

              return (
                <ListGroup.Item 
                  key={game.id} 
                  onClick={handleOnClick(game.id)}
                  className="d-flex justify-content-between align-items-center"
                >
                  {game.id}

                  <div>
                  {game.hidden && 
                    <Badge size={24} className="float-right" bg="warning" text="light" pill>
                      hidden
                    </Badge>
                  }
                  <Badge size={24} className="float-right" bg={registrationColor} text="light" pill>
                    {registrationState}
                  </Badge>
                  </div>
                  <Badge size={24} bg="light" variant="primary" style={{fontSize: '100%'}}>
                    {game.players.length} / {game.maxPlayers + game.maxSubs}
                  </Badge>
                </ListGroup.Item>  
              )
            })}
          </ListGroup>
        }
      </div>
    </Container>
  );
}

export default Customers;
