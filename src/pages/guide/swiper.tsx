// src/pages/guide/swiper.tsx
import { useState, useRef } from 'react';
import { usePageLayout } from '@/hooks/usePageLayout';
import {
  Button,
  CodeHighlight,
  Swiper,
  SwiperSlide,
} from '@/components/common';
import type { SwiperRef } from '@/components/common';
import type { Swiper as SwiperType } from 'swiper/types';
import styles from '@/assets/scss/pages/guide.module.scss';

const SwiperGuide = () => {
  usePageLayout({
    title: '스와이퍼 / 컴포넌트 가이드',
    rightButtons: (
      <>
        <Button to="/" size="sm">
          Home
        </Button>
      </>
    ),
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperRef>(null);

  // 예시 이미지 데이터
  const images = [
    'https://picsum.photos/800/400?random=1',
    'https://picsum.photos/800/400?random=2',
    'https://picsum.photos/800/400?random=3',
    'https://picsum.photos/800/400?random=4',
    'https://picsum.photos/800/400?random=5',
  ];

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlide(swiper.activeIndex);
  };

  return (
    <div className="page-inner">
      <h1 className={styles.title}>Swiper Component</h1>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>설치</h2>
        <p className={styles.txt}>먼저 swiper 패키지를 설치해야 합니다.</p>
        <CodeHighlight code={`npm install swiper`} language="bash" />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>import</h2>
        <CodeHighlight
          code={`import { Swiper, SwiperSlide } from '@/components/common';
import type { SwiperRef } from '@/components/common';`}
          language="typescript"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>기본 사용법</h2>
        <p className={styles.txt}>가장 기본적인 스와이퍼 사용 방법입니다.</p>
        <div className={styles.showcase}>
          <Swiper preset="basic">
            <SwiperSlide>
              <div style={{ padding: '4rem', background: '#f0f0f0' }}>
                슬라이드 1
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div style={{ padding: '4rem', background: '#e0e0e0' }}>
                슬라이드 2
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div style={{ padding: '4rem', background: '#d0d0d0' }}>
                슬라이드 3
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Swiper preset="basic">
  <SwiperSlide>
    <div style={{ padding: '4rem', background: '#f0f0f0' }}>슬라이드 1</div>
  </SwiperSlide>
  <SwiperSlide>
    <div style={{ padding: '4rem', background: '#e0e0e0' }}>슬라이드 2</div>
  </SwiperSlide>
  <SwiperSlide>
    <div style={{ padding: '4rem', background: '#d0d0d0' }}>슬라이드 3</div>
  </SwiperSlide>
</Swiper>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>자동재생 스와이퍼</h2>
        <p className={styles.txt}>
          자동으로 슬라이드가 넘어가는 스와이퍼입니다.
        </p>
        <div className={styles.showcase}>
          <Swiper preset="autoplay" navigation pagination>
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`슬라이드 ${index + 1}`}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Swiper preset="autoplay" navigation pagination>
  {images.map((src, index) => (
    <SwiperSlide key={index}>
      <img 
        src={src} 
        alt={\`슬라이드 \${index + 1}\`}
        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
      />
    </SwiperSlide>
  ))}
</Swiper>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>배너 스와이퍼</h2>
        <p className={styles.txt}>
          배너용 스와이퍼로, 페이지네이션과 자동재생이 포함되어 있습니다.
        </p>
        <div className={styles.showcase}>
          <Swiper preset="banner">
            {images.slice(0, 3).map((src, index) => (
              <SwiperSlide key={index}>
                <div
                  style={{
                    backgroundImage: `url(${src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  배너 {index + 1}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Swiper preset="banner">
  {images.slice(0, 3).map((src, index) => (
    <SwiperSlide key={index}>
      <div style={{ 
        backgroundImage: \`url(\${src})\`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        배너 {index + 1}
      </div>
    </SwiperSlide>
  ))}
</Swiper>`}
          language="jsx"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>카드 스와이퍼</h2>
        <p className={styles.txt}>
          카드 형태의 스와이퍼로, 중앙 정렬되고 비활성 슬라이드는 작게
          표시됩니다.
        </p>
        <div className={styles.showcase}>
          <Swiper preset="card">
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`카드 ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Swiper preset="card">
  {images.map((src, index) => (
    <SwiperSlide key={index}>
      <img 
        src={src} 
        alt={\`카드 \${index + 1}\`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </SwiperSlide>
  ))}
</Swiper>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>갤러리 스와이퍼</h2>
        <p className={styles.txt}>
          반응형 갤러리 스와이퍼로, 화면 크기에 따라 슬라이드 개수가 변경됩니다.
        </p>
        <div className={styles.showcase}>
          <Swiper preset="gallery">
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`갤러리 ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Swiper preset="gallery">
  {images.map((src, index) => (
    <SwiperSlide key={index}>
      <img 
        src={src} 
        alt={\`갤러리 \${index + 1}\`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </SwiperSlide>
  ))}
</Swiper>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>페이드 효과</h2>
        <p className={styles.txt}>
          슬라이드가 페이드 인/아웃 효과로 전환됩니다.
        </p>
        <div className={styles.showcase}>
          <Swiper preset="fade" navigation pagination>
            {images.slice(0, 3).map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`페이드 ${index + 1}`}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Swiper preset="fade" navigation pagination>
  {images.slice(0, 3).map((src, index) => (
    <SwiperSlide key={index}>
      <img 
        src={src} 
        alt={\`페이드 \${index + 1}\`}
        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
      />
    </SwiperSlide>
  ))}
</Swiper>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>커버플로우 효과</h2>
        <p className={styles.txt}>
          3D 커버플로우 효과가 적용된 스와이퍼입니다.
        </p>
        <div className={styles.showcase}>
          <Swiper preset="coverflow" navigation>
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <div
                  style={{
                    backgroundImage: `url(${src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Swiper preset="coverflow" navigation>
  {images.map((src, index) => (
    <SwiperSlide key={index}>
      <div style={{
        backgroundImage: \`url(\${src})\`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%'
      }} />
    </SwiperSlide>
  ))}
</Swiper>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>외부 제어</h2>
        <p className={styles.txt}>
          ref를 사용하여 외부에서 스와이퍼를 제어할 수 있습니다.
        </p>
        <div className={styles.showcase}>
          <div style={{ marginBottom: '2rem' }}>
            <p>현재 슬라이드: {currentSlide + 1}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Button
                size="sm"
                className="primary"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                이전
              </Button>
              <Button
                size="sm"
                className="primary"
                onClick={() => swiperRef.current?.slideNext()}
              >
                다음
              </Button>
              <Button
                size="sm"
                className="secondary"
                onClick={() => swiperRef.current?.slideTo(0)}
              >
                첫 번째로
              </Button>
            </div>
          </div>

          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            spaceBetween={0}
            onSlideChange={handleSlideChange}
          >
            {images.slice(0, 3).map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`제어 ${index + 1}`}
                  style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`const [currentSlide, setCurrentSlide] = useState(0);
const swiperRef = useRef<SwiperRef>(null);

const handleSlideChange = (swiper: SwiperType) => {
  setCurrentSlide(swiper.activeIndex);
};

// 버튼 클릭 핸들러
<Button onClick={() => swiperRef.current?.slidePrev()}>이전</Button>
<Button onClick={() => swiperRef.current?.slideNext()}>다음</Button>
<Button onClick={() => swiperRef.current?.slideTo(0)}>첫 번째로</Button>

// Swiper 컴포넌트
<Swiper 
  ref={swiperRef}
  slidesPerView={1}
  spaceBetween={0}
  onSlideChange={handleSlideChange}
>
  {images.slice(0, 3).map((src, index) => (
    <SwiperSlide key={index}>
      <img 
        src={src} 
        alt={\`제어 \${index + 1}\`}
        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
      />
    </SwiperSlide>
  ))}
</Swiper>`}
          language="jsx"
        />
      </section>
      <section className={styles.section}>
        <h2 className={styles['section-title']}>커스텀 설정</h2>
        <p className={styles.txt}>
          preset를 사용하지 않고 직접 옵션을 설정할 수 있습니다.
        </p>
        <div className={styles.showcase}>
          <Swiper
            slidesPerView={2}
            spaceBetween={30}
            loop={true}
            navigation={true}
            pagination={{ clickable: true }}
            responsive={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
            }}
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`커스텀 ${index + 1}`}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Swiper 
  slidesPerView={2}
  spaceBetween={30}
  loop={true}
  navigation={true}
  pagination={{ clickable: true }}
  responsive={{
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
  }}
>
  {images.map((src, index) => (
    <SwiperSlide key={index}>
      <img 
        src={src} 
        alt={\`커스텀 \${index + 1}\`}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
    </SwiperSlide>
  ))}
</Swiper>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>고급 옵션</h2>
        <p className={styles.txt}>
          swiperOptions prop을 사용하여 더 세밀한 설정을 할 수 있습니다.
        </p>
        <div className={styles.showcase}>
          <Swiper
            preset="basic"
            swiperOptions={{
              speed: 1000,
              grabCursor: true,
              watchSlidesProgress: true,
              slidesPerView: 'auto',
              spaceBetween: 20,
              centeredSlides: true,
              autoplay: {
                delay: 2000,
                disableOnInteraction: false,
              },
              pagination: {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: function (index: number, className: string) {
                  return (
                    '<span class="' + className + '">' + (index + 1) + '</span>'
                  );
                },
              },
            }}
          >
            {images.slice(0, 4).map((src, index) => (
              <SwiperSlide key={index} style={{ width: 'auto' }}>
                <div
                  style={{
                    width: '250px',
                    height: '150px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={src}
                    alt={`고급 ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <h3 className={styles['sub-title']}>참조 소스코드</h3>
        <CodeHighlight
          code={`<Swiper 
  preset="basic"
  swiperOptions={{
    speed: 1000,
    grabCursor: true,
    watchSlidesProgress: true,
    slidesPerView: 'auto',
    spaceBetween: 20,
    centeredSlides: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: function (index: number, className: string) {
        return '<span class="' + className + '">' + (index + 1) + '</span>';
      },
    },
  }}
>
  {images.slice(0, 4).map((src, index) => (
    <SwiperSlide key={index} style={{ width: 'auto' }}>
      <div style={{ 
        width: '250px', 
        height: '150px',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <img 
          src={src} 
          alt={\`고급 \${index + 1}\`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </SwiperSlide>
  ))}
</Swiper>`}
          language="jsx"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>Props</h2>
        <div className={styles.showcase}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  속성
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  타입
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  기본값
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  설명
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  preset
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  SwiperPreset
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  미리 정의된 설정 (basic, autoplay, card, banner, gallery,
                  fade, coverflow, cards)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  slidesPerView
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  number | 'auto'
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  1
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  한 번에 보여줄 슬라이드 개수
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  spaceBetween
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  number
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  0
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  슬라이드 간 간격 (px)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  loop
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  false
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  무한 루프 여부
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  autoplay
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean | AutoplayOptions
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  false
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  자동재생 설정
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  navigation
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean | NavigationOptions
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  false
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  네비게이션 버튼 표시
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  pagination
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  boolean | PaginationOptions
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  false
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  페이지네이션 표시
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  effect
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  'slide' | 'fade' | 'cube' | 'coverflow' | 'cards'
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  'slide'
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  전환 효과
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  responsive
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ResponsiveSettings
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  반응형 설정
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  swiperOptions
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  SwiperOptions
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  고급 swiper 옵션 직접 전달
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>SwiperRef 메서드</h2>
        <div className={styles.showcase}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  메서드
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  파라미터
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  설명
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  slideTo
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  index: number, speed?: number
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  특정 슬라이드로 이동
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  slideNext
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  다음 슬라이드로 이동
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  slidePrev
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  이전 슬라이드로 이동
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  update
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  -
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  swiper 업데이트
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>사용 팁</h2>
        <div className={styles.showcase}>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>Preset 활용:</strong> 일반적인 용도라면 preset을 사용하여
              빠르게 구현할 수 있습니다.
            </li>
            <li>
              <strong>반응형 설정:</strong> responsive prop을 사용하여 화면
              크기별로 다른 설정을 적용할 수 있습니다.
            </li>
            <li>
              <strong>성능 최적화:</strong> 이미지가 많은 경우 lazy loading을
              고려해보세요.
            </li>
            <li>
              <strong>접근성:</strong> keyboard navigation과 screen reader
              지원을 위해 적절한 ARIA 속성이 자동으로 추가됩니다.
            </li>
            <li>
              <strong>터치 제스처:</strong> 모바일에서 터치 스와이프가 자동으로
              지원됩니다.
            </li>
            <li>
              <strong>커스텀 스타일:</strong> CSS 모듈을 통해 swiper 스타일을
              쉽게 커스터마이징할 수 있습니다.
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>전체 코드 예시</h2>
        <div className={styles.showcase}>
          <p>완전한 Swiper 컴포넌트 사용 예시입니다.</p>
          <pre
            style={{
              background: '#f6f8fa',
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto',
            }}
          >
            <code>{`import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from '@/components/common';
import type { SwiperRef } from '@/components/common';

function MyComponent() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperRef>(null);
  
  const images = [
    'https://picsum.photos/800/400?random=1',
    'https://picsum.photos/800/400?random=2',
    'https://picsum.photos/800/400?random=3',
  ];

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlide(swiper.activeIndex);
  };

  return (
    <div>
      {/* 기본 사용법 */}
      <Swiper preset="autoplay" navigation pagination>
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} alt={\`슬라이드 \${index + 1}\`} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* 외부 제어 */}
      <Swiper 
        ref={swiperRef}
        slidesPerView={1}
        onSlideChange={handleSlideChange}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} alt={\`슬라이드 \${index + 1}\`} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      <button onClick={() => swiperRef.current?.slideNext()}>
        다음
      </button>
    </div>
  );
}`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
};

export default SwiperGuide;
