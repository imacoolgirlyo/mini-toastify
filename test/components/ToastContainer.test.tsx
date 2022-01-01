import * as React from 'react';
import { render } from '@testing-library/react';

import { ToastContainer } from '../../src/components/ToastContainer';
import { Event, eventManager } from '../../src/core/eventManager';

jest.useFakeTimers();

beforeEach(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    callback(1);
    return 1;
  });
});

afterEach(() => {
  (window.requestAnimationFrame as jest.Mock).mockRestore();
});

describe('ToastContainer', () => {
  it('ToastContainer가 mount 되면 Event가 등록되고 unmount 되면 Event가 등록 해제 되어야함', () => {
    const { unmount } = render(<ToastContainer />);

    expect(eventManager.list.has(Event.Show)).toBe(true);
    expect(eventManager.list.has(Event.Clear)).toBe(true);

    unmount();
    jest.runAllTimers();

    expect(eventManager.list.has(Event.Show)).toBe(false);
    expect(eventManager.list.has(Event.Clear)).toBe(false);
  });
});
