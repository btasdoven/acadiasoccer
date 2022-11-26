import { Outlet } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import useBreakpoint from '../components/useBreakpoint'

const AppLayout = () => {

  const bp = useBreakpoint();
  const sidebarExtendedWidth = (bp === 'sm' || bp === 'xs') ? 0 : 200;
  // const sidebarCollapsedWidth = '48px';

  return (
    <>
      <Navigation />
      <Sidebar width={sidebarExtendedWidth}/>
      <Container 
        className="app-container"
        style={{
          marginLeft: sidebarExtendedWidth === 0 ? 'auto' : `${sidebarExtendedWidth}px`, 
          width: `calc(100% - ${sidebarExtendedWidth}px)`,
          maxWidth: `calc(100% - ${sidebarExtendedWidth}px)`,
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default AppLayout;