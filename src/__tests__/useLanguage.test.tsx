
import { renderHook, act } from '@testing-library/react';
import { useLanguage, LanguageProvider } from '@/hooks/useLanguage';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('useLanguage', () => {
  it('should provide default language (id)', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe('id');
    expect(result.current.t('hero.title')).toBe('BENGKEL MASA DEPAN');
  });

  it('should change language to en', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');
    expect(result.current.t('hero.title')).toBe('FUTURE MECHANIC ECOSYSTEM');
  });

  it('should return key if translation is missing', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.t('non.existent.key')).toBe('non.existent.key');
  });
});
