import { HomeIcon } from '@heroicons/react/24/outline';
import { AppLayout } from '@layouts';

export default function App() {
    return (
        <AppLayout
            menu={[
                {
                    type: 'item',
                    icon: <HomeIcon className='h-5 w-5' />,
                    path: '/',
                    name: 'Home',
                    element: <></>
                }
            ]}
        />
    );
}
