import styled from "styled-components";

const VideoBackground = () => {
  return (
    <VideoWrapper>
      <StyledVideo loop autoPlay muted playsInline>
        <source
          src="https://cdn.pixabay.com/video/2020/03/03/33194-396036988_large.mp4"
          type="video/mp4"
        />
      </StyledVideo>
      <VideoOverlay />
      <MainContent>
        <Title>ASK 2.0</Title>
        <SubTitle>새로운 시작을 함께하세요</SubTitle>
      </MainContent>
    </VideoWrapper>
  );
};

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
  max-width: var(--max-width);
  margin: 0 auto;
  margin-top: calc(var(--header-height) * -1); /* Header 높이만큼 위로 이동 */
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.5)
  );
  z-index: 2;
`;

const MainContent = styled.div`
  position: absolute;
  z-index: 3;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  text-align: center;
  padding-top: var(--header-height); /* 컨텐츠는 헤더 아래에 위치하도록 유지 */
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const SubTitle = styled.p`
  font-size: 24px;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

export default VideoBackground;
