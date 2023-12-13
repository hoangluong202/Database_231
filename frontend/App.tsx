import { ChatBubbleLeftEllipsisIcon, WindowIcon } from '@heroicons/react/24/outline';
import { AppLayout } from 'frontend/layouts';
import { ReviewPage, CoursePage } from 'frontend/pages';

export default function App() {
    return (
        <AppLayout
            menu={[
                {
                    type: 'item',
                    icon: <WindowIcon className='h-5 w-5' />,
                    path: '/',
                    name: 'Course',
                    element: <CoursePage />
                },
                {
                    type: 'item',
                    icon: <ChatBubbleLeftEllipsisIcon className='h-5 w-5' />,
                    path: '/review',
                    name: 'Review',
                    element: <ReviewPage />
                }
            ]}
        />
    );
}
