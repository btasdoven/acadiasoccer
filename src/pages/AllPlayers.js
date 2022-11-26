import React from "react";
import { Container, ListGroup } from "react-bootstrap";
import { collection } from 'firebase/firestore';
import { useFirestoreUser } from "../context/UserContext";
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import Moment from 'react-moment'

function Customers() {
  const firestore = useFirestore();
  const { user } = useFirestoreUser();
  const ref = collection(firestore, `users`);
  const { data: players } = useFirestoreCollectionData(ref);

  return (
    <Container
      className="pb-4 d-flex align-items-center justify-content-center"
    >
      <div className="w-100 page-container">
        <h2 className="mb-3">Registered Players</h2>

        {players &&
          <ListGroup className="mt-4 mlr-clear">
            {players.filter(p => p.hidden !== true).sort((a, b) => a.joinedAt < b.joinedAt ? 1 : -1).map(player => 
              <ListGroup.Item 
                key={player.id} 
                className="d-flex justify-content-between align-items-center"
                style={{flexDirection: 'column'}}
              >
                <div class="d-flex w-100 justify-content-between">
                  {player.name}
                  <span><small>{player.joinedAt && <>member since <Moment unix fromNow>{parseInt(player.joinedAt/1000)}</Moment></>}</small></span>
                </div>
                {user && user.hidden && <><div><small style={{float: 'left'}}>id: {player.id}</small></div></>}
              </ListGroup.Item>  
            )}
          </ListGroup>
        }
      </div>
    </Container>
  );
}

export default Customers;
