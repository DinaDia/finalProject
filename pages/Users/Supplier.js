import styles from '@/styles/users.module.css'
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';


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
        
            <h1 className={styles.headerTextStyle}>Suppliers</h1>
            <div className={styles.mainArea}>
                <div className={styles.farmerInfo}>
                    {farmers.map(farmer=>(
                        <Link href={'/Users/'+ farmer.id} key={farmer.id} className={styles.single}>
                            <Image className={styles.profilePictureStyle} src="/user.jpg" width={70} height={60}></Image>
                            <div>
                                <div className={styles.nameStyle}>{farmer.Name}</div>
                                <div className={styles.ratingAndLocation}>
                                    {farmer.Location}
                                    {farmer.Ratings} stars
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