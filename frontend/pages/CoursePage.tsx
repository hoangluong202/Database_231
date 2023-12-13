import { Button, Card, CardBody, Chip, Typography } from '@material-tailwind/react';

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

    return (
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
                        <Button placeholder='' className='bg-blue-500 text-white normal-case text-base'>
                            Thêm nhận xét
                        </Button>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
