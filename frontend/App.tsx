import { ChatBubbleLeftEllipsisIcon, TvIcon, WindowIcon } from '@heroicons/react/24/outline';
import { AppLayout } from 'frontend/layouts';
import { ReviewPage, CoursePage, InstructorPage } from 'frontend/pages';

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
                },
                {
                    type: 'item',
                    icon: <TvIcon className='h-5 w-5' />,
                    path: '/instructor',
                    name: 'Instructor',
                    element: <InstructorPage />
                }
            ]}
        />
    );
}
