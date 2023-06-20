import styles from '@/styles/buyer.module.css'
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import ReactStars from 'react-stars';


export const getStaticProps=async()=>{

    const res=await fetch('http://localhost:8000/order');
    const data= await res.json();

    return {
        props:{ orders: data}
    }
}

const Order = ({orders}) => {

  return (
    <div>
        <Head>
            <title>Orders | FarmConnectET</title>
        </Head>
    
        <h1 className={styles.headerTextStyle}>List of orders</h1>
        <div className={styles.mainArea}>
            <div className={styles.farmerInfo}>
                {orders.map(order=>(
                    <div key={order.id} className={styles.single}>
                        <div>
                            <div className={styles.detailInfo}>
                            <div className={styles.userInfoStyle}>
                                <div className={styles.nameStyle}>{order.name}</div>
                                <div className={styles.locationStyle}>Based at {order.location}</div>
                            </div>     
                            </div>  
                            <div className={styles.ratingAndDeal}> 
                                <div className={styles.dealsAndProduct}>{order.orderBy} </div>
                                <div className={styles.verticalLine}>&#124;</div>
                                <div className={styles.dealsAndProduct}>{order.amount}</div>
                            </div>
                        </div>

                        
                        <button className={styles.button}>Contact</button>
                    </div>
                ))}
            </div>
 
        </div>

     

    </div>
  )
}

export default Order