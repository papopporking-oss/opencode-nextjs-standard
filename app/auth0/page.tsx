import { Suspense } from 'react'

async function PageAsync() {
  return (
    <></>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <PageAsync/>
    </Suspense>
  );
  
}