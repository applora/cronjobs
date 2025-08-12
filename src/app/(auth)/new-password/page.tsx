import { Metadata } from 'next';

import Form from './page.client';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'New Password',
  };
};

export default function Page() {
  return <Form />;
}
