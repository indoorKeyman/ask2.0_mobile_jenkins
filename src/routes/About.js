import styled from "styled-components";

const About = () => {
  return (
    <Wrapper>
      <Container>
        <Section>
          <TitleWrapper>
            <TitleText>ASK</TitleText>
            <VersionText>2.0</VersionText>
          </TitleWrapper>

          <Description>새로운 도약을 위한 혁신적인 플랫폼</Description>
        </Section>

        <Section>
          <SubTitle>우리의 미션</SubTitle>
          <ContentGrid>
            <Card>
              <CardTitle>혁신</CardTitle>
              <CardText>
                최신 기술과 창의적인 아이디어로 새로운 가치를 창출합니다.
              </CardText>
            </Card>
            <Card>
              <CardTitle>성장</CardTitle>
              <CardText>구성원들의 지속적인 성장과 발전을 지원합니다.</CardText>
            </Card>
            <Card>
              <CardTitle>협력</CardTitle>
              <CardText>열린 소통과 긴밀한 협력으로 함께 성장합니다.</CardText>
            </Card>
          </ContentGrid>
        </Section>

        <Section>
          <SubTitle>주요 서비스</SubTitle>
          <ServiceList>
            <ServiceItem>
              <ServiceIcon>💼</ServiceIcon>
              <ServiceTitle>채용 정보</ServiceTitle>
              <ServiceDescription>
                다양한 분야의 채용 정보를 제공하여 경력 성장을 지원합니다.
              </ServiceDescription>
            </ServiceItem>
            <ServiceItem>
              <ServiceIcon>💡</ServiceIcon>
              <ServiceTitle>커뮤니티</ServiceTitle>
              <ServiceDescription>
                전문가들과의 네트워킹과 정보 공유의 장을 제공합니다.
              </ServiceDescription>
            </ServiceItem>
            <ServiceItem>
              <ServiceIcon>📚</ServiceIcon>
              <ServiceTitle>교육 프로그램</ServiceTitle>
              <ServiceDescription>
                실무 중심의 교육으로 전문성을 향상시킵니다.
              </ServiceDescription>
            </ServiceItem>
          </ServiceList>
        </Section>
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

const Section = styled.section`
  margin-top: 60px;
  margin-bottom: 80px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
`;

const TitleText = styled.span`
  font-size: 48px;
  font-weight: 800;
  letter-spacing: 2px;
  color: ${(props) => props.theme.colors.primary};
  font-family: "Arial", sans-serif;
`;

const VersionText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const Description = styled.p`
  font-size: 24px;
  color: ${(props) => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 60px;
`;

const SubTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 40px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const Card = styled.div`
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 16px;
`;

const CardText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.text};
`;

const ServiceList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
`;

const ServiceItem = styled.div`
  text-align: center;
  padding: 20px;
`;

const ServiceIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const ServiceTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 16px;
`;

const ServiceDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.textSecondary};
`;

export default About;
