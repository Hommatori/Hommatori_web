import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Account() {
  return (
    <>
      <Head>
        <title>Tili</title>
      </Head>
      <main>
        <div>
          <a>Tili</a>
        </div>
      </main>
    </>
  )
}
