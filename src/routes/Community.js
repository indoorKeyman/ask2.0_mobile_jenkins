import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([
    {
      question_index: 999,
      member_index: 1,
      title: "ASK 2.0 커뮤니티에 오신 것을 환영합니다!",
      content:
        "ASK 2.0 커뮤니티는 여러분들의 다양한 의견과 경험을 공유하는 공간입니다. 자유롭게 질문하고 답변해주세요.",
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://43.201.219.118:8080/community/questions/list"
      );
      setQuestions(response.data);
      setError(null);
    } catch (error) {
      console.error("질문 목록을 불러오는데 실패했습니다:", error);
      setError("질문 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingMessage>로딩 중...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Wrapper>
      <Container>
        <Header>
          <Title>커뮤니티</Title>
          <WriteButton onClick={() => navigate("/community/make_question")}>
            글쓰기
          </WriteButton>
        </Header>

        <QuestionList>
          {questions.map((question) => (
            <QuestionItem
              key={question.question_index}
              onClick={() =>
                navigate(
                  `/community/communitydetail/${question.question_index}`,
                  {
                    state: { questionData: question },
                  }
                )
              }
            >
              <QuestionTitle>{question.title}</QuestionTitle>
              <QuestionContent>{question.content}</QuestionContent>
              <QuestionInfo>
                <span>작성자: {question.member_index}</span>
                <span>
                  작성일: {new Date(question.created_date).toLocaleDateString()}
                </span>
                {question.updated_date !== question.created_date && (
                  <span>
                    수정일:{" "}
                    {new Date(question.updated_date).toLocaleDateString()}
                  </span>
                )}
              </QuestionInfo>
            </QuestionItem>
          ))}
        </QuestionList>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 40px 20px;
`;

const Container = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const WriteButton = styled.button`
  padding: 12px 24px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }
`;

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const QuestionItem = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const QuestionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 16px;
`;

const QuestionContent = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 16px;
`;

const QuestionInfo = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 14px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: ${(props) => props.theme.colors.error};
`;

export default Community;
