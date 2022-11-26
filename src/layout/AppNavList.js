import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { BsGridFill, BsPersonFill, BsPeopleFill, BsGrid1X2Fill } from "react-icons/bs";
import { useFirestoreUser } from "../context/UserContext";

import './AppNavList.css'

function AppNavList({navLinkClasses}) {
  
  const { user } = useFirestoreUser();

  navLinkClasses = navLinkClasses || "";

  return (
    <>
      <Nav.Item>
        <Nav.Link eventKey="/games" as={Link} to="/games" className={`${navLinkClasses} app-nav-list`}>
          <BsGridFill size={16} className="mr-2"/>
          Games
          {/* <Badge bg="primary" className="ml-2" style={{color: 'white'}}>2</Badge> */}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/allplayers" as={Link} to="/allplayers" className={`${navLinkClasses} app-nav-list`}>
          <BsPeopleFill size={16} className="mr-2"/>
          All Players
          {/* <Badge bg="primary" className="ml-2" style={{color: 'white'}}>2</Badge> */}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/profile" as={Link} to="/profile" className={`${navLinkClasses} app-nav-list`}>
          <BsPersonFill size={16} className="mr-2"/>
          My Profile
          {/* <Badge bg="primary" className="ml-2" style={{color: 'white'}}>2</Badge> */}
        </Nav.Link>
      </Nav.Item>
      
      {user && user.hidden &&
        <Nav.Item>
          <Nav.Link eventKey="/admin" as={Link} to="/admin" className={`${navLinkClasses} app-nav-list`}>
            <BsGrid1X2Fill size={16} className="mr-2"/>
            Admin Panel
            {/* <Badge bg="primary" className="ml-2" style={{color: 'white'}}>2</Badge> */}
          </Nav.Link>
        </Nav.Item>
      }
    </>
  );
}

export default AppNavList;