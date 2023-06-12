import styles from '@/styles/supplier.module.css'
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import ReactStars from 'react-stars';


export const getStaticProps=async()=>{

    const res=await fetch('http://localhost:8000/farmers');
    const data= await res.json();

    return {
        props:{ farmers: data}
    }
}

const Supplier = ({farmers}) => {

    return (
        <div>
            <Head>
                <title>Suppliers | FarmConnectET</title>
            </Head>
        
            <h1 className={styles.headerTextStyle}>Product Suppliers</h1>
            <div className={styles.mainArea}>
                <div className={styles.farmerInfo}>
                    {farmers.map(farmer=>(
                        <Link href={'/ProductSupplier/'+ farmer.id} key={farmer.id} className={styles.single}>
                            <div>
                                <div className={styles.detailInfo}>
                                <Image className={styles.profilePictureStyle} src="/user.jpg" width={70} height={60}></Image>
                                <div className={styles.userInfoStyle}>
                                    <div className={styles.nameStyle}>{farmer.Name}</div>
                                    <div className={styles.locationStyle}>Based at {farmer.Location}</div>
                                </div>     
                                </div>  
                                <div className={styles.ratingAndDeal}> 
                                    <ReactStars className={styles.Ratings} count={5} size={20} value={farmer.Ratings}></ReactStars>
                                    <div className={styles.verticalLine}>&#124;</div>
                                    <div className={styles.dealsAndProduct}>{farmer.Deals} deals </div>
                                    <div className={styles.verticalLine}>&#124;</div>
                                    <div className={styles.dealsAndProduct}>Prime product : {farmer.Products}</div>
                                </div>
                            </div>

                            
                            <button className={styles.button}>Contact</button>
                        </Link>
                    ))}
                </div>
     
            </div>
    
         
    
        </div>
      )
}

export default Supplier