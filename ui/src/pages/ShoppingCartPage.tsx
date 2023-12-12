import { useEffect, useMemo } from 'react';
import { Link, useNavigate, NavigateFunction } from 'react-router-dom';
import { Avatar, Button, Chip, Typography } from '@material-tailwind/react';
import { TrashIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Items } from '@components/home';
import { ScreenSize } from '@constants';
import { useScreenSize } from '@hooks';
import { useCheckoutStore, useHomeStore } from '@states';

export const ShoppingCartPage = () => {
  const { screenSize } = useScreenSize();
  const Header = () => {
    return (
      <div className='flex items-center justify-between bg-white'>
        <Typography variant={screenSize >= ScreenSize.MD ? 'h3' : 'h4'}>Giỏ hàng</Typography>
        <Link to={'/category'} className='flex justify-center items-center hover:bg-gray-100'>
          <Button variant='outlined' className='flex items-center gap-2 normal-case cursor-pointer'>
            <Typography variant='h6'>Tiếp tục mua hàng</Typography>
            <ChevronRightIcon className='w-5 h-5' />
          </Button>
        </Link>
      </div>
    );
  };

  const OrdersList = () => {
    const navigate: NavigateFunction = useNavigate();
    const { allOrder, getAllOrder, updateOrder } = useCheckoutStore();

    useEffect(() => {
      getAllOrder();
    }, [getAllOrder]);

    const Item: Component<{ order: OrderData }> = ({ order }) => {
      const handleIncreaseNumBought = () => {
        updateOrder({ ...order, numberBought: order.numberBought + 1 });
      };
      const handleDecreaseNumBought = () => {
        updateOrder({ ...order, numberBought: order.numberBought - 1 });
      };

      const QuantityButton = () => {
        return (
          <div className='flex flex-row gap-1 md:gap-6 justify-center items-center h-fit'>
            <div className='border-2 flex gap-4 md:gap-8 justify-between items-center px-2 py-0 md:px-4 md:py-2 h-fit'>
              <Typography
                className='text-xl md:text-2xl h-fit cursor-pointer'
                onClick={handleDecreaseNumBought}
              >
                -
              </Typography>
              <Typography className='h-fit text-xs md:text-base'>{order.numberBought}</Typography>
              <Typography
                className='text-xl md:text-2xl h-fit cursor-pointer'
                onClick={handleIncreaseNumBought}
              >
                +
              </Typography>
            </div>
            <TrashIcon className='w-4 md:w-5 h-fit cursor-pointer' />
          </div>
        );
      };
      return (
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-2 md:gap-6'>
            <Avatar
              src={order.image}
              alt=''
              variant='square'
              size={screenSize < ScreenSize.MD ? 'lg' : 'xxl'}
            />
            <div className='flex flex-col gap-1 justify-start items-start'>
              <Typography
                variant={screenSize < ScreenSize.MD ? 'small' : 'paragraph'}
                className='capitalize w-36 md:w-72 truncate'
              >
                {order.name}
              </Typography>
              {screenSize < ScreenSize.MD && <QuantityButton />}
            </div>
          </div>
          <div className='flex items-center md:justify-between w-fit md:w-[34rem]'>
            {screenSize >= ScreenSize.MD && <QuantityButton />}
            {order.discount > 0 ? (
              <div className='flex flex-col gap-2'>
                <Chip
                  variant='ghost'
                  value={
                    <span className='line-through'>
                      {(order.price * order.numberBought).toLocaleString()} VNĐ
                    </span>
                  }
                />
                <Chip
                  variant='ghost'
                  value={`${(
                    order.price *
                    (1 - order.discount) *
                    order.numberBought
                  ).toLocaleString()} VNĐ`}
                />
              </div>
            ) : (
              <Chip
                variant='ghost'
                value={`${(order.price * order.numberBought).toLocaleString()} VNĐ`}
              />
            )}
          </div>
        </div>
      );
    };

    const SummaryPrice = () => {
      const productPrice = useMemo(
        () =>
          allOrder.reduce(
            (acc, order) => acc + order.price * (1 - order.discount) * order.numberBought,
            0
          ),
        []
      );
      return (
        <div className='flex flex-col gap-3 items-center md:items-end'>
          <div className='flex flex-col gap-2 items-center md:items-end'>
            <Typography className='w-fit'>
              <span>Tổng: </span>
              <span className='font-bold text-xl'>{productPrice.toLocaleString('en-US')} VNĐ</span>
            </Typography>
            <Typography variant='small' className='w-fit text-center'>
              Thuế và phí giao hàng được tính tại bước thanh toán
            </Typography>
          </div>

          <Button
            className='normal-case rounded-none w-80 md:w-96 text-md bg-red-500'
            onClick={() => navigate('/checkout')}
          >
            Thanh toán
          </Button>
        </div>
      );
    };

    return (
      <div className='flex flex-col gap-4 justify-between bg-white'>
        <div className='flex justify-between w-full'>
          <Typography variant='small' className='uppercase'>
            Sản phẩm
          </Typography>
          <div className='flex justify-end lg:justify-between w-fit md:w-[34rem]'>
            <Typography variant='small' className='uppercase hidden lg:inline'>
              Số lượng
            </Typography>
            <Typography variant='small' className='uppercase'>
              Tổng cộng
            </Typography>
          </div>
        </div>
        <hr className='mb-2' />
        {allOrder.map((order, idx) => (
          <Item key={idx} order={order} />
        ))}
        <hr />
        <SummaryPrice />
      </div>
    );
  };

  const RecommendList = () => {
    const { itemData, getItemData } = useHomeStore();
    useEffect(() => {
      getItemData();
    }, [getItemData]);

    return (
      <div className='flex flex-col gap-2 w-full'>
        <div className='flex justify-start'>
          <Typography variant={screenSize >= ScreenSize.MD ? 'h4' : 'h5'} className='w-fit'>
            Có thể bạn cũng thích !
          </Typography>
        </div>
        <Items items={itemData} />
        <Link to={'/category'} className='w-full flex justify-center'>
          <Button className='normal-case rounded-none w-fit px-6 text-md bg-red-500'>
            Xem thêm
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <div className='flex flex-col gap-12 justify-center p-4 md:p-8 bg-white'>
      <Header />
      <OrdersList />
      <RecommendList />
    </div>
  );
};
