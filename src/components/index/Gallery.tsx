import styled from 'styled-components';
import { Suspense, lazy, useState, useEffect, LazyExoticComponent } from "react";
// import ImageModal from "./ImageModal";

// const ImageModal = lazy(()=>import( './ImageModal'));
const ImageModal = lazyWithPreload(() => import('./ImageModal'));

type LazyWithPreloadReturnType<T extends React.ComponentType<any>> = LazyExoticComponent<T> & {
  preload: () => void;
};

function lazyWithPreload<T extends React.ComponentType<any>>(importFunction: () => Promise<{ default: T }>): LazyWithPreloadReturnType<T> {
  const Component = lazy(importFunction) as LazyWithPreloadReturnType<T>;
  Component.preload = () => { importFunction() };
  return Component;
}

const Gallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleMouseEnter = () => {
  //   const _ = import('./ImageModal');
  // }

  useEffect(() => {
    ImageModal.preload();
    // const img = new Image();
    // img.src = './0.jpg';
  },[])

  return (
    <div>
      <AlbumButton onClick={() => setIsModalOpen(true)}>My album</AlbumButton>
      {/* 
        * TODO 4.
        * [로딩 최적화 - 컴포넌트 Lazy Load] 
        * 'react-image-gallery'은 모달 내에서만 사용하는 모듈이지만
        * 메인페이지의 번들에 포함되어 있습니다.
      */}
      {/* <AlbumButton onClick={() => setIsModalOpen(true)} onMouseEnter={handleMouseEnter}>My album</AlbumButton> */}
      {/* 
        * TODO 4.
        * [로딩 최적화 - 컴포넌트 Preload] 
        * ImageModal 을 Lazy Loading 할 경우 
        * 클릭 후 리소스를 로드하기 때문에 모달이 즉시 표시되지 않습니다.
      */}

      {/* 
        * TODO 4.
        * [로딩 최적화 - 이미지 Preload] 
        * 처음 모달을 열었을 때 이미지를 로드하기 전과 후의 모달 사이즈가 달라집니다.
      */}
      <Suspense fallback={null}>
        { isModalOpen && <ImageModal onClose={() => setIsModalOpen(false)} />}
      </Suspense>
    </div>
  )
}

const AlbumButton = styled.button`
  width: 200px;
  background-color: #4CAF50;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3C9A4B;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transform: scale(1.05);
  }
`;

export default Gallery;
