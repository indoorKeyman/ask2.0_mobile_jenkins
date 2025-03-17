import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const Header = ({ isMenuOpen, toggleMenu }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { isLoggedIn } = useAuth();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUsername(decoded.username || "");
        } catch (error) {
          console.error("토큰 디코딩 실패:", error);
        }
      }
    }
  }, [isLoggedIn]);

  const handleLogoClick = () => {
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  return (
    <HeaderWrapper isHome={isHome}>
      <MenuButton onClick={toggleMenu}>
        {isMenuOpen ? (
          <CloseIcon sx={{ fontSize: 28, color: "black" }} />
        ) : (
          <MenuIcon
            sx={{
              fontSize: 28,
              color: isHome ? "white" : "black",
            }}
          />
        )}
      </MenuButton>
      <LogoLink to="/" onClick={handleLogoClick}>
        <Logo>
          <LogoText isMenuOpen={isMenuOpen} isHome={isHome}>
            ASK
          </LogoText>
          <VersionText isMenuOpen={isMenuOpen} isHome={isHome}>
            2.0
          </VersionText>
        </Logo>
      </LogoLink>
      {isLoggedIn && username && (
        <WelcomeMessage isHome={isHome} isMenuOpen={isMenuOpen}>
          <Username>{username}</Username>님 환영합니다
        </WelcomeMessage>
      )}
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  height: var(--header-height);
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--max-width);
  z-index: 102;
  background-color: ${(props) => (props.isHome ? "transparent" : "#ffffff")};
  transition: background-color 0.3s ease;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
`;

const MenuButton = styled.button`
  margin-left: 20px;
  z-index: 101;
  transition: transform 0.2s ease;
  color: white;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LogoLink = styled(Link)`
  flex: 1;
  text-decoration: none;
  margin-right: 20px;
`;

const Logo = styled.div`
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
`;

const LogoText = styled.span`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 2px;
  color: ${(props) => {
    if (props.isMenuOpen) return props.theme.colors.primary;
    if (props.isHome) return "white";
    return props.theme.colors.text;
  }};
  font-family: "Arial", sans-serif;
  text-shadow: ${(props) =>
    props.isHome && !props.isMenuOpen
      ? "2px 2px 4px rgba(0, 0, 0, 0.2)"
      : "none"};
  transition: color 0.3s ease;
`;

const VersionText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => {
    if (props.isMenuOpen) return props.theme.colors.textSecondary;
    if (props.isHome) return "rgba(255, 255, 255, 0.8)";
    return props.theme.colors.textSecondary;
  }};
  transition: color 0.3s ease;
`;

const WelcomeMessage = styled.div`
  margin-right: 20px;
  font-size: 14px;
  color: ${(props) => {
    if (props.isMenuOpen) return props.theme.colors.textSecondary;
    if (props.isHome) return "rgba(255, 255, 255, 0.9)";
    return props.theme.colors.textSecondary;
  }};
  transition: color 0.3s ease;
`;

const Username = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`;

export default Header;
