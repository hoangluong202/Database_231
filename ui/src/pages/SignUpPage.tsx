import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardBody, Input, Button, Typography } from '@material-tailwind/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authService } from '@services';
import * as yup from 'yup';

export function SignUpPage() {
  const validateSchema = yup.object({
    firstname: yup.string().required('Vui lòng nhập tên của bạn'),
    lastname: yup.string().required('Vui lòng nhập họ của bạn'),
    tel: yup.string().required('Vui lòng nhập số điện thoại'),
    email: yup.string().required('Vui lòng nhập email').email('Email không đúng định dạng'),
    password: yup
      .string()
      .required('Vui lòng nhập mật khẩu')
      .min(8, 'Vui lòng nhập tối thiểu 8 kí tự')
  }) as yup.ObjectSchema<SignUpFormData>;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormData>({
    defaultValues: {
      firstname: '',
      lastname: '',
      tel: '',
      email: '',
      password: ''
    },
    resolver: yupResolver(validateSchema)
  });

  const submit = async (data: SignUpFormData) => {
    try {
      await authService.signUp(data);
      toast.success('Register successfully');
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  return (
    <div
      className='w-full h-full flex items-center justify-center bg-cover bg-no-repeat p-0 m-0 '
      style={{
        background: `linear-gradient(rgba(18, 18, 18, 0.4), rgba(18, 18, 18, 0.4)),
          url(https://www.kisscom.co.uk/media/pages/news/3d-printing-a-world-of-possibilities/5824bcf0fe-1666776023/blog_31.08.18.png)`
      }}
    >
      <Card className='bg-black/50 rounded-none' shadow={false}>
        <CardBody className='flex flex-col gap-8'>
          <Typography className='font-normal' variant='h2' color='white'>
            Đăng ký tài khoản
          </Typography>
          <form
            className='flex flex-col gap-8 w-fit max-w-screen-lg'
            onSubmit={handleSubmit(submit)}
          >
            <div className='flex flex-col gap-4 w-fit'>
              <div className='w-fit'>
                <div className='flex w-fit gap-4'>
                  <Input
                    className=' text-white !rounded-none border-border-dark focus:border-white transition-all placeholder-shown:border-border-dark'
                    placeholder=' '
                    labelProps={{
                      className:
                        'before:rounded-tl-none after:rounded-tr-none text-border-dark before:border-border-dark after:border-border-dark peer-focus:before:!border-white peer-focus:text-white peer-focus:after:!border-white peer-placeholder-shown:text-border-dark',
                      style: {
                        top: '-0.45rem'
                      }
                    }}
                    label='Họ'
                    style={{
                      WebkitTransition: 'background-color 5000s ease-in-out 0s',
                      WebkitTextFillColor: 'white',
                      caretColor: 'white'
                    }}
                    crossOrigin=''
                    {...register('lastname', { minLength: 8, required: true })}
                  />

                  {errors.lastname?.message && (
                    <Typography color='red' variant='small'>
                      {errors.lastname?.message}{' '}
                    </Typography>
                  )}
                  <Input
                    className=' text-white !rounded-none border-border-dark focus:border-white transition-all placeholder-shown:border-border-dark'
                    labelProps={{
                      className:
                        'before:rounded-tl-none after:rounded-tr-none text-border-dark before:border-border-dark after:border-border-dark peer-focus:before:!border-white peer-focus:text-white peer-focus:after:!border-white peer-placeholder-shown:text-border-dark',
                      style: {
                        top: '-0.45rem'
                      }
                    }}
                    label='Tên'
                    style={{
                      WebkitTransition: 'background-color 5000s ease-in-out 0s',
                      WebkitTextFillColor: 'white',
                      caretColor: 'white'
                    }}
                    crossOrigin=''
                    {...register('firstname', { minLength: 8, required: true })}
                  />
                </div>

                {errors.firstname?.message && (
                  <Typography color='red' variant='small'>
                    {errors.firstname?.message}{' '}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  className='text-white !rounded-none border-border-dark focus:border-white transition-all placeholder-shown:border-border-dark'
                  labelProps={{
                    className:
                      'before:rounded-tl-none after:rounded-tr-none text-border-dark before:border-border-dark after:border-border-dark peer-focus:before:!border-white peer-focus:text-white peer-focus:after:!border-white peer-placeholder-shown:text-border-dark',
                    style: {
                      top: '-0.45rem'
                    }
                  }}
                  size='lg'
                  label='Số điện thoại'
                  type='tel'
                  style={{
                    WebkitTransition: 'background-color 5000s ease-in-out 0s',
                    WebkitTextFillColor: 'white',
                    caretColor: 'white'
                  }}
                  crossOrigin=''
                  {...register('tel', { minLength: 8, required: true })}
                />
                {errors.tel?.message && (
                  <Typography color='red' variant='small'>
                    {errors.tel?.message}{' '}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  className='text-white !rounded-none border-border-dark focus:border-white transition-all placeholder-shown:border-border-dark'
                  labelProps={{
                    className:
                      'before:rounded-tl-none after:rounded-tr-none text-border-dark before:border-border-dark after:border-border-dark peer-focus:before:!border-white peer-focus:text-white peer-focus:after:!border-white peer-placeholder-shown:text-border-dark',
                    style: {
                      top: '-0.45rem'
                    }
                  }}
                  size='lg'
                  label='Email'
                  style={{
                    WebkitTransition: 'background-color 5000s ease-in-out 0s',
                    WebkitTextFillColor: 'white',
                    caretColor: 'white'
                  }}
                  crossOrigin=''
                  {...register('email', { minLength: 8, required: true })}
                />
                {errors.email?.message && (
                  <Typography color='red' variant='small'>
                    {errors.email?.message}{' '}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  className='text-white !rounded-none border-border-dark focus:border-white transition-all placeholder-shown:border-border-dark'
                  labelProps={{
                    className:
                      'before:rounded-tl-none after:rounded-tr-none text-border-dark before:border-border-dark after:border-border-dark peer-focus:before:!border-white peer-focus:text-white peer-focus:after:!border-white peer-placeholder-shown:text-border-dark',
                    style: {
                      top: '-0.45rem'
                    }
                  }}
                  size='lg'
                  label='Mật khẩu'
                  type='password'
                  style={{
                    WebkitTransition: 'background-color 5000s ease-in-out 0s',
                    WebkitTextFillColor: 'white',
                    caretColor: 'white'
                  }}
                  crossOrigin=''
                  {...register('password', { minLength: 8, required: true })}
                />
                {errors.password?.message && (
                  <Typography color='red' variant='small'>
                    {errors.password?.message}{' '}
                  </Typography>
                )}
              </div>
            </div>

            <Button
              className='py-2 px-8 bg-transparent border rounded-none border-white capitalize w-fit font-normal text-base'
              type='submit'
            >
              <div>Gửi</div>
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
