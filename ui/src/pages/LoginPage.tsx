import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardBody, Input, Button, Typography } from '@material-tailwind/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authService } from '@services';
import { useUserStore } from '@states';
import * as yup from 'yup';

export function LoginPage() {
  const { getUserData } = useUserStore();

  const validateSchema = yup.object({
    email: yup.string().required('Vui lòng nhập email').email('Email không đúng định dạng'),
    password: yup
      .string()
      .required('Vui lòng nhập mật khẩu')
      .min(8, 'Vui lòng nhập tối thiểu 8 kí tự')
  }) as yup.ObjectSchema<LoginFormData>;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(validateSchema)
  });

  const submit = async (data: LoginFormData) => {
    try {
      await authService.login(data);
      await getUserData();
      toast.success('Login successfully');
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
            Đăng nhập
          </Typography>
          <form
            className='flex flex-col gap-8 w-fit max-w-screen-lg'
            onSubmit={handleSubmit(submit)}
          >
            <div className='flex flex-col gap-4 w-fit'>
              <div className='w-fit'>
                <Input
                  className='min-w-[25rem] text-white !rounded-none border-border-dark focus:border-white transition-all placeholder-shown:border-border-dark'
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

              <div className='w-fit'>
                <Input
                  className='min-w-[25rem] text-white !rounded-none border-border-dark focus:border-white transition-all placeholder-shown:border-border-dark'
                  labelProps={{
                    className:
                      'before:rounded-tl-none after:rounded-tr-none text-border-dark before:border-border-dark after:border-border-dark peer-focus:before:!border-white peer-focus:text-white peer-focus:after:!border-white peer-placeholder-shown:text-border-dark',
                    style: {
                      top: '-0.45rem'
                    }
                  }}
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
              Gửi
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
