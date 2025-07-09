
import { Suspense } from 'react';

import ImageToPromptGenerator from '@/components/ImageToPromptGenerator';


export default async function Page() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImageToPromptGenerator  />
    </Suspense>
  );
}