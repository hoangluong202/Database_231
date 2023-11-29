import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export const ImageSlider: Component<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };
  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  return (
    <div className='flex flex-col items-center mb-3 lg:mb-0 lg:w-[40%] justify-center'>
      <div className='mb-3 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] lg:mb-8'>
        <img src={images[currentIndex]} alt='' className='w-full h-full object-cover' />
      </div>
      <div className='flex'>
        <ChevronLeftIcon
          onClick={handlePrev}
          width={24}
          color='red'
          className='cursor-pointer lg:w-[40px]'
        />
        <div className='flex items-center gap-2'>
          {images.map((image, index) => (
            <div key={index} className='w-[50px] h-[50px] lg:w-[100px] lg:h-[100px]'>
              <img
                src={image}
                className={`w-full h-full object-cover ${
                  currentIndex !== index ? 'opacity-40' : ''
                }`}
              />
            </div>
          ))}
        </div>
        <ChevronRightIcon
          onClick={handleNext}
          width={24}
          color='red'
          className='cursor-pointer lg:w-[40px]'
        />
      </div>
    </div>
  );
};
