import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { useLocation } from 'react-router-dom';
import AppNavList from "./AppNavList"

function Sidebar({width}) {
  const location = useLocation();

  return (
    <>
      <Nav 
        activeKey={location.pathname} 
        className="flex-column d-none d-md-block" 
        style={{
          width: width, 
          paddingLeft: '8px', 
          paddingRight: '8px', 
          position: 'fixed'
        }}
      >
        <Dropdown.Divider style={{marginTop: 0}}/>

        <AppNavList />
      </Nav>
    </>
  );
}

export default Sidebar;