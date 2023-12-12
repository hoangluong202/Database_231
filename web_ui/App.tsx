import { AppLayout } from 'web_ui/layouts';

export default function App() {
    return (
        <AppLayout
            menu={[
                {
                    type: 'item',
                    path: '/',
                    name: 'Home',
                    element: <></>
                }
            ]}
        />
    );
}
