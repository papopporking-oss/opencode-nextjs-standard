'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <main>
      <div>
        hello
      </div>
      <div>
        <p id="demo"></p>
      </div>
      <Script src="/javascript/main/script/script.js" strategy="afterInteractive"/>
    </main>
  );
}
