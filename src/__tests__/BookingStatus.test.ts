import { describe, it, expect } from 'vitest';

const statusSteps = ['pending', 'accepted', 'otw', 'arrived', 'working', 'completed'];

const canTransition = (current: string, next: string) => {
  const currentIndex = statusSteps.indexOf(current);
  const nextIndex = statusSteps.indexOf(next);

  if (next === 'cancelled') return ['pending', 'accepted'].includes(current);
  return nextIndex === currentIndex + 1;
};

describe('Booking Status Transitions', () => {
  it('should allow transition from pending to accepted', () => {
    expect(canTransition('pending', 'accepted')).toBe(true);
  });

  it('should allow transition from accepted to otw', () => {
    expect(canTransition('accepted', 'otw')).toBe(true);
  });

  it('should not allow transition from pending to working', () => {
    expect(canTransition('pending', 'working')).toBe(false);
  });

  it('should allow cancellation from pending', () => {
    expect(canTransition('pending', 'cancelled')).toBe(true);
  });

  it('should not allow cancellation from working', () => {
    expect(canTransition('working', 'cancelled')).toBe(false);
  });
});
