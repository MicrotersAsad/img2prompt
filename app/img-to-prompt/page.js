
import { Suspense } from 'react';

import ImageToPromptGenerator from '@/components/ImageToPromptGenerator';
import Layout from '@/components/Layout';


export default async function Page() {

  return (
    <Layout>


    <Suspense fallback={<div>Loading...</div>}>
      <ImageToPromptGenerator  />
    </Suspense>
        </Layout>
  );
}