
import { Suspense } from 'react';

import ImgPromptGenerator from '@/components/ImgPromptGenerator';


export default async function Page() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImgPromptGenerator  />
    </Suspense>
  );
}