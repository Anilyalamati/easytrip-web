import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  index?: number;
  staggerMs?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  index = 0,
  staggerMs = 120,
  className = '',
  direction = 'up',
  distance = 28,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0) scale(0.97)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0) scale(0.97)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0) scale(0.97)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0) scale(0.97)`;
      case 'none':
      default:
        return 'translate3d(0, 0, 0) scale(0.97)';
    }
  };

  const delayMs = Math.min(index * staggerMs, 720);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};
