
import { Suspense } from 'react';

import PromptEnhancerTool from '@/components/PromptEnhancerTool';


export default async function Page() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromptEnhancerTool  />
    </Suspense>
  );
}