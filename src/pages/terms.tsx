import type { NextPage } from 'next'
import Head from 'next/head'
import { Typography } from '@mui/material'

const Welcome: NextPage = () => {
  return (
    <main>
      <Head>
        <title>Cronos Safe – Disclaimer</title>
      </Head>

      <Typography variant="h1" mb={2}>
        Disclaimer
      </Typography>
      <Typography variant="h4" mb={2}>
        To the maximum extent permitted by applicable law:
      </Typography>
      <Typography variant="body2" mb={4}>
        Services provided by us will be provided “as is” and “as available” and we do not warrant that it will be
        uninterrupted or error free. Your access and use of our services is entirely at your sole risk and we will not
        be responsible for any actions you take based on our services.
        <br />
        We hereby disclaim all warranties, express, statutory or implied (including, without limitation, implied
        warranties of title, non-infringement, merchantability and fitness for a particular purpose) as to the results
        that might be obtained or losses that may result from the use of our services.
      </Typography>
    </main>
  )
}

export default Welcome
