import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, Chip, Dialog, Rating, Textarea, Typography } from '@material-tailwind/react';

export function CoursePage() {
    const items = [
        {
            image: 'https://caodang.fpt.edu.vn/wp-content/uploads/1-351.png',
            name: 'HTML for Beginners',
            price: 100000,
            //sponsorName
            description: 'Learn HTML to become a fullstack developer'
        },
        {
            image: 'https://caodang.fpt.edu.vn/wp-content/uploads/1-351.png',
            name: 'HTML for Beginners',
            price: 100000,
            description: 'Learn HTML to become a fullstack developer'
        },
        {
            image: 'https://caodang.fpt.edu.vn/wp-content/uploads/1-351.png',
            name: 'HTML for Beginners',
            price: 100000,
            description: 'Learn HTML to become a fullstack developer'
        },
        {
            image: 'https://caodang.fpt.edu.vn/wp-content/uploads/1-351.png',
            name: 'HTML for Beginners',
            price: 100000,
            description: 'Learn HTML to become a fullstack developer'
        },
        {
            image: 'https://caodang.fpt.edu.vn/wp-content/uploads/1-351.png',
            name: 'HTML for Beginners',
            price: 100000,
            description: 'Learn HTML to become a fullstack developer'
        },
        {
            image: 'https://caodang.fpt.edu.vn/wp-content/uploads/1-351.png',
            name: 'HTML for Beginners',
            price: 100000,
            description: 'Learn HTML to become a fullstack developer'
        },
        {
            image: 'https://caodang.fpt.edu.vn/wp-content/uploads/1-351.png',
            name: 'HTML for Beginners',
            price: 100000,
            description: 'Learn HTML to become a fullstack developer'
        },
        {
            image: 'https://caodang.fpt.edu.vn/wp-content/uploads/1-351.png',
            name: 'HTML for Beginners',
            price: 100000,
            description: 'Learn HTML to become a fullstack developer'
        }
    ];

    const [rating, setRating] = useState<number>(1);
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => setOpen((cur) => !cur);

    return (
        <>
            <div className='grid grid-cols-2 gap-2 lg:grid-cols-3 lg:p-4 lg:gap-3'>
                {items.map((item, index) => (
                    <Card key={index} placeholder='' className='border-2 border-gray-400 hover:border-gray-600 cursor-pointer rounded-lg'>
                        <CardBody placeholder='' className='flex flex-col justify-between h-[400px]'>
                            <div className='line-clamp-4'>
                                <img src={item.image} />
                                <Typography placeholder='' variant='lead' className='font-bold'>
                                    {item.name}
                                </Typography>
                                <Chip color='amber' value={`${item.price.toLocaleString('en-US')} VNĐ`} className='w-fit' />
                                <Typography placeholder='' variant='paragraph'>
                                    {item.description}
                                </Typography>
                            </div>
                            <Button placeholder='' className='bg-blue-500 text-white normal-case text-base' onClick={handleOpen}>
                                Thêm nhận xét
                            </Button>
                        </CardBody>
                    </Card>
                ))}
            </div>
            <Dialog placeholder='' size='xs' open={open} handler={handleOpen} className='bg-transparent shadow-none'>
                <Card placeholder='' className='mx-auto w-full max-w-[24rem]'>
                    <CardBody placeholder='' className='flex flex-col gap-4'>
                        <Typography placeholder='' variant='h4' color='blue-gray'>
                            Thêm điểm số và nhận xét của bạn vào khóa học này
                        </Typography>
                        <Typography placeholder='' className='-mb-2' variant='h6'>
                            Điểm số
                        </Typography>
                        <Rating placeholder='' value={rating} onChange={(value) => setRating(value)} />
                        <Typography placeholder='' className='-mb-2' variant='h6'>
                            Nhận xét
                        </Typography>
                        <Textarea label='Nhận xét' size='md' />
                    </CardBody>
                    <CardFooter placeholder='' className='pt-0'>
                        <Button placeholder='' variant='gradient' onClick={handleOpen} fullWidth>
                            Xác nhận
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}
