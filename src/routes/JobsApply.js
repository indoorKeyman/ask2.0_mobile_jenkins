import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowBack } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const JobsApply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const jobData = location.state?.jobData;
  const { setIsLoggedIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!jobData) {
      navigate("/jobs");
    }
  }, [jobData, navigate]);

  if (!jobData) {
    return null;
  }

  const tryReissue = async () => {
    try {
      const response = await axios.post(
        "http://43.201.219.118:8080/reissue",
        {},
        { withCredentials: true }
      );

      if (response.data.access_token) {
        sessionStorage.setItem("accessToken", response.data.access_token);
        return response.data.access_token;
      }
      return null;
    } catch (error) {
      console.error("토큰 재발급 실패:", error);
      return null;
    }
  };

  const makeJobApplication = async (applicationData, token) => {
    return await axios.post(
      "http://43.201.219.118:8080/jobs/make_jobapplications",
      applicationData,
      {
        headers: {
          access: token,
        },
      }
    );
  };

  const onSubmit = async (data) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const applicationData = {
        jobs_index: parseInt(id),
        members_index: 2,
        self_introduction: data.self_introduction,
      };

      try {
        const response = await makeJobApplication(applicationData, token);
        if (response.status === 200) {
          alert("지원이 완료되었습니다.");
          navigate("/jobs");
        }
      } catch (error) {
        if (error.response?.data?.error === "Access token expired") {
          // 토큰 재발급 시도
          const newToken = await tryReissue();
          if (newToken) {
            // 새 토큰으로 재시도
            const retryResponse = await makeJobApplication(
              applicationData,
              newToken
            );
            if (retryResponse.status === 200) {
              alert("지원이 완료되었습니다.");
              navigate("/jobs");
              return;
            }
          }
          // 재발급 실패 또는 재시도 실패
          sessionStorage.removeItem("accessToken");
          setIsLoggedIn(false);
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/login");
        } else {
          alert("지원 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      }
    } catch (error) {
      console.error("지원에 실패했습니다:", error);
      alert("지원 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowBack /> 뒤로가기
        </BackButton>
        <Title>지원서 작성</Title>
      </Header>

      <ApplicationCard>
        <JobInfo>
          <JobTitle>{jobData.title}</JobTitle>
          <JobLevel>{jobData.level}</JobLevel>
          <JobDetails>
            <DetailItem>
              <DetailLabel>근무지역</DetailLabel>
              <DetailValue>{jobData.location}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>주요업무</DetailLabel>
              <DetailValue>{jobData.responsibilities}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>자격요건</DetailLabel>
              <DetailValue>{jobData.qualification}</DetailValue>
            </DetailItem>
            {jobData.preferences && (
              <DetailItem>
                <DetailLabel>우대사항</DetailLabel>
                <DetailValue>{jobData.preferences}</DetailValue>
              </DetailItem>
            )}
            <DetailItem>
              <DetailLabel>마감일</DetailLabel>
              <DetailValue>
                {new Date(jobData.end_date).toLocaleDateString()}
              </DetailValue>
            </DetailItem>
          </JobDetails>
        </JobInfo>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="self_introduction">자기소개</Label>
            <TextArea
              id="self_introduction"
              {...register("self_introduction", {
                required: "자기소개를 입력해주세요",
                minLength: {
                  value: 100,
                  message: "최소 100자 이상 작성해주세요",
                },
              })}
              placeholder="자기소개를 작성해주세요 (최소 100자)"
            />
            {errors.self_introduction && (
              <ErrorMessage>{errors.self_introduction.message}</ErrorMessage>
            )}
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={() => navigate(-1)}>
              취소
            </CancelButton>
            <SubmitButton type="submit">지원하기</SubmitButton>
          </ButtonGroup>
        </Form>
      </ApplicationCard>
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
  color: ${(props) => props.theme.colors.text};
`;

const ApplicationCard = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const JobInfo = styled.div`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const JobTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 8px;
`;

const JobLevel = styled.div`
  font-size: 20px;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 600;
  margin-bottom: 16px;
`;

const JobDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: ${(props) => props.theme.colors.backgroundSecondary};
  padding: 20px;
  border-radius: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailLabel = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const DetailValue = styled.span`
  font-size: 16px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  white-space: pre-wrap;
  word-break: break-word;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 400px;
  padding: 16px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  font-size: 15px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.error};
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
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
  }
`;

export default JobsApply;
