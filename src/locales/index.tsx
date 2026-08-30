import React, { createContext, useContext, useMemo } from 'react';
import { EditorLocale, LocaleInput, SupportedLocale, DeepPartial } from './types';
import { idLocale } from './id';
import { enLocale } from './en';

export * from './types';
export * from './id';
export * from './en';

export const DEFAULT_LOCALE = idLocale;

export const BUILTIN_LOCALES: Record<SupportedLocale, EditorLocale> = {
  id: idLocale,
  en: enLocale,
};

/**
 * Deep merge a target locale object with a source partial override
 */
function deepMerge<T extends Record<string, any>>(target: T, source?: DeepPartial<T>): T {
  if (!source) return { ...target };
  const output: any = { ...target };
  for (const key of Object.keys(source) as Array<keyof T>) {
    const val = source[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      output[key] = deepMerge((target as any)[key] || {}, val as any);
    } else if (val !== undefined) {
      output[key] = val;
    }
  }
  return output as T;
}

/**
 * Resolves a LocaleInput (string code or custom object dictionary) into a complete EditorLocale.
 * If a custom object is provided, it is merged on top of default Indonesian (or English if base specified).
 */
export function resolveLocale(localeInput?: LocaleInput): EditorLocale {
  if (!localeInput) {
    return idLocale;
  }
  if (typeof localeInput === 'string') {
    return BUILTIN_LOCALES[localeInput as SupportedLocale] || idLocale;
  }
  if (typeof localeInput === 'object') {
    return deepMerge(idLocale, localeInput);
  }
  return idLocale;
}

/**
 * Formats a string template containing placeholders like "{count}" or "{current}"
 */
export function formatLocaleString(template: string, params: Record<string, string | number>): string {
  if (!template) return '';
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

export const LocaleContext = createContext<EditorLocale>(idLocale);

export interface LocaleProviderProps {
  locale?: LocaleInput;
  children: React.ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ locale, children }) => {
  const resolved = useMemo(() => resolveLocale(locale), [locale]);
  return React.createElement(LocaleContext.Provider, { value: resolved }, children);
};

export const useLocale = (): EditorLocale => {
  return useContext(LocaleContext);
};
