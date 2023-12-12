import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardBody,
  Chip,
  Button,
  Radio,
  Input,
  Typography,
  Textarea
} from '@material-tailwind/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import cashPaymentLogo from '@assets/cashpayment.webp';
import momoPaymentLogo from '@assets/momopayment.png';
import { PaymentMethod } from '@constants';
import { useCheckoutStore } from '@states';

export function PaymentCheckoutPage() {
  const { getAllOrder } = useCheckoutStore();

  useEffect(() => {
    getAllOrder();
  }, [getAllOrder]);

  const CheckoutForm = () => {
    const validateSchema = yup.object({
      paymentMethod: yup
        .mixed()
        .oneOf([PaymentMethod.CASH, PaymentMethod.MOMO])
        .required('Vui lòng chọn phương thức thanh toán'),
      district: yup.string(),
      ward: yup.string(),
      street: yup.string(),
      streetNo: yup.string(),
      note: yup.string().optional()
    }) as yup.ObjectSchema<CheckoutForm>;

    const {
      handleSubmit,
      register,
      formState: { errors }
    } = useForm<CheckoutForm>({
      defaultValues: {
        paymentMethod: PaymentMethod.CASH,
        district: '',
        ward: '',
        street: '',
        streetNo: '',
        note: ''
      },
      resolver: yupResolver(validateSchema)
    });

    const submit = async (data: CheckoutForm) => {
      return data;
    };

    return (
      <form
        className='flex flex-col gap-3 w-full max-w-screen-lg'
        id='checkout-form'
        onSubmit={handleSubmit(submit)}
      >
        <div>
          <p className='text-black'>Phương thức thanh toán</p>
          <div className='flex flex-col'>
            <Radio
              label={
                <div className='flex gap-2'>
                  <img src={cashPaymentLogo} alt='' className='w-6 h-6'></img>
                  <p>Tiền mặt</p>
                </div>
              }
              value={PaymentMethod.CASH}
              name='paymentMethod'
              crossOrigin=''
            />
            <Radio
              label={
                <div className='flex gap-2'>
                  <img src={momoPaymentLogo} className='w-6 h-6'></img>
                  <p>Momo</p>
                </div>
              }
              value={PaymentMethod.MOMO}
              name='paymentMethod'
              crossOrigin=''
            />
          </div>
          {errors.paymentMethod?.message && (
            <Typography color='red' variant='small'>
              {errors.paymentMethod?.message}{' '}
            </Typography>
          )}
        </div>
        <Input
          className='text-black !rounded-none border-border-dark focus:border-dark transition-all placeholder-shown:border-border-dark'
          labelProps={{
            className:
              'before:rounded-tl-none after:rounded-tr-none text-border-dark before:border-border-dark after:border-border-dark peer-focus:before:!border-gray peer-focus:text-gray peer-focus:after:!border-gray peer-placeholder-shown:text-border-dark',
            style: {
              top: '-0.45rem'
            }
          }}
          size='lg'
          label='Quận'
          crossOrigin=''
          {...register('district', { required: true })}
        />
        {errors.district?.message && (
          <Typography color='red' variant='small'>
            {errors.district?.message}{' '}
          </Typography>
        )}
        <Input
          className='text-black !rounded-none border-border-dark focus:border-black transition-all placeholder-shown:border-border-dark'
          labelProps={{
            className:
              'before:rounded-tl-none after:rounded-tr-none text-border-dark before:border-border-dark after:border-border-dark peer-focus:before:!border-black peer-focus:text-black peer-focus:after:!border-black peer-placeholder-shown:text-border-dark',
            style: {
              top: '-0.45rem'
            }
          }}
          size='lg'
          label='Phường'
          crossOrigin=''
          {...register('ward', { required: true })}
        />
        {errors.ward?.message && (
          <Typography color='red' variant='small'>
            {errors.ward?.message}{' '}
          </Typography>
        )}
        <Input
          className='text-black !rounded-none border-border-dark focus:border-black transition-all placeholder-shown:border-border-dark'
          labelProps={{
            className:
              'before:rounded-tl-none after:rounded-tr-none text-border-dark before:border-border-dark after:border-border-dark peer-focus:before:!border-black peer-focus:text-black peer-focus:after:!border-black peer-placeholder-shown:text-border-dark',
            style: {
              top: '-0.45rem'
            }
          }}
          size='lg'
          label='Đường'
          crossOrigin=''
          {...register('street', { required: true })}
        />
        {errors.street?.message && (
          <Typography color='red' variant='small'>
            {errors.street?.message}{' '}
          </Typography>
        )}
        <Input
          className='text-black !rounded-none border-border-dark focus:border-black transition-all placeholder-shown:border-border-dark'
          labelProps={{
            className:
              'before:rounded-tl-none after:rounded-tr-none text-border-dark before:border-border-dark after:border-border-dark peer-focus:before:!border-black peer-focus:text-black peer-focus:after:!border-black peer-placeholder-shown:text-border-dark',
            style: {
              top: '-0.45rem'
            }
          }}
          size='lg'
          label='Số đường'
          crossOrigin=''
          {...register('streetNo', { required: true })}
        />
        {errors.streetNo?.message && (
          <Typography color='red' variant='small'>
            {errors.streetNo?.message}{' '}
          </Typography>
        )}
        <div>
          <Textarea
            className='text-black !rounded-none border-border-dark focus:border-black transition-all placeholder-shown:border-border-dark'
            labelProps={{
              className:
                'before:rounded-tl-none after:rounded-tr-none text-border-dark before:border-border-dark after:border-border-dark peer-focus:before:!border-black peer-focus:text-black peer-focus:after:!border-black peer-placeholder-shown:text-border-dark',
              style: {
                top: '-0.45rem'
              }
            }}
            size='lg'
            label='Ghi chú'
            {...register('note')}
          />
          {errors.note?.message && (
            <Typography color='red' variant='small'>
              {errors.note?.message}{' '}
            </Typography>
          )}
        </div>
      </form>
    );
  };

  const OrderDetails = () => {
    const { allOrder } = useCheckoutStore();

    return (
      <div className='flex flex-col gap-5 my-5'>
        {allOrder.map((item, index) => (
          <div key={index} className='flex gap-4 items-center'>
            <div className='w-1/6 m-auto'>
              <img src={item.image} alt={item.name} className='w-full block' />
            </div>
            <div className='flex items-center gap-10 w-full'>
              <Typography className='text-left w-1/2' variant='h5'>
                {item.name}
              </Typography>
              {item.discount > 0 ? (
                <div className='flex flex-col gap-2'>
                  <Chip
                    variant='ghost'
                    value={<span className='line-through'>₫ {item.price.toLocaleString()}</span>}
                  />
                  <Chip
                    variant='ghost'
                    value={`₫ ${(item.price * (1 - item.discount)).toLocaleString()}`}
                  />
                </div>
              ) : (
                <Chip variant='ghost' value={`₫ ${item.price.toLocaleString()}`} />
              )}
              <Chip
                value={
                  <span className='normal-case'>
                    Số lượng: {item.numberBought.toLocaleString()}
                  </span>
                }
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const OrderSummary = () => {
    const shippingFee = 30000;
    const { allOrder } = useCheckoutStore();
    const productPrice = useMemo(
      () => allOrder.reduce((acc, item) => acc + item.price * item.numberBought, 0),
      [allOrder]
    );
    const discount = useMemo(
      () => allOrder.reduce((acc, item) => acc + item.price * item.discount * item.numberBought, 0),
      [allOrder]
    );

    return (
      <>
        <div className='flex w-full'>
          <Typography variant='h6'>Tổng phí sản phẩm</Typography>
          <p className='flex-1 text-right'>₫ {productPrice.toLocaleString('en-US')}</p>
        </div>
        <div className='flex w-full'>
          <Typography variant='h6'>Giảm giá</Typography>
          <p className='flex-1 text-right'>- ₫ {discount.toLocaleString('en-US')}</p>
        </div>
        <div className='flex w-full'>
          <Typography variant='h6'>Phí vận chuyển</Typography>
          <p className='flex-1 text-right'>₫ {shippingFee.toLocaleString('en-US')}</p>
        </div>
        <hr />
        <div className='flex w-full'>
          <Typography variant='h6'>Tổng chi phí</Typography>
          <p className='flex-1 text-right'>
            ₫ {(productPrice - discount + shippingFee).toLocaleString('en-US')}
          </p>
        </div>

        <Button
          className='py-2 px-8 bg-transparent border rounded-none border-black capitalize w-fit font-normal text-base text-dark'
          type='submit'
          form='checkout-form'
        >
          <div>Xác nhận</div>
        </Button>
      </>
    );
  };

  return (
    <div className='w-full lg:flex justify-center p-0 m-0'>
      <Card className='bg-white/100 rounded-none sm:w-full lg:w-1/2' shadow={false}>
        <CardBody className='flex flex-col gap-5'>
          <Typography className='font-normal' variant='h2' color='black'>
            Xác nhận đơn hàng
          </Typography>
          <CheckoutForm />
          <Typography className='font-normal' variant='h2' color='black'>
            Chi tiết đơn hàng
          </Typography>
          <OrderDetails />
        </CardBody>
      </Card>
      <Card className='bg-white/100 rounded-none sm:w-full lg:w-1/3' shadow={false}>
        <CardBody className='flex flex-col gap-5'>
          <Typography className='font-normal' variant='h2' color='black'>
            Hóa đơn
          </Typography>
          <OrderSummary />
        </CardBody>
      </Card>
    </div>
  );
}
