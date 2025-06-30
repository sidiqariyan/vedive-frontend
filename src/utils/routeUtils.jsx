import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { LoadingSpinner, PageTransition } from "../components/common/CommonComponents.jsx";

// Enhanced route renderer with intersection observer preloading
export const renderRoute = (route, index, wrapper = null) => {
  const Component = route.component;
  
  const handleMouseEnter = () => {
    if (Component.preload && typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => Component.preload());
    } else if (Component.preload) {
      Component.preload();
    }
  };

  const element = route.noLazy ? (
    <PageTransition>
      <Component />
    </PageTransition>
  ) : (
    <Suspense fallback={<LoadingSpinner />}>
      <PageTransition>
        <Component />
      </PageTransition>
    </Suspense>
  );

  const wrappedElement = wrapper ? wrapper(element) : element;

  return (
    <Route
      key={`${route.path}-${index}`}
      path={route.path}
      element={
        <div onMouseEnter={handleMouseEnter}>
          {wrappedElement}
        </div>
      }
    />
  );
};