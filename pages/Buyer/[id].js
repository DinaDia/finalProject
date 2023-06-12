import styles from '@/styles/supplier.module.css'
import Head from 'next/head';
import Image from 'next/image';
import ReactStars from 'react-stars';

export const getStaticPaths= async()=>{
  const res= await fetch('http://localhost:8000/farmers');
  const data= await res.json();

  const paths=data.map(farmer=>{
    return{
      params: {id: farmer.id.toString()}
    }
  })

  return{
    paths,
    fallback:false
  }
}

export const getStaticProps= async(context)=>{
  const id=context.params.id;
  const res= await fetch('http://localhost:8000/farmers/' + id);
  const data= await res.json();

  return{
    props:{farmer: data} 
  }
}

const SupplierDetails = ({farmer}) => {
  return (
    <div>
      <Head>
        <title>Supplier information | FarmConnectET</title>
      </Head>

      <div className={styles.farmerInfoBox}>
        <div className={styles.mainAreaStyle}>
          <div>
            <div className={styles.detailInfo}>
              <Image className={styles.profilePictureStyle} src="/user.jpg" width={70} height={60}></Image>
              <div className={styles.userInfoStyle}>
                <div className={styles.nameStyle}>{farmer.Name}</div>
                <div className={styles.locationStyle}>Based at {farmer.Location}</div>
              </div>     
            </div>  
            <div className={styles.ratingAndDealStyle}> 
                  <ReactStars className={styles.Ratings} count={5} size={25} value={farmer.Ratings}></ReactStars>
                  <div className={styles.verticalLineStyle}>&#124;</div>
                  <div className={styles.dealsAndProductStyle}>{farmer.Deals} deals </div>
                  <div className={styles.verticalLineStyle}>&#124;</div>
                  <div className={styles.dealsAndProductStyle}>Prime product : {farmer.Products}</div>
            </div>

            <div className={styles.farmDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tincidunt elit sit amet leo rhoncus vulputate.
              Morbi sollicitudin neque et efficitur scelerisque. Nunc semper lectus non interdum vulputate. 
            </div>              

          </div>

          <button className={styles.contactButton}>Contact</button>   

        </div>

        
      </div>

      <div className={styles.productList}>
        <h1 className={styles.ProductHeaderTextStyle}>List of available products</h1>
      </div>
    </div>
  )
}

export default SupplierDetails