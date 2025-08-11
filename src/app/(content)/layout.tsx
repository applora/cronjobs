import { RootProvider } from 'fumadocs-ui/provider';

import '@/styles/content.css';

export default function ContentLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return <RootProvider>{children}</RootProvider>;
}
