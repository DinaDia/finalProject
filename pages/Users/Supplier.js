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
                        <div key={farmer.id} className={styles.single}>
                            <div cla="channel-picture"> 
                                <Image className={styles.profilePictureStyle} src="/user.jpg" width={50} height={50}></Image>
                            </div>
                            <Link href={'/Users/'+ farmer.id} className={styles.linkStyle}>
                                <div>{farmer.Name}</div>
                                <div>Based at: {farmer.Location}</div>
                            </Link>
                        </div>
                    ))}
                </div>
     
            </div>
    
         
    
        </div>
      )
}

export default Supplier