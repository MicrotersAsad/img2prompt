
import { Suspense } from 'react';

import ImgPromptGenerator from '@/components/ImgPromptGenerator';
import Layout from '@/components/Layout';


export default async function Page() {

  return (
    <Layout>


    <Suspense fallback={<div>Loading...</div>}>
      <ImgPromptGenerator  />
    </Suspense>
        </Layout>
  );
}