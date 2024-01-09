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
  box-sizing: border-box;
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
  height: calc(100% - 10px);
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
  height: calc(100% - 10px);
  display: flex;
  align-items: ${(props) => (props.$isShowPlayList ? 'flex-start' : 'center')};
  flex-direction: column;
  gap: 5px;

  padding: 10px;
  box-sizing: border-box;

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

const PlayList = styled.div<{ $isShowPlayList: Boolean; $thumbnail: String }>`
  display: ${(props) => (props.$isShowPlayList ? 'flex' : 'none')};
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 104px);
  background-color: #34343e;
  overflow-y: scroll;
`;

const PlayListVideo = styled.div<{ $isMyVideo: Boolean | string }>`
  display: grid;
  grid-template-columns: 150px auto;
  gap: 10px;
  font-size: 14px;
  color: #e4e4e4;
  background-color: ${(props) => (props.$isMyVideo ? '#0a0a12' : 'transparent')};
  box-sizing: border-box;
  padding: 10px 15px;
  cursor: pointer;
  &:first-child {
    padding: 20px 15px 10px 15px;
  }
  &:last-child {
    padding: 10px 15px 20px 15px;
  }
  img {
    width: 100%;
  }
`;

interface PlaylistItem {
  videoFilePath: string;
  filename: string;
  imgData: string;
}

function App() {
  const [isShowPlayList, setIsShowPlayList] = useState<Boolean>(true);
  const [videoFilePath, setVideoFilePath] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [playList, setPlayList] = useState<PlaylistItem[]>([]);
  const [isMyvideo, setIsMyvideo] = useState<string>('');

  useEffect(() => {
    if (thumbnail == '') return;
    const playListResData: object = { videoFilePath: videoFilePath, filename: filename, imgData: thumbnail };
    setPlayList((prevItems: any[]) => [...prevItems, playListResData]);

    console.log({ playList });
  }, [thumbnail]);

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
    setIsMyvideo(videoFileInfo.name);
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

    //지금 선택한 파일 이름
    const filenameToCheck = e.target.files[0].name;

    if (playList.some((item) => item.filename === filenameToCheck)) {
      setThumbnail(''); // 이미 플레이리스트에 있는 파일은 썸네일을 리셋
    }
  };

  const changeThisVideo = (idx: number) => {
    setVideoFilePath(playList[idx].videoFilePath);
    console.log({ filename });
    setIsMyvideo(playList[idx].filename);
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
              <PlayListVideo key={idx} $isMyVideo={playList[idx].filename == isMyvideo} onClick={() => changeThisVideo(idx)}>
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
