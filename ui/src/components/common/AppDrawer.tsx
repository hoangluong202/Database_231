import React, { ReactNode } from 'react';
import { Drawer } from '@material-tailwind/react';

export const AppDrawer: Component<{
  open: boolean;
  children: ReactNode;
  onClose: () => void;
}> = ({ open, children, onClose }) => {
  return (
    <React.Fragment>
      <Drawer
        open={open}
        className='p-0 rounded-r-2xl overflow-y-auto'
        onClose={onClose}
        size={320}
      >
        {children}
      </Drawer>
    </React.Fragment>
  );
};
