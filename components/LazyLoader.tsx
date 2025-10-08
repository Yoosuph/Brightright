import React, { lazy, Suspense, ComponentType } from 'react';
import { SkeletonCard, SkeletonChart, SkeletonStats, SkeletonTable, SkeletonList } from './SkeletonLoader';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

// Generic lazy loader for any component
const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  fallback = <SkeletonCard />, 
  className = '' 
}) => {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  );
};

// Pre-configured lazy loaders for different types of content
export const LazyDashboardCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LazyLoader fallback={<SkeletonCard />}>
    {children}
  </LazyLoader>
);

export const LazyChart: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LazyLoader fallback={<SkeletonChart />}>
    {children}
  </LazyLoader>
);

export const LazyTable: React.FC<{ children: React.ReactNode; rows?: number; columns?: number }> = ({ 
  children, 
  rows = 5, 
  columns = 4 
}) => (
  <LazyLoader fallback={<SkeletonTable rows={rows} columns={columns} />}>
    {children}
  </LazyLoader>
);

export const LazyStats: React.FC<{ children: React.ReactNode; count?: number }> = ({ 
  children, 
  count = 4 
}) => (
  <LazyLoader fallback={<SkeletonStats count={count} />}>
    {children}
  </LazyLoader>
);

export const LazyList: React.FC<{ children: React.ReactNode; items?: number; showAvatar?: boolean }> = ({ 
  children, 
  items = 6, 
  showAvatar = true 
}) => (
  <LazyLoader fallback={<SkeletonList items={items} showAvatar={showAvatar} />}>
    {children}
  </LazyLoader>
);

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(() => Promise.resolve({ default: WrappedComponent }));
  
  return (props: P) => (
    <Suspense fallback={fallback || <SkeletonCard />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Helper for creating lazy-loaded page components
export function createLazyPage<P extends object>(
  importFunction: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  const LazyPage = lazy(importFunction);
  
  return (props: P) => (
    <Suspense fallback={fallback || (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonStats count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    )}>
      <LazyPage {...props} />
    </Suspense>
  );
}

// Intersection Observer based lazy loading for viewport-based loading
interface ViewportLazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export const ViewportLazyLoader: React.FC<ViewportLazyLoaderProps> = ({
  children,
  fallback = <SkeletonCard />,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

export default LazyLoader;