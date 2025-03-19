import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowBack } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const CommunityMakeQuestion = () => {
  const navigate = useNavigate();
  const { isLoggedIn, memberIndex } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async (data) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login");
        return;
      }

      const questionData = {
        member_index: memberIndex,
        ...data,
      };

      const response = await axios.post(
        "http://43.201.219.118:8080/community/questions/make_question",
        questionData,
        {
          headers: {
            access: token,
          },
        }
      );

      console.log("질문 등록에 성공하였습니다.", response);
      alert("질문 등록에 성공하였습니다.");
      navigate("/community");
    } catch (error) {
      if (error.response?.status === 403) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        sessionStorage.removeItem("accessToken");
        delete axios.defaults.headers.common["Authorization"];
        navigate("/login");
      } else {
        console.error("질문 작성에 실패했습니다:", error);
        alert("질문 작성에 실패했습니다.");
      }
    }
  };

  if (!isLoggedIn) return null;

  return (
    <Wrapper>
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowBack /> 뒤로가기
          </BackButton>
          <Title>글쓰기</Title>
        </Header>
        <WriteForm onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Input
              {...register("title", {
                required: "제목을 입력해주세요",
                minLength: {
                  value: 2,
                  message: "제목은 2글자 이상이어야 합니다",
                },
              })}
              placeholder="제목"
            />
            {errors.title && (
              <ErrorMessage>{errors.title.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <TextArea
              {...register("content", {
                required: "내용을 입력해주세요",
                minLength: {
                  value: 10,
                  message: "내용은 10글자 이상이어야 합니다",
                },
              })}
              placeholder="내용을 입력하세요"
            />
            {errors.content && (
              <ErrorMessage>{errors.content.message}</ErrorMessage>
            )}
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={() => navigate(-1)}>
              취소
            </CancelButton>
            <SubmitButton type="submit">등록</SubmitButton>
          </ButtonGroup>
        </WriteForm>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  background-color: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const WriteForm = styled.form`
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 12px;
  background-color: ${(props) => props.theme.colors.background};
  padding: 16px;
  border-radius: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 10px;
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  font-size: 15px;
  background-color: #f5f5f5;
  transition: all 0.2s ease;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-bottom-color: ${(props) => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 300px;
  padding: 12px 10px;
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  font-size: 15px;
  resize: vertical;
  background-color: #f5f5f5;
  transition: all 0.2s ease;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-bottom-color: ${(props) => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
`;

const CancelButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.backgroundGray};
  color: ${(props) => props.theme.colors.textSecondary};

  &:hover {
    background-color: ${(props) => props.theme.colors.border};
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
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

const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.error};
  font-size: 13px;
  margin-top: 6px;
  display: block;
`;

export default CommunityMakeQuestion;
