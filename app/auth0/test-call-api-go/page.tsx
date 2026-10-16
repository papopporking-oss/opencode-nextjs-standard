import { auth0 } from '@/lib/auth0';
import { Suspense } from 'react'

async function PageAsync() {

  const session = await auth0.getSession();
  // const user = session?.user;

  console.log(session)

  return (
    <>{JSON.stringify(session)}</>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <PageAsync/>
    </Suspense>
  );
  
}