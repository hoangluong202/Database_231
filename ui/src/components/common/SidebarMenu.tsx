import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemSuffix, Typography } from '@material-tailwind/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import tick3D from '@assets/tick3D-logo.svg';
import { ToggleSidebarBtn } from '@components/common';
import { MENU_BAR, CATEGORY_LIST } from '@constants';
import { useMenuBarStore } from '@states';

export function useSidebarMenu() {
  const {
    selectedMenu,
    isCategoryItem,
    selectedCategoryItem,
    setSelectedMenu,
    setIsCategoryItem,
    setSelectedCategoryItem
  } = useMenuBarStore();

  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const SIDEBAR_ITEM_CLASSNAME =
    'hover:bg-gray/1 focus:bg-blue-100 active:bg-blue-100 focus:text-blue/1 active:text-blue/1 focus:font-bold active:font-bold h-14 px-6 py-4 rounded-none text-gray/4 font-medium';
  const CATEGORYBAR_ITEM_CLASSNAME =
    'hover:bg-gray/1 focus:bg-blue-100 active:bg-blue-100 focus:text-blue/1 active:text-blue/1 focus:font-bold active:font-bold px-6 rounded-none text-gray/4 font-medium';

  const CategoryBar = useMemo(
    () => () => {
      return (
        <>
          <div
            className='flex items-center gap-2 p-4 bg-gray-100 rounded-t-2xl cursor-pointer'
            onClick={() => setIsCategoryItem(false)}
          >
            <ChevronLeftIcon className='w-5 h-5' />
            <Typography variant='h6'>{MENU_BAR.category}</Typography>
          </div>
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
                    setOpenSidebar(false);
                  }}
                >
                  {item}
                </ListItem>
              ))}
            </List>
          </div>
        </>
      );
    },
    [selectedCategoryItem, setSelectedCategoryItem, setIsCategoryItem]
  );

  const SidebarMenu: Component<{ menu: RouteMenu }> = useMemo(
    () =>
      ({ menu }) => {
        if (isCategoryItem === true) {
          return <CategoryBar />;
        }

        return (
          <>
            <div className='p-4 flex items-center justify-between bg-gray-100 rounded-t-2xl'>
              <div className='flex items-center gap-2'>
                <img className='w-10 h-10' src={tick3D} alt='tick3D-logo'></img>
                <Typography variant='h5'>Tick3D</Typography>
              </div>
              <div
                className='cursor-pointer opacity-40 focus:opacity-100 active:opacity-100'
                onClick={() => setOpenSidebar(false)}
              >
                <ToggleSidebarBtn open={openSidebar} />
              </div>
            </div>
            <div className='flex flex-col'>
              <List className='p-0'>
                {menu.map((menuItem, idx) => {
                  if (menuItem === 'divider') {
                    return <hr key={idx} className='my-2 border-blue-gray-100' />;
                  }
                  if (menuItem.type === 'item') {
                    if (menuItem.name === MENU_BAR.category) {
                      return (
                        <Link key={idx} to={menuItem.path}>
                          <ListItem
                            className={
                              SIDEBAR_ITEM_CLASSNAME +
                              (selectedMenu === menuItem.name
                                ? ' bg-blue-100 text-blue/1 font-bold'
                                : '')
                            }
                            onClick={() => {
                              setSelectedMenu(menuItem.name);
                              setIsCategoryItem(true);
                            }}
                          >
                            {menuItem.name}
                            <ListItemSuffix>
                              <ChevronRightIcon className='w-5 h-5' />
                            </ListItemSuffix>
                          </ListItem>
                        </Link>
                      );
                    }
                    return (
                      <Link key={idx} to={menuItem.path}>
                        <ListItem
                          className={
                            SIDEBAR_ITEM_CLASSNAME +
                            (selectedMenu === menuItem.name
                              ? ' bg-blue-100 text-blue/1 font-bold pointer-events-none'
                              : '')
                          }
                          onClick={() => {
                            setSelectedMenu(menuItem.name);
                            setOpenSidebar(false);
                          }}
                        >
                          {menuItem.name}
                        </ListItem>
                      </Link>
                    );
                  }
                })}
              </List>
            </div>
          </>
        );
      },
    [openSidebar, selectedMenu, isCategoryItem, setSelectedMenu, setIsCategoryItem, CategoryBar]
  );

  return {
    openSidebar: openSidebar,
    handleOpenSidebar: () => setOpenSidebar(!openSidebar),
    SidebarMenu: SidebarMenu
  };
}
