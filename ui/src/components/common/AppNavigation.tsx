import { MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import tick3D from '@assets/tick3D-logo.svg';
import { AppDrawer, DesktopNavbar, ToggleSidebarBtn, useSidebarMenu } from '@components/common';
import { ScreenSize } from '@constants';
import { useScreenSize } from '@hooks';
import { Link } from 'react-router-dom';

export const AppNavigation: Component<{ menu: RouteMenu }> = ({ menu }) => {
  const { screenSize } = useScreenSize();
  const { openSidebar, handleOpenSidebar, SidebarMenu } = useSidebarMenu();

  return (
    <div className='w-full max-h-[768px] px-6 lg:px-9 py-3 shadow-md z-10'>
      <div className='flex items-center justify-between h-full'>
        <div className='flex items-center justify-between w-full lg:hidden'>
          <div className='cursor-pointer' onClick={handleOpenSidebar}>
            <ToggleSidebarBtn open={openSidebar} />
          </div>
          <img className='w-12 h-12' src={tick3D} alt='tick3D-logo' />
          <div className='flex items-center gap-8'>
            <MagnifyingGlassIcon strokeWidth={2} className='w-6 h-6 cursor-pointer' />
            <Link to='/cart' className='cursor-pointer'>
              <ShoppingCartIcon strokeWidth={2} className='w-6 h-6 ' />
            </Link>
          </div>
        </div>
        {screenSize < ScreenSize.LG ? (
          <AppDrawer open={openSidebar} onClose={handleOpenSidebar}>
            <SidebarMenu menu={menu} />
          </AppDrawer>
        ) : (
          <DesktopNavbar menu={menu} />
        )}
      </div>
    </div>
  );
};
