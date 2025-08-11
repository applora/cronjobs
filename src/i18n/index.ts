import appConfig from '@app-config';
import { cookies } from 'next/headers';

const COOKIE_NAME = `${process.env.APP_PREFIX}_i18n`;

export async function getUserLocale() {
  return (await cookies()).get(COOKIE_NAME)?.value ?? defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}

export type Locale = (typeof appConfig.i18n.locales)[number];

export const locales = appConfig.i18n.locales;

export const defaultLocale: Locale = appConfig.i18n.defaultLocale;
