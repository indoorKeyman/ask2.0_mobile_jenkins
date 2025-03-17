import { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import Menu from "./Menu";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <Wrapper>
      <Container>
        <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <Menu isOpen={isMenuOpen} onClose={closeMenu} />
        <Main>
          <Outlet />
        </Main>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background};
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  max-width: var(--max-width);
  min-width: var(--min-width);
  position: relative;
`;

const Main = styled.main`
  width: 100%;
  padding-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
  overflow-y: auto;
  position: relative;
  background-color: ${(props) => props.theme.colors.background};
`;

export default Layout;
