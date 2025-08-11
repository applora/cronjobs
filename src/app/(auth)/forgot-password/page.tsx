import { type Metadata } from 'next';

import Form from './component';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Forgot Password',
  };
};

export default function Page() {
  return <Form />;
}
