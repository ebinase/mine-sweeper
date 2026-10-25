import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';

export const BUTTON_NUMBERS = {
  LEFT_CLICK: 0,
  RIGHT_CLICK: 2,
} as const;

interface Options {
  shouldPreventDefault?: boolean;
  delay?: number;
  targetButton?: number;
}

type Press = {
  pointerId: number;
  x: number;
  y: number;
  timer: number;
  isLongPress: boolean;
};

const useLongPress = (
  onLongPress: (e?: PointerEvent) => void,
  onClick?: (e?: PointerEvent) => void,
  {
    shouldPreventDefault = true,
    delay = 200,
    targetButton = BUTTON_NUMBERS.LEFT_CLICK,
  }: Options = {},
) => {
  // Refs update synchronously, even when React has not rendered between pointer events.
  const press = useRef<Press | null>(null);

  useEffect(() => {
    return () => {
      if (press.current) window.clearTimeout(press.current.timer);
      press.current = null;
    };
  }, []);

  const cancel = () => {
    if (press.current) window.clearTimeout(press.current.timer);
    press.current = null;
  };

  const preventDefault = (e: ReactPointerEvent<HTMLElement>) => {
    if (shouldPreventDefault) e.preventDefault();
  };

  return {
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
      if (e.button !== targetButton || !e.isPrimary || press.current) return;
      preventDefault(e);
      const activePress: Press = {
        pointerId: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        timer: 0,
        isLongPress: false,
      };
      press.current = activePress;
      activePress.timer = window.setTimeout(() => {
        activePress.isLongPress = true;
        onLongPress(e.nativeEvent);
      }, delay);
    },
    onPointerUp: (e: ReactPointerEvent<HTMLElement>) => {
      const activePress = press.current;
      if (!activePress || activePress.pointerId !== e.pointerId || e.button !== targetButton) {
        return;
      }
      preventDefault(e);
      cancel();
      if (!activePress.isLongPress) onClick?.(e.nativeEvent);
    },
    onPointerMove: (e: ReactPointerEvent<HTMLElement>) => {
      const activePress = press.current;
      if (!activePress || activePress.pointerId !== e.pointerId) return;
      // Allow a little finger movement, but do not open/flag cells while scrolling.
      if (Math.hypot(e.clientX - activePress.x, e.clientY - activePress.y) > 10) cancel();
    },
    onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => {
      if (press.current?.pointerId === e.pointerId) cancel();
    },
    onPointerLeave: (e: ReactPointerEvent<HTMLElement>) => {
      if (press.current?.pointerId === e.pointerId) cancel();
    },
  };
};

export default useLongPress;
