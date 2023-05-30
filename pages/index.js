import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/landing.module.css'
import { useRouter } from 'next/router'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router=useRouter();

  return (
    <>
    <Head>
      <title>FarmConnectET</title>
    </Head>
      <div className={styles.mainStyle}>
        <h1 className={styles.mainText}>Connect. Shop. Thrive. <span className={styles.FarmConnectStyle}>At FarmConnectET</span></h1>
        <div className={styles.textStyle}> Connect with passionate farmers, shop for high quality products at prices suitable for you. 
        Thrive as you support sustainable agriculture and local economies. </div> 
        <div className={styles.textStyle}>Join us to celebrate agricultural excellence.</div>
        <button className={styles.signUpButton} onClick={()=>router.push("/Signup")}>Get started</button>        
      </div>
    </>
    )
}
