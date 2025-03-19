import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setMemberIndex } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await axios.post(
        "http://43.201.219.118:8080/login",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      const accessToken = response.headers.access;

      if (accessToken) {
        // JWT 토큰 디코딩
        const decoded = jwtDecode(accessToken);
        console.log("디코딩된 토큰:", decoded);
        const username = decoded.username;

        try {
          // 사용자 정보 요청
          const memberResponse = await axios.get(
            `http://43.201.219.118:8080/members/get_mi?username=${username}`,
            {
              headers: {
                access: accessToken,
              },
            }
          );
          // console.log("사용자 정보:", memberResponse.data.member_index);
          setMemberIndex(memberResponse.data.member_index);
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error);
        }

        // localStorage 대신 sessionStorage 사용
        sessionStorage.setItem("accessToken", accessToken);
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        setIsLoggedIn(true);
        alert("로그인되었습니다.");
        navigate("/");
      } else {
        alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title>로그인</Title>
        <LoginForm onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>아이디</Label>
            <Input
              type="text"
              {...register("username", {
                required: "아이디를 입력해주세요",
                minLength: {
                  value: 4,
                  message: "아이디는 최소 4자 이상이어야 합니다",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "영문, 숫자, 언더스코어(_)만 사용 가능합니다",
                },
              })}
              placeholder="아이디를 입력하세요"
            />
            {errors.username && (
              <ErrorMessage>{errors.username.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              {...register("password", {
                required: "비밀번호를 입력해주세요",
                minLength: {
                  value: 6,
                  message: "비밀번호는 최소 6자 이상이어야 합니다",
                },
              })}
              placeholder="비밀번호를 입력하세요"
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </FormGroup>

          <LoginButton type="submit">로그인</LoginButton>

          <AdditionalOptions>
            <RememberMe>
              <Checkbox
                type="checkbox"
                {...register("rememberMe")}
                id="rememberMe"
              />
              <label htmlFor="rememberMe">로그인 상태 유지</label>
            </RememberMe>
            <ForgotPassword>비밀번호 찾기</ForgotPassword>
          </AdditionalOptions>

          <Divider>
            <DividerText>또는</DividerText>
          </Divider>

          <SignUpSection>
            <SignUpText>아직 회원이 아니신가요?</SignUpText>
            <SignUpButton type="button" onClick={() => navigate("/signup")}>
              회원가입
            </SignUpButton>
          </SignUpSection>
        </LoginForm>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px 20px 20px;
  background-color: ${(props) => props.theme.colors.background};
`;

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  margin-bottom: 32px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}20;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

const AdditionalOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const ForgotPassword = styled.button`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: 20px 0;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: ${(props) => props.theme.colors.border};
  }
`;

const DividerText = styled.span`
  background-color: white;
  padding: 0 10px;
  color: ${(props) => props.theme.colors.textSecondary};
  position: relative;
  font-size: 14px;
`;

const SignUpSection = styled.div`
  text-align: center;
`;

const SignUpText = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 12px;
  font-size: 14px;
`;

const SignUpButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: white;
  color: ${(props) => props.theme.colors.primary};
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.backgroundSecondary};
  }
`;

const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.error};
  font-size: 13px;
`;

export default Login;
