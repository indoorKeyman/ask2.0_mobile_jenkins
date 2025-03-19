import styled from "styled-components";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Delete, Edit, ArrowBack } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";

const getMemberIndex = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) return null;

  try {
    const decoded = jwtDecode(accessToken);
    return decoded.member_index;
  } catch (error) {
    console.error("토큰 디코딩 실패:", error);
    return null;
  }
};

const CommunityDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuestion = location.state?.questionData || {
    question_index: id,
    member_index: 1,
    title: "ASK 2.0 커뮤니티에 오신 것을 환영합니다!",
    content:
      "ASK 2.0 커뮤니티는 개발자들의 지식 공유와 소통을 위한 공간입니다. 여러분의 경험과 지식을 자유롭게 나누어 주세요. 서로 배우고 성장하는 공간이 되었으면 좋겠습니다.",
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  };

  const [question, setQuestion] = useState(initialQuestion);
  const [answers, setAnswers] = useState([]);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const editFormRef = useRef(null);

  const fetchQuestionDetail = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://43.201.219.118:8080/community/questions/detail?question_index=${id}`
      );
      setQuestion(response.data);
    } catch (error) {
      console.error("게시글을 불러오는데 실패했습니다:", error);
    }
  }, [id]);

  const fetchAnswers = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://43.201.219.118:8080/community/answer/list?question_index=${id}`
      );
      setAnswers(response.data);
    } catch (error) {
      console.error("답변을 불러오는데 실패했습니다:", error);
    }
  }, [id]);

  useEffect(() => {
    if (!location.state?.questionData) {
      fetchQuestionDetail();
    }
    fetchAnswers();
  }, [location.state, fetchQuestionDetail, fetchAnswers]);

  const onSubmitAnswer = async (data) => {
    const memberIndex = getMemberIndex();
    if (!memberIndex) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      await axios.post(
        "http://43.201.219.118:8080/community/answer/make_answer",
        {
          member_index: memberIndex,
          question_index: parseInt(id),
          comment: data.comment,
        },
        {
          headers: {
            access: token,
          },
        }
      );
      reset();
      fetchAnswers();
    } catch (error) {
      if (error.response?.status === 403) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        sessionStorage.removeItem("accessToken");
        delete axios.defaults.headers.common["Authorization"];
        navigate("/login");
      } else {
        console.error("답변 작성에 실패했습니다:", error);
        alert("답변 작성에 실패했습니다.");
      }
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      await axios.delete(
        `http://43.201.219.118:8080/community/questions/delete_question?question_index=${id}`,
        {
          headers: {
            access: token,
          },
        }
      );
      alert("게시글이 삭제되었습니다.");
      navigate("/community");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      if (error.response?.status === 403) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      } else {
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  const handleDeleteAnswer = async (answerIndex, answerMemberIndex) => {
    const memberIndex = getMemberIndex();
    if (!memberIndex) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    if (memberIndex !== answerMemberIndex) {
      alert("자신이 작성한 답변만 삭제할 수 있습니다.");
      return;
    }

    if (!window.confirm("정말로 이 답변을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      await axios.delete(
        `http://43.201.219.118:8080/community/answer/delete_answer?answer_index=${answerIndex}`,
        {
          headers: {
            access: token,
          },
        }
      );
      alert("답변이 삭제되었습니다.");
      fetchAnswers();
    } catch (error) {
      console.error("답변 삭제 실패:", error);
      if (error.response?.data.error === "Access token expired") {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        sessionStorage.removeItem("accessToken");
        delete axios.defaults.headers.common["Authorization"];
        navigate("/login");
      } else {
        alert("답변 삭제에 실패했습니다.");
      }
    }
  };

  const handleEditAnswer = (answer) => {
    const memberIndex = getMemberIndex();
    if (!memberIndex) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    if (memberIndex !== answer.member_index) {
      alert("자신이 작성한 답변만 수정할 수 있습니다.");
      return;
    }
    setEditingAnswer(answer);
    setValue("editComment", answer.comment);
  };

  useEffect(() => {
    if (editingAnswer && editFormRef.current) {
      editFormRef.current.focus();
    }
  }, [editingAnswer]);

  // const handleUpdateAnswer = async (data) => {
  //   try {
  //     const token = sessionStorage.getItem("accessToken");
  //     await axios.put(
  //       `http://43.201.219.118:8080/community/answer/update_answer?answer_index=${editingAnswer.answer_index}`,
  //       {
  //         comment: data.editComment,
  //       },
  //       {
  //         headers: {
  //           access: token,
  //         },
  //       }
  //     );
  //     setEditingAnswer(null);
  //     fetchAnswers();
  //     alert("답변이 수정되었습니다.");
  //   } catch (error) {
  //     console.error("답변 수정 실패:", error);
  //     if (error.response?.status === 403) {
  //       alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
  //       sessionStorage.removeItem("accessToken");
  //       delete axios.defaults.headers.common["Authorization"];
  //       navigate("/login");
  //     } else {
  //       alert("답변 수정에 실패했습니다.");
  //     }
  //   }
  // };

  if (!question) return <div>로딩중...</div>;

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowBack /> 목록으로
        </BackButton>
        <Title>커뮤니티 상세</Title>
      </Header>

      <QuestionSection>
        <QuestionHeader>
          <HeaderTop>
            <Title>{question.title}</Title>
            {getMemberIndex() === question.member_index && (
              <ActionButtons>
                <IconButton color="delete" onClick={handleDeleteQuestion}>
                  <Delete />
                </IconButton>
              </ActionButtons>
            )}
          </HeaderTop>
          <QuestionInfo>
            <span>작성자: {question.member_index}</span>
            <span>
              작성일: {new Date(question.created_date).toLocaleDateString()}
            </span>
            {question.updated_date !== question.created_date && (
              <span>
                수정일: {new Date(question.updated_date).toLocaleDateString()}
              </span>
            )}
          </QuestionInfo>
        </QuestionHeader>
        <Content>{question.content}</Content>
      </QuestionSection>

      <AnswerSection>
        <AnswerHeader>
          <h2>답변 {answers.length}개</h2>
        </AnswerHeader>

        <AnswerForm onSubmit={handleSubmit(onSubmitAnswer)}>
          <TextArea
            {...register("comment", { required: true })}
            placeholder="답변을 작성해주세요"
          />
          <SubmitButton type="submit">답변 등록</SubmitButton>
        </AnswerForm>

        <AnswerList>
          {answers.map((answer) => (
            <AnswerItem key={answer.answer_index}>
              <AnswerContent>{answer.comment}</AnswerContent>
              <AnswerFooter>
                <AnswerInfo>
                  <span>작성자: {answer.member_index}</span>
                  <span>
                    작성일: {new Date(answer.created_date).toLocaleDateString()}
                  </span>
                  {answer.updated_date !== answer.created_date && (
                    <span>
                      수정일:{" "}
                      {new Date(answer.updated_date).toLocaleDateString()}
                    </span>
                  )}
                </AnswerInfo>
                {getMemberIndex() === answer.member_index && (
                  <ActionButtons>
                    <IconButton
                      color="edit"
                      onClick={() => handleEditAnswer(answer)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="delete"
                      onClick={() =>
                        handleDeleteAnswer(
                          answer.answer_index,
                          answer.member_index
                        )
                      }
                    >
                      <Delete />
                    </IconButton>
                  </ActionButtons>
                )}
              </AnswerFooter>
            </AnswerItem>
          ))}
        </AnswerList>
      </AnswerSection>
    </Container>
  );
};

