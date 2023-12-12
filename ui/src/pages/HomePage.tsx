import { useEffect } from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import { Items, Slides } from '@components/home';
import { HOME_CONTACT } from '@constants';
import { useHomeStore } from '@states';

export function HomePage() {
  const { slideData, itemData, getSlideData, getItemData } = useHomeStore();

  useEffect(() => {
    getSlideData();
    getItemData();
  }, [getSlideData, getItemData]);

  return (
    <>
      <div>
        <Slides slides={slideData} />
      </div>
      <div className='p-4 lg:p-16 text-center bg-white'>
        <Typography className='text-xl px-8 mb-5 lg:text-[40px] lg:mb-8 font-bold'>
          Dễ dàng tiếp cận. Tự do sáng tạo
        </Typography>
        <Typography variant='paragraph' className='text-sm lg:text-xl'>
          Các mẫu đơn giản, đa dạng có sẵn giúp dễ dàng tiếp cận. Tải lên mẫu cho các yêu cầu nâng
          cao.
        </Typography>
      </div>
      <div className='py-11 flex flex-col lg:flex-row justify-center items-center gap-6'>
        {HOME_CONTACT.map((item, index) => (
          <Card key={index}>
            <CardBody className='flex items-center justify-items-center lg:gap-4 lg:flex-col bg-white w-[250px] hover:bg-red-300 lg:hover:bg-red-400 hover:text-white cursor-pointer'>
              <div className='lg:bg-gray-300 lg:w-full py-2 flex lg:justify-center mr-2 text-red-500'>
                {item.icon}
              </div>
              <div className='lg:text-center'>
                <Typography variant='paragraph' className='font-medium'>
                  {item.mainContent}
                </Typography>
                <Typography variant='paragraph' className='font-medium'>
                  {item.subContent}
                </Typography>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <div>
        <Typography variant='h3' className='text-center'>
          Mô hình 3D được mua nhiều tại cửa hàng
        </Typography>
        <Items items={itemData} />
      </div>
    </>
  );
}
