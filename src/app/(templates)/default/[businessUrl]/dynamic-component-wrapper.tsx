'use client';

import dynamic from 'next/dynamic';

// Dynamically import your component with SSR disabled
const DynamicComponent = dynamic(() => import('./preview-client'), {
  ssr: false,
});

export default function DynamicComponentWrapper() {
  return <DynamicComponent />;
}
