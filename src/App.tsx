import { useState } from 'react';
import './App.css';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 16px;
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #0a0a12;
  color: #e7c00e;
  padding-left: 8px;
`;

const Wrapper = styled.div<{ $isShowPlayList: Boolean }>`
  width: 100%;
  height: 100vh;
  background-color: #34343e;
  display: grid;
  grid-template-columns: ${(props) => (props.$isShowPlayList ? '80% auto' : 'auto 60px')};
`;
const VideoWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const VideoPlayer = styled.video`
  object-fit: contain;
  width: 100%;
`;
const PlayList = styled.div`
  background-color: #1c1c22;
  width: 100%;
  height: 100%;
`;

function App() {
  const [isShowPlayList, setIsShowPlayList] = useState<Boolean>(false);
  const [videoName, setVideoName] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<string>('');

  const onShowPL = () => {
    setIsShowPlayList((s) => (s = !s));
  };

  const addVideoPL = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return;

    const videoFileInfo = e.target.files[0];
    const videoFilePath = URL.createObjectURL(videoFileInfo);
    console.log(videoFileInfo);
    setVideoName(videoFilePath);
    console.log({ videoName });

    handleFileUpload(e);
  };

  const generateVideoThumbnail = (file: File) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const video = document.createElement('video');

      // this is important
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        let ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        if (ctx == null) return;
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();
        return resolve(canvas.toDataURL('image/png'));
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return;
    const thumbnail = await generateVideoThumbnail(e.target.files[0]);

    setThumbnail(thumbnail as string);
  };
  return (
    <>
      <Title>Electron Video Player</Title>

      <Wrapper $isShowPlayList={isShowPlayList}>
        <VideoWrap>
          <VideoPlayer src={videoName} autoPlay controls muted />
        </VideoWrap>
        <PlayList onClick={onShowPL}>
          <input type="file" onChange={addVideoPL} />
          <img src={thumbnail} alt="" />
        </PlayList>
      </Wrapper>
    </>
  );
}

export default App;
