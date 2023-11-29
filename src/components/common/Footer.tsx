import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Input, Button } from '@material-tailwind/react';
import { HOME_LINKS, FOOTER_SOCIAL } from '@constants';

export function Footer() {
  const [email, setEmail] = useState<string>('');

  return (
    <footer className='relative w-full py-8 lg:py-16 bg-black'>
      <div className='grid grid-cols-2 justify-between lg:gap-4 px-8 lg:px-24 mb-16'>
        {HOME_LINKS.map(({ title, items }) => (
          <ul key={title} className='list-disc text-white space-x-5'>
            <Typography color='white' className='mb-3 font-medium text-[14px] lg:text-[24px]'>
              {title}
            </Typography>
            {items.map((link) => (
              <li key={link}>
                <Typography
                  color='white'
                  className='py-1.5 font-normal transition-colors text-xs lg:text-base'
                >
                  {link}
                </Typography>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div className='px-4 lg:px-16 flex flex-col lg:flex-row lg:justify-between lg:items-center'>
        <div className='text-white'>
          <Typography className='mb-4'>Nhận email của chúng tôi</Typography>
          <div className='flex relative lg:w-[400px] mb-4'>
            <Input
              type='email'
              label='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-white'
              crossOrigin=''
            ></Input>
            <Button
              size='sm'
              color={email ? 'white' : 'blue-gray'}
              disabled={!email}
              className='!absolute right-1 top-1 rounded'
            >
              Gửi
            </Button>
          </div>
        </div>
        <div className='flex gap-4 text-white justify-center'>
          {FOOTER_SOCIAL.map((item, index) => (
            <Link key={index} to={item.url}>
              <div className='text-3xl hover:text-indigo-600'>{item.icon}</div>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
