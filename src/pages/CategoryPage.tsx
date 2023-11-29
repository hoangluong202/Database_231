import { useEffect, useState } from 'react';
import { Button, Chip, List, ListItem, Select, Option, Typography } from '@material-tailwind/react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { Items } from '@components/home';
import { FilterDrawer, FilterAccordion } from '@components/category';
import { ScreenSize } from '@constants';
import { useScreenSize } from '@hooks';
import { useCategoryStore } from '@states';

export function CategoryPage() {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const { screenSize } = useScreenSize();
  const { allCategory, getAllCategory } = useCategoryStore();

  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

  return (
    <>
      <div className='flex justify-between items-center pe-6'>
        <div className='flex gap-10 justify-center md:justify-start items-center m-5'>
          <Button
            onClick={() => setOpenDrawer(!openDrawer)}
            variant='outlined'
            size='md'
            className='flex items-center gap-2'
          >
            <AdjustmentsHorizontalIcon className='w-5 h-5' />
            Filter
          </Button>
          <div className='md:w-72 w-fit'>
            <Select
              label='Sort by'
              size='lg'
              color='blue-gray'
              labelProps={{ className: 'text-black' }}
            >
              <Option>Most Popular</Option>
              <Option>Price</Option>
              <Option>Like</Option>
              <Option>Upload Time</Option>
            </Select>
          </div>
        </div>
        {screenSize > ScreenSize.MD ? <span>10000 results</span> : null}
      </div>
      <div className='flex mx-5'>
        {screenSize > ScreenSize.MD ? (
          <div className={openDrawer ? 'w-52 pe-5' : ''}>{openDrawer && <FilterAccordion />}</div>
        ) : null}
        {screenSize <= ScreenSize.SM ? (
          <List className='grid gap-2 w-full'>
            {allCategory.map((item, index) => (
              <ListItem
                key={index}
                className='flex gap-5 border-2 border-b-gray-400 cursor-pointer rounded-lg p-4'
              >
                <img src={item.image} alt={item.name} className='w-40 h-40 md:w-full md:h-full' />
                <div className='flex flex-col gap-3'>
                  <Typography variant='lead' className='font-bold truncate'>
                    {item.name}
                  </Typography>
                  <Typography variant='paragraph'>{item.description}</Typography>
                  <Chip
                    color='amber'
                    value={`${item.price.toLocaleString('en-US')} VNĐ`}
                    className='w-fit'
                  />

                  <div className='flex items-center justify-between'>
                    <Typography variant='h6' className='font-bold'>
                      {`Đã mua: ${item.numberBought}`}
                    </Typography>
                    <Button className='bg-red-500 text-white normal-case truncate p-4'>
                      Đặt hàng
                    </Button>
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
        ) : (
          <Items items={allCategory} />
        )}
      </div>
      {screenSize <= ScreenSize.MD ? (
        <FilterDrawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
          <FilterAccordion closeDrawer={() => setOpenDrawer(false)} />
        </FilterDrawer>
      ) : null}
    </>
  );
}
