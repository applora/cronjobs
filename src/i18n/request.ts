import { getRequestConfig } from 'next-intl/server';

import { getUserLocale } from '.';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)) as Record<
      string,
      string
    >,
  };
});
