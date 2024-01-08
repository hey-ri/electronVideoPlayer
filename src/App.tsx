import { useEffect, useState } from 'react';
import './App.css';
import styled from 'styled-components';
import { LuPanelLeftClose } from 'react-icons/lu';

const Title = styled.h1`
  font-size: 16px;
  /* width: 100%; */
  height: 30px;
  line-height: 30px;
  background-color: #0a0a12;
  color: #e7c00e;
  padding-left: 8px;
`;

const Wrapper = styled.div<{ $isShowPlayList: Boolean }>`
  width: 100%;
  height: calc(100vh - 30px);
  background-color: #34343e;
  display: grid;
  grid-template-columns: ${(props) => (props.$isShowPlayList ? '70% auto' : 'auto 50px')};
`;
const VideoWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;
const VideoPlayer = styled.video`
  object-fit: contain;
  width: 100%;
`;
const PlayListWrapper = styled.div<{ $isShowPlayList: Boolean }>`
  background-color: #1c1c22;
  /* background-color: #636363; */
  /* min-width: 50px; */
  height: calc(100% - 30px);
  display: flex;
  align-items: ${(props) => (props.$isShowPlayList ? 'flex-start' : 'center')};
  flex-direction: column;
  gap: 5px;

  padding: 10px;

  input {
    display: ${(props) => (props.$isShowPlayList ? 'block' : 'none')};
  }
  > button {
    width: 30px;
    height: 30px;
    background-color: transparent;
    border: 0;
  }
`;

const PlayList = styled.div<{ $isShowPlayList: Boolean; thumbnail: String }>`
  display: ${(props) => (props.$isShowPlayList ? 'grid' : 'none')};
  grid-template-rows: repeat(auto, 1fr);
  gap: 15px;
  height: calc(100vh - 104px);
  overflow: ${(props) => (props.thumbnail ? 'scroll' : 'auto')};
`;

const PlayListVideo = styled.div`
  display: grid;
  grid-template-columns: 150px auto;
  gap: 10px;
  font-size: 14px;
  color: #e4e4e4;
  img {
    width: 100%;
  }
`;

function App() {
  const [isShowPlayList, setIsShowPlayList] = useState<Boolean>(false);
  const [videoFilePath, setVideoFilePath] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [playList, setPlayList] = useState<Array<object>>([]);

  useEffect(() => {
    if (thumbnail == '') return;
    const playListResData: object = { videoFilePath: videoFilePath, filename: filename, imgData: thumbnail };
    setPlayList((prevItems: any) => [...prevItems, playListResData]);

    console.log(playList);
  }, [thumbnail, filename, videoFilePath]);

  const onShowPL = () => {
    setIsShowPlayList((s) => (s = !s));
  };

  const addVideoPL = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return;
    handleFileUpload(e);

    const videoFileInfo = e.target.files[0];
    const videoFilePath = URL.createObjectURL(videoFileInfo);

    setVideoFilePath(videoFilePath);
    setFilename(videoFileInfo.name);
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
          <VideoPlayer src={videoFilePath} autoPlay controls muted />
        </VideoWrap>
        <PlayListWrapper $isShowPlayList={isShowPlayList}>
          <button>
            <LuPanelLeftClose style={{ strokeWidth: '1.5', color: '#e4e4e4', fontSize: 24 }} onClick={onShowPL} />
          </button>
          <input type="file" onChange={addVideoPL} />
          <PlayList $isShowPlayList={isShowPlayList} $thumbnail={thumbnail}>
            {playList.map((pl: any, idx: number) => (
              <PlayListVideo key={idx}>
                <img src={pl.imgData} alt="" />
                <p>{pl.filename}</p>
              </PlayListVideo>
            ))}
          </PlayList>
        </PlayListWrapper>
      </Wrapper>
    </>
  );
}

export default App;
