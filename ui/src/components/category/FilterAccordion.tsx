import { useState } from 'react';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  List,
  ListItem
} from '@material-tailwind/react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { CATEGORY_LIST } from '@constants';
import { useMenuBarStore } from '@states';

export const FilterAccordion: Component<{
  closeDrawer?: () => void;
}> = ({ closeDrawer }) => {
  const [open, setOpen] = useState<number>(0);
  const { selectedCategoryItem, setSelectedCategoryItem } = useMenuBarStore();

  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  const CATEGORYBAR_ITEM_CLASSNAME =
    'hover:bg-gray/1 focus:bg-blue-100 active:bg-blue-100 focus:text-blue/1 active:text-blue/1 focus:font-bold active:font-bold px-6 rounded-none text-gray/4 font-medium';

  return (
    <div className='w-full'>
      <Accordion
        open={open === 1}
        icon={
          open === 1 ? (
            <ChevronUpIcon className='w-5 h-5' />
          ) : (
            <ChevronDownIcon className='w-5 h-5' />
          )
        }
      >
        <AccordionHeader onClick={() => handleOpen(1)}>Categories</AccordionHeader>
        <AccordionBody>
          <div className='flex flex-col'>
            <List className='p-0'>
              {CATEGORY_LIST.map((item, idx) => (
                <ListItem
                  key={idx}
                  className={
                    CATEGORYBAR_ITEM_CLASSNAME +
                    (selectedCategoryItem === item
                      ? ' bg-blue-100 text-blue/1 font-bold pointer-events-none'
                      : '')
                  }
                  onClick={() => {
                    setSelectedCategoryItem(item);
                    closeDrawer?.();
                  }}
                >
                  {item}
                </ListItem>
              ))}
            </List>
          </div>
        </AccordionBody>
      </Accordion>
      <Accordion
        open={open === 2}
        icon={
          open === 2 ? (
            <ChevronUpIcon className='w-5 h-5' />
          ) : (
            <ChevronDownIcon className='w-5 h-5' />
          )
        }
      >
        <AccordionHeader onClick={() => handleOpen(2)}>Price Range</AccordionHeader>
        <AccordionBody>price</AccordionBody>
      </Accordion>
      <Accordion
        open={open === 3}
        icon={
          open === 3 ? (
            <ChevronUpIcon className='w-5 h-5' />
          ) : (
            <ChevronDownIcon className='w-5 h-5' />
          )
        }
      >
        <AccordionHeader onClick={() => handleOpen(3)}>Upload Date</AccordionHeader>
        <AccordionBody>upload date</AccordionBody>
      </Accordion>
    </div>
  );
};
