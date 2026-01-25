import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LanguageToggle from './LanguageToggle';
import { LanguageProvider } from '../hooks/useLanguage';

describe('LanguageToggle', () => {
  it('should render without crashing', () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    );
    expect(screen.getByRole('button', { name: /ID/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /EN/i })).toBeInTheDocument();
  });
});
