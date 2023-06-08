import styles from '@/styles/buyer.module.css'
import Head from 'next/head'
const Products = () => {
  return (
    <div>
        <Head>
            <title>Buyer | FarmConnectET</title>
        </Head>

        <div className={styles.sideBarStyle}></div>
        <div>Buyer</div>
    </div>
  )
}

export default Products