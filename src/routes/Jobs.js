import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Jobs = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login");
        return;
      }

      const response = await axios.get("http://43.201.219.118:8080/jobs/list", {
        headers: {
          access: accessToken,
        },
      });

      let filteredData = response.data;
      const now = new Date();

      if (applicationStatus === "recruiting") {
        // 모집중인 공고만 필터링 (마감일이 현재보다 미래인 경우)
        filteredData = response.data.filter(
          (job) => new Date(job.end_date) > now
        );
      } else if (applicationStatus === "closed") {
        // 마감된 공고만 필터링 (마감일이 현재보다 과거인 경우)
        filteredData = response.data.filter(
          (job) => new Date(job.end_date) <= now
        );
      }

      setJobs(filteredData);
      setError(null);
    } catch (error) {
      console.error("채용공고를 불러오는데 실패했습니다:", error);

      if (error.response?.data?.error === "Access token expired") {
        sessionStorage.removeItem("accessToken");
        delete axios.defaults.headers.common["Authorization"];
        setIsLoggedIn(false);
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
        return;
      }

      setError("채용공고를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [navigate, applicationStatus, setIsLoggedIn]);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    fetchJobs();
  }, [fetchJobs, navigate, applicationStatus]);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJobClick = (job) => {
    navigate(`/jobs/jobsdetail/${job.jobs_index}`, {
      state: { jobData: job },
    });
  };

  if (loading) return <LoadingMessage>로딩 중...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <Header>
        <Title>채용 공고</Title>
        <SearchBar>
          <SearchIcon />
          <SearchInput
            placeholder="직무, 지역 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <StatusFilter>
          <FilterButton
            active={applicationStatus === "all"}
            onClick={() => setApplicationStatus("all")}
          >
            전체
          </FilterButton>
          <FilterButton
            active={applicationStatus === "recruiting"}
            onClick={() => setApplicationStatus("recruiting")}
          >
            모집중
          </FilterButton>
          <FilterButton
            active={applicationStatus === "closed"}
            onClick={() => setApplicationStatus("closed")}
          >
            마감
          </FilterButton>
        </StatusFilter>
      </Header>

      <JobList>
        {filteredJobs.map((job) => {
          const isExpired = new Date(job.end_date) <= new Date();
          return (
            <JobCard key={job.jobs_index} onClick={() => handleJobClick(job)}>
              <CompanyInfo>
                <h2>{job.title}</h2>
                <Position>{job.level}</Position>
              </CompanyInfo>
              <JobInfo>
                <InfoItem>
                  <Label>근무지역</Label>
                  <Value>{job.location}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>주요업무</Label>
                  <Value>{job.responsibilities}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>자격요건</Label>
                  <Value>{job.qualification}</Value>
                </InfoItem>
              </JobInfo>
              <Deadline isExpired={isExpired}>
                {isExpired
                  ? "마감됨"
                  : `마감일: ${new Date(job.end_date).toLocaleDateString()}`}
              </Deadline>
            </JobCard>
          );
        })}
      </JobList>
    </Container>
  );
};

const Container = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 40px 20px;
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

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 24px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchIcon = styled(Search)`
  color: ${(props) => props.theme.colors.textSecondary};
  margin-right: 8px;
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  font-size: 16px;

  &:focus {
    outline: none;
  }
`;

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const JobCard = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground};
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CompanyInfo = styled.div`
  margin-bottom: 16px;

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 8px;
  }
`;

const Position = styled.div`
  font-size: 18px;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 600;
`;

const JobInfo = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px 0;
  border-top: 1px solid ${(props) => props.theme.colors.borderLight};
  border-bottom: 1px solid ${(props) => props.theme.colors.borderLight};
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 200px;
`;

const Label = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const Value = styled.span`
  font-size: 15px;
  color: ${(props) => props.theme.colors.text};
  white-space: pre-wrap;
  word-break: break-word;
`;

const Deadline = styled.div`
  font-size: 14px;
  color: ${(props) =>
    props.isExpired
      ? props.theme.colors.error
      : props.theme.colors.textSecondary};
  text-align: right;
  font-weight: ${(props) => (props.isExpired ? "600" : "normal")};
`;

const StatusFilter = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background-color: ${(props) =>
    props.active ? props.theme.colors.primary : "white"};
  color: ${(props) =>
    props.active ? "white" : props.theme.colors.textSecondary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

export default Jobs;