const Container = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 40px 20px;
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
  font-size: 32px;
  font-weight: 700;
  padding-top: 10px;
  color: ${(props) => props.theme.colors.text};
`;

const QuestionSection = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const QuestionHeader = styled.div`
  margin-bottom: 24px;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Content = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.text};
`;

const QuestionInfo = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const AnswerSection = styled.div`
  margin-top: 40px;
`;

const AnswerHeader = styled.div`
  margin-bottom: 24px;
  h2 {
    font-size: 20px;
    font-weight: 600;
  }
`;

const AnswerForm = styled.form`
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 16px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border-radius: 8px;
  font-weight: 600;
  width: fit-content;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }
`;

const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AnswerItem = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const AnswerContent = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 16px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const AnswerFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  padding: 8px;
  color: ${(props) =>
    props.color === "edit"
      ? props.theme.colors.edit
      : props.color === "delete"
        ? props.theme.colors.delete
        : props.theme.colors.textSecondary};
  transition: all 0.2s ease;
  border-radius: 4px;

  svg {
    font-size: 20px;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.backgroundGray};
    color: ${(props) =>
      props.color === "edit"
        ? props.theme.colors.editHover
        : props.color === "delete"
          ? props.theme.colors.deleteHover
          : props.theme.colors.primary};
  }
`;

const AnswerInfo = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 14px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 8px;
//   justify-content: flex-end;
//   margin-top: 16px;
// `;

// const CancelButton = styled.button`
//   padding: 8px 16px;
//   background-color: ${(props) => props.theme.colors.backgroundGray};
//   color: ${(props) => props.theme.colors.textSecondary};
//   border-radius: 8px;
//   font-weight: 600;

//   &:hover {
//     background-color: ${(props) => props.theme.colors.border};
//   }
// `;

export default CommunityDetail;
