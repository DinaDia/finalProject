import styles from '@/styles/supplier.module.css'
import Head from 'next/head';
import Link from 'next/link';


export const getStaticProps=async()=>{

  const res=await fetch('http://localhost:8000/recommendedMarket');
  const data= await res.json();

  return {
      props:{ marketPlaces: data}
  }
}


const index = ({marketPlaces}) => {
  return (
    <div>
    <Head>
      <title>Consumer | FarmConnectET</title>
    </Head>
    <div className={styles.mainStyle}>
      <h1 className={styles.mainText}>Welcome to <span className={styles.FarmConnectStyle}>FarmConnectET</span></h1>
      <div className={styles.introStyle}> Shop for high quality produce at your convenience at fair price </div> 
      <div className={styles.textStyle}> Here are list of market places recommended to make your purchase at today market rate </div> 
      <div className={styles.mainArea}>
              <div className={styles.marketPlaceInfo}>
                  {marketPlaces.map((marketPlace)=>(
                      <div className={styles.single} key={marketPlace.id}>
                              <div className={styles.detailInfo}>
                              <div className={styles.userInfoStyle}>
                                  <div className={styles.nameStyle}>{marketPlace.name}</div>
                              </div>   
                              <div className={styles.profitAndPrice}>Profit : {marketPlace.profit}</div>
                              <div className={styles.profitAndPrice}>Price range : {marketPlace.price}</div>

                              </div>
                      </div>
                  ))}
              </div>
   
          </div>
  

    </div>

  </div>
  )
}

export default index