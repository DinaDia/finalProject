import Head from 'next/head'
import styles from '@/styles/landing.module.css'
import { useRouter } from 'next/router'


const Homepage = () => {
  return (
    <div>
      <Head>
        <title>FarmConnectET</title>
      </Head>
        <div className={styles.mainStyle}>
          <h1 className={styles.mainText}>Connect. Shop. Thrive. <span className={styles.FarmConnectStyle}>At FarmConnectET</span></h1>
          <div className={styles.textStyle}> Sell your products, shop for high quality products at prices suitable for you. 
          Thrive as you support sustainable agriculture and local economies. </div> 
          <div className={styles.textStyle}>Join us to celebrate agricultural excellence.</div>
        </div>

    </div>
  )
}

export default Homepage