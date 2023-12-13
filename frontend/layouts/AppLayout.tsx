import { AppNavigation } from 'frontend/components';
import { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';

export const AppLayout: Component<{ menu: RouteMenu }> = function ({ menu }) {
    const routeItems = useMemo(() => {
        const items: { path: string; element: React.ReactElement }[] = [];
        for (const menuItem of menu) {
            if (menuItem === 'divider' || menuItem.type === 'logout-btn') continue;
            if (menuItem.type === 'list') {
                for (const route of menuItem.routes) {
                    items.push({ path: route.path, element: route.element });
                }
            } else {
                items.push({ path: menuItem.path, element: menuItem.element });
            }
        }
        return items;
    }, [menu]);

    return (
        <div>
            <AppNavigation menu={menu} />
            <div className='p-4' style={{ marginLeft: '240px' }}>
                <Routes>
                    {routeItems.map((item) => (
                        <Route path={item.path} element={item.element} key={item.path} />
                    ))}
                </Routes>
            </div>
        </div>
    );
};
