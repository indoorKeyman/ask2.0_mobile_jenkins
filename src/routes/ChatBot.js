import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, ArrowBack } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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

const TYPING_DELAY = 1000; // 1초 타이핑 딜레이
const MIN_RESPONSE_DELAY = 500; // 최소 0.5초 응답 딜레이
const MAX_RESPONSE_DELAY = 2000; // 최대 2초 응답 딜레이

const ChatBot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "안녕하세요! ASK 2.0 AI 어시스턴트입니다. 어떤 도움이 필요하신가요?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const memberIndex = getMemberIndex();
    if (!memberIndex) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setLoading(true);
    setIsTyping(true);

    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await axios.post(
        "/chatbot/chat",
        {
          member_index: memberIndex,
          message: userMessage,
        },
        {
          headers: {
            access: token,
          },
        }
      );

      // 응답 길이에 따른 동적 딜레이 계산
      const responseLength = response.data.response.length;
      const typingDelay = Math.min(
        MAX_RESPONSE_DELAY,
        Math.max(MIN_RESPONSE_DELAY, responseLength * 50)
      );

      // 타이핑 효과를 위한 딜레이
      await new Promise((resolve) => setTimeout(resolve, typingDelay));

      setMessages((prev) => [
        ...prev,
        { type: "bot", content: response.data.response },
      ]);
    } catch (error) {
      console.error("챗봇 응답 오류:", error);
      await new Promise((resolve) => setTimeout(resolve, TYPING_DELAY));
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: "죄송합니다. 일시적인 오류가 발생했습니다." },
      ]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <Wrapper>
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowBack /> 뒤로가기
          </BackButton>
          <Title>AI 챗봇</Title>
        </Header>

        <ChatContainer>
          <MessagesContainer>
            {messages.map((message, index) => (
              <Message key={index} type={message.type}>
                <MessageContent type={message.type}>
                  {message.content}
                </MessageContent>
              </Message>
            ))}
            {loading && (
              <Message type="bot">
                <MessageContent type="bot">
                  <LoadingDots>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </LoadingDots>
                </MessageContent>
              </Message>
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer onSubmit={handleSubmit}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isTyping
                  ? "AI가 응답하고 있습니다..."
                  : "메시지를 입력하세요..."
              }
              disabled={loading}
            />
            <SendButton type="submit" disabled={loading || !input.trim()}>
              <Send />
            </SendButton>
          </InputContainer>
        </ChatContainer>
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
  margin-bottom: 40px;
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
  color: ${(props) => props.theme.colors.text};
`;

const ChatContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Message = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.type === "user" ? "flex-end" : "flex-start"};
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 16px;
  border-radius: 12px;
  background-color: ${(props) =>
    props.type === "user" ? props.theme.colors.primary : "white"};
  color: ${(props) =>
    props.type === "user" ? "white" : props.theme.colors.text};
  font-size: 16px;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.form`
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.backgroundGray};
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: 12px 24px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.border};
    cursor: not-allowed;
  }

  svg {
    font-size: 20px;
  }
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;

  span {
    animation: loading 1.4s infinite;
    font-size: 24px;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes loading {
    0%,
    100% {
      opacity: 0.3;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
      transform: translateY(-4px);
    }
  }
`;

export default ChatBot;
