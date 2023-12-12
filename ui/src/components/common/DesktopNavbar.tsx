import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Chip, List, ListItem, Input, Tooltip } from '@material-tailwind/react';
import { MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import tick3D from '@assets/tick3D-logo.svg';
import { CATEGORY_LIST, MENU_BAR } from '@constants';
import { useMenuBarStore } from '@states';

export const DesktopNavbar: Component<{ menu: RouteMenu }> = ({ menu }) => {
  const {
    selectedMenu,
    selectedCategoryItem,
    setSelectedMenu,
    setSelectedCategoryItem,
    setIsCategoryItem
  } = useMenuBarStore();

  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false)
  };

  const NAVBAR_ITEM_CLASSNAME =
    'hover:bg-gray/1 focus:bg-blue-100 active:bg-blue-100 focus:text-blue/1 active:text-blue/1 focus:font-bold active:font-bold text-gray/4 font-medium rounded-lg text-lg w-fit text-center';
  const CATEGORYLIST_ITEM_CLASSNAME =
    'hover:bg-gray/1 focus:bg-blue-100 active:bg-blue-100 focus:text-blue/1 active:text-blue/1 focus:font-bold active:font-bold px-6 rounded-none text-gray/4 font-medium';

  return (
    <div className='flex items-center'>
      <div className='max-w-[40px] max-h-[40px] ml-0 mr-3 object-cover'>
        <img className='w-full h-full' src={tick3D} alt='tick3D-logo'></img>
      </div>
      <List className='p-0 flex flex-row items-center gap-3 max-w-[calc(100%-36px)]'>
        {menu.map((menuItem, idx) => {
          if (menuItem === 'divider') return;
          if (menuItem.type === 'item') {
            if (menuItem.name === MENU_BAR.category)
              return (
                <Tooltip
                  key={idx}
                  open={openPopover}
                  handler={setOpenPopover}
                  {...triggers}
                  className='bg-white'
                  content={
                    <List className='p-0'>
                      {CATEGORY_LIST.map((item, idx) => (
                        <ListItem
                          key={idx}
                          className={
                            CATEGORYLIST_ITEM_CLASSNAME +
                            (selectedCategoryItem === item
                              ? ' bg-blue-100 text-blue/1 font-bold pointer-events-none'
                              : '')
                          }
                          onClick={() => {
                            setSelectedMenu(menuItem.name);
                            setSelectedCategoryItem(item);
                          }}
                        >
                          {item}
                        </ListItem>
                      ))}
                    </List>
                  }
                >
                  <Link to={menuItem.path}>
                    <ListItem
                      className={
                        NAVBAR_ITEM_CLASSNAME +
                        (selectedMenu === menuItem.name ? ' bg-blue-100 text-blue/1 font-bold' : '')
                      }
                      onClick={() => {
                        setSelectedMenu(menuItem.name);
                      }}
                    >
                      {menuItem.name}
                    </ListItem>
                  </Link>
                </Tooltip>
              );
            if (idx === 2)
              return (
                <div key={idx} className='flex items-center gap-4'>
                  <div className='text-center min-w-[350px] xl:min-w-[500px]'>
                    <Input
                      size='lg'
                      crossOrigin=''
                      icon={<MagnifyingGlassIcon className='w-5 h-5' />}
                      label='Search for anything'
                    />
                  </div>
                  <Link to={menuItem.path}>
                    <ListItem
                      className={
                        NAVBAR_ITEM_CLASSNAME +
                        (selectedMenu === menuItem.name
                          ? ' bg-blue-100 text-blue/1 font-bold pointer-events-none'
                          : '')
                      }
                      onClick={() => {
                        setSelectedMenu(menuItem.name);
                        setIsCategoryItem(false);
                      }}
                    >
                      {menuItem.name}
                    </ListItem>
                  </Link>
                  <Link to='/cart'>
                    <ShoppingCartIcon strokeWidth={2} className='w-6 h-6 cursor-pointer' />
                  </Link>
                </div>
              );
            return (
              <Link key={idx} to={menuItem.path}>
                <ListItem
                  className={
                    'hover:bg-gray/1 focus:bg-blue-100 active:bg-blue-100 focus:text-blue/1 active:text-blue/1 focus:font-bold active:font-bold text-gray/4 font-medium rounded-lg text-lg w-fit text-center' +
                    (selectedMenu === menuItem.name
                      ? ' bg-blue-100 text-blue/1 font-bold pointer-events-none'
                      : '')
                  }
                  onClick={() => {
                    setSelectedMenu(menuItem.name);
                    setIsCategoryItem(false);
                  }}
                >
                  {idx < menu.length - 2 && menuItem.name}
                  {idx === menu.length - 2 && (
                    <Chip
                      variant='outlined'
                      size='lg'
                      value={<span className='normal-case text-sm'>{menuItem.name}</span>}
                    />
                  )}
                  {idx === menu.length - 1 && (
                    <Chip
                      size='lg'
                      value={<span className='normal-case text-sm'>{menuItem.name}</span>}
                    />
                  )}
                </ListItem>
              </Link>
            );
          }
        })}
      </List>
    </div>
  );
};
