import React from "react";
import { Card, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFirestoreUser } from "../context/UserContext";
import useBreakpoint from '../components/useBreakpoint'

import BootstrapTable from 'react-bootstrap-table-next';

const products = [ 
  {id: '1', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
  {id: '2', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
  {id: '3', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
  {id: '4', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
  {id: '5', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
  {id: '6', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
  {id: '7', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
  {id: '8', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
  {id: '9', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
  {id: '10', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
  {id: '11', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
  {id: '12', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
  {id: '13', name: 'asd', price: 3, x: 'asdqwe', y: 'sadwqe', z: 'qeasdzxc'},
];
const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name'
}, {
  dataField: 'price',
  text: 'Product Price'
}, {
  dataField: 'x',
  text: 'Product Price'
}, {
  dataField: 'y',
  text: 'Product Price'
}, {
  dataField: 'z',
  text: 'Product Price'
}];

function Users() {
  const { user } = useFirestoreUser();

  // const firestore = useFirestore();
  // const ref = doc(firestore, `items/${authUser.uid}`);
  // const { status, data } = useFirestoreDocData(ref);

  // if (user) {
  //   getDoc(user.items[0]).then(d => console.log(d.data())).catch(e => console.error(e))
  // }

  // console.log(authUser, user);

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
    >
      <div className="w-100 page-container">
        <h2 className="mb-3">Users</h2>

        <div className="callout mlr-clear">
          <h5>Çok önemli bir uyarı {useBreakpoint()}</h5>
          <p className="mb-0">lorem ipsum <mark>selam</mark> dedi ki <code className="highlighter-rouge">.sr-only</code> class.</p>
        </div>
        <Card className="page-card">
          <Card.Body>
            <Card.Text>
              <strong>Name: </strong> {user.name} <br />
              <strong>Surname: </strong> {user.surname} <br />
              <strong>Email: </strong> {user.email} <br />

              <Button className="mt-3" as={Link} to="/update-profile" variant="primary">Action</Button>
            </Card.Text>
          </Card.Body>
        </Card>

        <BootstrapTable wrapperClasses="mt-3 mb-3 mlr-clear" bordered={false} classes="table-responsive-md table-hover" keyField='id' data={ products } columns={ columns } />
      </div>
    </Container>
  );
}

export default Users;
