import type { NextPage } from 'next'
import Head from 'next/head'
import SafeTerms from '@/components/terms'

const Imprint: NextPage = () => {
  return (
    <main>
      <Head>
        <title>Cronos Safe – Terms</title>
      </Head>

      <main>
        <SafeTerms />
      </main>
    </>
  )
}

export default Imprint
