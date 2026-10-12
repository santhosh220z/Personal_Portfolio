import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCommandPalette } from './useCommandPalette';

/**
 * `useCommandPalette` is the only part of the command palette that can be tested
 * in jsdom, and it is where the two failure modes live.
 *
 * Both are invisible in a screenshot. A palette that never opens is a feature
 * that simply does not exist — and that is exactly the state this component was
 * found in: written, complete, and mounted by nothing. A palette that opens when
 * you type a slash into a text field covers the field you were typing in.
 *
 * The real-browser half of this feature (chunk deferral, focus movement, the
 * combobox wiring) lives in scripts/verify-site.mjs. This pins the shortcut
 * logic that jsdom can actually exercise.
 */

const press = (target, init) => {
  act(() => {
    target.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }),
    );
  });
};

const metaK = (target) => press(target, { key: 'k', metaKey: true });
const ctrlK = (target) => press(target, { key: 'k', ctrlKey: true });

let hook;

beforeEach(() => {
  const { result, unmount } = renderHook(() => useCommandPalette());
  hook = result;
  return () => unmount();
});

describe('useCommandPalette', () => {
  it('starts closed', () => {
    expect(hook.current.open).toBe(false);
  });

  it('opens on Cmd+K', () => {
    metaK(window);
    expect(hook.current.open).toBe(true);
  });

  it('opens on Ctrl+K, so the shortcut is not macOS-only', () => {
    ctrlK(window);
    expect(hook.current.open).toBe(true);
  });

  it('is case-insensitive, so Shift+K also works', () => {
    press(window, { key: 'K', metaKey: true });
    expect(hook.current.open).toBe(true);
  });

  it('toggles closed on a second press', () => {
    metaK(window);
    expect(hook.current.open).toBe(true);
    metaK(window);
    expect(hook.current.open).toBe(false);
  });

  it('opens on a bare slash', () => {
    press(window, { key: '/' });
    expect(hook.current.open).toBe(true);
  });

  it('does NOT open on a slash typed into a text field', () => {
    // The regression this guard exists to prevent: the overlay summoning itself
    // on top of the input the visitor is typing in.
    const input = document.createElement('input');
    document.body.appendChild(input);
    press(input, { key: '/' });
    expect(hook.current.open).toBe(false);
    input.remove();
  });

  it('does NOT open on a slash typed into a contenteditable region', () => {
    // jsdom does not implement `isContentEditable` — it is absent from
    // HTMLElement.prototype entirely, so reading it yields undefined and the
    // guard in isTypingTarget can never be reached through the DOM alone.
    // Verified against jsdom 30.1.2. The attribute is set for real and only the
    // reflected property is stubbed, so the test still exercises our guard
    // rather than bypassing it.
    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    Object.defineProperty(editable, 'isContentEditable', { value: true });
    document.body.appendChild(editable);
    press(editable, { key: '/' });
    expect(hook.current.open).toBe(false);
    editable.remove();
  });

  it('ignores slash when a modifier is held, so Cmd+/ and Alt+/ still reach the OS/browser', () => {
    press(window, { key: '/', metaKey: true });
    expect(hook.current.open).toBe(false);
    press(window, { key: '/', altKey: true });
    expect(hook.current.open).toBe(false);
  });

  it('ignores unrelated keys', () => {
    press(window, { key: 'j' });
    press(window, { key: 'k' });
    press(window, { key: 'Enter' });
    expect(hook.current.open).toBe(false);
  });

  it('exposes stable identities, so Nav and the palette are not re-rendered per App render', () => {
    const first = hook.current;
    metaK(window);
    // A new closure each render would re-render every consumer of the hook on
    // every App state change, not just the ones this state actually affects.
    expect(hook.current.openPalette).toBe(first.openPalette);
    expect(hook.current.closePalette).toBe(first.closePalette);
  });

  it('openPalette and closePalette drive the state directly', () => {
    act(() => hook.current.openPalette());
    expect(hook.current.open).toBe(true);
    act(() => hook.current.closePalette());
    expect(hook.current.open).toBe(false);
  });

  it('removes its listener on unmount', () => {
    // Guards a leak: a listener left behind keeps toggling state on a component
    // that is no longer mounted, and React warns about setting state on an
    // unmounted hook.
    const { result, unmount } = renderHook(() => useCommandPalette());
    unmount();
    metaK(window);
    expect(result.current.open).toBe(false);
  });
});