
import { Suspense } from 'react';

import PromptToImageGenerator from '@/components/PromptToImage';


export default async function Page() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromptToImageGenerator  />
    </Suspense>
  );
}