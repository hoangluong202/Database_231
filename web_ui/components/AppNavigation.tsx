import { MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import logo from '@assets/elearning-logo.png';
import { Link } from 'react-router-dom';

export const AppNavigation: Component<{ menu: RouteMenu }> = (
    {
        /*menu*/
    }
) => {
    return (
        <div className='w-full max-h-[768px] px-6 lg:px-9 py-3 shadow-md z-10'>
            <div className='flex items-center justify-between h-full'>
                <div className='flex items-center justify-between w-full lg:hidden'>
                    <img className='w-12 h-12' src={logo} alt='tick3D-logo' />
                    <div className='flex items-center gap-8'>
                        <MagnifyingGlassIcon strokeWidth={2} className='w-6 h-6 cursor-pointer' />
                        <Link to='/cart' className='cursor-pointer'>
                            <ShoppingCartIcon strokeWidth={2} className='w-6 h-6 ' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
