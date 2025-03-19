import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const signUpData = {
        id: data.username,
        password: data.password,
        name: data.name,
        email: data.email,
        role: data.role,
        job_status: data.job_status,
      };

      const response = await axios.post(
        "http://43.201.219.118:8080/members/sign_up",
        signUpData
      );

      if (response.data === "Successful signUp") {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <Wrapper>
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowBack /> 뒤로가기
          </BackButton>
          <Title>회원가입</Title>
        </Header>

        <SignUpForm onSubmit={handleSubmit(onSubmit)}>
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
            <Label>이메일</Label>
            <Input
              type="email"
              {...register("email", {
                required: "이메일을 입력해주세요",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "올바른 이메일 형식이 아닙니다",
                },
              })}
              placeholder="이메일을 입력하세요"
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              {...register("password", {
                required: "비밀번호를 입력해주세요",
                minLength: {
                  value: 8,
                  message: "비밀번호는 최소 8자 이상이어야 합니다",
                },
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message: "영문, 숫자, 특수문자를 포함해야 합니다",
                },
              })}
              placeholder="비밀번호를 입력하세요"
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              {...register("passwordConfirm", {
                required: "비밀번호를 다시 입력해주세요",
                validate: (value) =>
                  value === watch("password") || "비밀번호가 일치하지 않습니다",
              })}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {errors.passwordConfirm && (
              <ErrorMessage>{errors.passwordConfirm.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>이름</Label>
            <Input
              type="text"
              {...register("name", {
                required: "이름을 입력해주세요",
                minLength: {
                  value: 2,
                  message: "이름은 최소 2자 이상이어야 합니다",
                },
              })}
              placeholder="이름을 입력하세요"
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>구직 상태</Label>
            <Select
              {...register("job_status", {
                required: "구직 상태를 선택해주세요",
              })}
            >
              <option value="">구직 상태를 선택하세요</option>
              <option value="EMPLOYED">재직중</option>
              <option value="SEEKING">구직중</option>
            </Select>
            {errors.job_status && (
              <ErrorMessage>{errors.job_status.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>회원 유형</Label>
            <Select
              {...register("role", {
                required: "회원 유형을 선택해주세요",
              })}
            >
              <option value="">회원 유형을 선택하세요</option>
              <option value="ROLE_USER">일반 회원</option>
              <option value="ROLE_ADMIN">관리자</option>
            </Select>
            {errors.role && <ErrorMessage>{errors.role.message}</ErrorMessage>}
          </FormGroup>

          <SignUpButton type="submit">가입하기</SignUpButton>

          <LoginSection>
            <LoginText>이미 계정이 있으신가요?</LoginText>
            <LoginLink onClick={() => navigate("/login")}>로그인</LoginLink>
          </LoginSection>
        </SignUpForm>
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
  padding: 40px 20px;
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

const Header = styled.div`
  margin-bottom: 32px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 12px;
  transition: all 0.2s ease;

  svg {
    font-size: 18px;
  }

  &:hover {
    color: ${(props) => props.theme.colors.primary};
    transform: translateX(-2px);
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const SignUpForm = styled.form`
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

const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.error};
  font-size: 13px;
`;

const SignUpButton = styled.button`
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

const LoginSection = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const LoginText = styled.span`
  color: ${(props) => props.theme.colors.textSecondary};
  margin-right: 8px;
`;

const LoginLink = styled.button`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}20;
  }

  option {
    padding: 8px;
  }
`;

export default SignUp;
