import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { AppLayout } from 'frontend/layouts';
import { ReviewPage } from 'frontend/pages';

export default function App() {
    return (
        <AppLayout
            menu={[
                {
                    type: 'item',
                    icon: <ChatBubbleLeftEllipsisIcon className='h-5 w-5' />,
                    path: '/',
                    name: 'Review',
                    element: <ReviewPage />
                }
            ]}
        />
    );
}
