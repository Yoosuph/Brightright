import React, { useState, useEffect, useRef } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string; // Unique identifier for the current page
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  pageKey, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [content, setContent] = useState(children);
  const previousPageKey = useRef(pageKey);
  const transitionTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (pageKey !== previousPageKey.current) {
      // Clear any existing timeout
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }

      // Fade out
      setIsVisible(false);
      
      // After fade out completes, change content and fade in
      transitionTimeout.current = setTimeout(() => {
        setContent(children);
        previousPageKey.current = pageKey;
        
        // Small delay to ensure content is rendered before fading in
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      }, 150); // Match this with the CSS transition duration
    } else {
      // If the page key is the same, just update the content immediately
      setContent(children);
    }

    return () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
    };
  }, [children, pageKey]);

  return (
    <div 
      className={`transition-all duration-150 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2'
      } ${className}`}
    >
      {content}
    </div>
  );
};

export default PageTransition;