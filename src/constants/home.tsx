import { PhoneIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

export const HOME_LINKS = [
  {
    title: 'Đường dẫn nhanh',
    items: ['Trang trí', 'Mô hình', 'Tải lên']
  },
  {
    title: 'Thông tin',
    items: ['Chúng tôi', 'Liên hệ', 'Chính sách vận chuyển']
  }
];

export const FOOTER_SOCIAL = [
  {
    url: 'https://www.facebook.com/',
    icon: <FaFacebook />
  },
  {
    url: 'https://www.instagram.com/',
    icon: <FaInstagram />
  },
  {
    url: 'https://twitter.com/home',
    icon: <FaTiktok />
  },
  {
    url: 'https://www.linkedin.com/feed/',
    icon: <FaYoutube />
  }
];

export const HOME_CONTACT = [
  {
    icon: <ClockIcon width={24} />,
    mainContent: 'Thứ 2 - Chủ nhật',
    subContent: '9:00 am - 8:00 pm'
  },
  {
    icon: <MapPinIcon width={24} />,
    mainContent: '307A, Tô Hiến Thành',
    subContent: 'Quận 10, Tp. Hồ Chí Minh'
  },
  {
    icon: <PhoneIcon width={24} />,
    mainContent: '(+84) 123 456 7890',
    subContent: '(+84) 987 654 32100'
  }
];
