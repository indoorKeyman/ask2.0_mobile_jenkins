import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

const JobsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const jobData = location.state?.jobData;

  // jobData가 없으면 목록으로 리다이렉트
  if (!jobData) {
    navigate("/jobs");
    return null;
  }

  const handleApply = () => {
    navigate(`/jobs/apply/${id}`, { state: { jobData } });
  };

  const isExpired = new Date(jobData.end_date) <= new Date();

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowBack /> 목록으로
        </BackButton>
        <Title>채용 상세</Title>
      </Header>

      <JobCard>
        <CompanyInfo>
          <h2>{jobData.title}</h2>
          <Position>{jobData.level}</Position>
        </CompanyInfo>

        <JobInfo>
          <InfoItem>
            <Label>근무지역</Label>
            <Value>{jobData.location}</Value>
          </InfoItem>
          <InfoItem>
            <Label>주요업무</Label>
            <Value>{jobData.responsibilities}</Value>
          </InfoItem>
          <InfoItem>
            <Label>자격요건</Label>
            <Value>{jobData.qualification}</Value>
          </InfoItem>
          {jobData.preferences && (
            <InfoItem>
              <Label>우대사항</Label>
              <Value>{jobData.preferences}</Value>
            </InfoItem>
          )}
          <DateInfo>
            <InfoItem>
              <Label>시작일</Label>
              <Value>{new Date(jobData.start_date).toLocaleDateString()}</Value>
            </InfoItem>
            <InfoItem>
              <Label>마감일</Label>
              <Value>{new Date(jobData.end_date).toLocaleDateString()}</Value>
            </InfoItem>
          </DateInfo>
        </JobInfo>

        <ButtonGroup>
          {isExpired && <ExpiredMessage>마감된 공고입니다</ExpiredMessage>}
          <ApplyButton onClick={handleApply} disabled={isExpired}>
            지원하기
          </ApplyButton>
        </ButtonGroup>
      </JobCard>
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

const JobCard = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CompanyInfo = styled.div`
  margin-bottom: 24px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 8px;
  }
`;

const Position = styled.div`
  font-size: 20px;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 600;
`;

const JobInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background-color: ${(props) => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const Value = styled.span`
  font-size: 16px;
  color: ${(props) =>
    props.isExpired ? props.theme.colors.error : props.theme.colors.text};
  font-weight: ${(props) => (props.isExpired ? "600" : "500")};
  white-space: pre-wrap;
  word-break: break-word;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
`;

const ExpiredMessage = styled.div`
  color: ${(props) => props.theme.colors.error};
  font-size: 14px;
  font-weight: 600;
`;

const ApplyButton = styled.button`
  padding: 16px 48px;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.backgroundGray
      : props.theme.colors.primary};
  color: ${(props) =>
    props.disabled ? props.theme.colors.textSecondary : "white"};
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.backgroundGray
        : props.theme.colors.primaryDark};
    transform: ${(props) => !props.disabled && "translateY(-2px)"};
  }
`;

const DateInfo = styled.div`
  display: flex;
  gap: 24px;

  ${InfoItem} {
    flex: 1;
  }
`;

export default JobsDetail;
