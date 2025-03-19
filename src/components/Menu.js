import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Menu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://43.201.219.118:8080/logout",
        {},
        {
          withCredentials: true,
        }
      );

      console.log(response);

      sessionStorage.removeItem("accessToken");
      delete axios.defaults.headers.common["Authorization"];

      setIsLoggedIn(false);
      alert("로그아웃되었습니다.");
      onClose();
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <MenuOverlay isOpen={isOpen}>
      <NavList>
        <NavSection>
          <NavTitle>메뉴</NavTitle>
          <NavItem>
            <StyledLink to="/about" onClick={handleLinkClick}>
              소개
            </StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink to="/jobs" onClick={handleLinkClick}>
              채용공고
            </StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink to="/community" onClick={handleLinkClick}>
              커뮤니티
            </StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink to="/chatbot" onClick={handleLinkClick}>
              AI 질문하기
            </StyledLink>
          </NavItem>
        </NavSection>

        <NavSection>
          <NavTitle>계정</NavTitle>
          {isLoggedIn ? (
            <NavItem>
              <StyledButton onClick={handleLogout}>로그아웃</StyledButton>
            </NavItem>
          ) : (
            <NavItem>
              <StyledLink to="/login" onClick={handleLinkClick}>
                로그인
              </StyledLink>
            </NavItem>
          )}
        </NavSection>
      </NavList>
    </MenuOverlay>
  );
};

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--max-width);
  height: 100vh;
  background-color: ${(props) => props.theme.colors.backgroundGray};
  z-index: 99;
  padding-top: 120px;
  overflow-y: auto;
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  transition:
    opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;

  & > * {
    opacity: ${(props) => (props.isOpen ? "1" : "0")};
    transform: translateY(${(props) => (props.isOpen ? "0" : "20px")});
    transition:
      opacity 0.3s ease-in-out,
      transform 0.3s ease-in-out;
    transition-delay: ${(props) => (props.isOpen ? "0.2s" : "0s")};
  }
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding: 0 20px;
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const NavTitle = styled.h2`
  font-size: 14px;
  color: ${(props) => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;

const NavItem = styled.div`
  width: 100%;
`;

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
  padding: 16px 0;
  text-decoration: none;
  color: ${(props) => props.theme.colors.text};
  font-size: 24px;
  font-weight: bold;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
    transform: translateX(8px);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const StyledButton = styled.button`
  display: block;
  width: 100%;
  padding: 16px 0;
  text-decoration: none;
  color: ${(props) => props.theme.colors.text};
  font-size: 24px;
  font-weight: bold;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
    transform: translateX(8px);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

export default Menu;
