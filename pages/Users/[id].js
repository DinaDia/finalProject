import styles from '@/styles/users.module.css'
import Image from 'next/image';
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
      <div className={styles.farmerInfoBox}>
        <div className={styles.mainAreaStyle}>
          <div>
            <div className={styles.detailInfo}>
              <Image className={styles.profilePictureStyle} src="/user.jpg" width={70} height={60}></Image>
              <div className={styles.userInfoStyle}>
                <div>{farmer.Name}</div>
                <div>
                  <div>Based at {farmer.Location}</div>
                  <div>{farmer.Ratings} stars ({farmer.Deals} deals) </div>
                </div>
              </div>     


            </div>  

            <div className={styles.farmDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tincidunt elit sit amet leo rhoncus vulputate.
              Morbi sollicitudin neque et efficitur scelerisque. Nunc semper lectus non interdum vulputate. 
            </div>              

          </div>

    

          <button className={styles.contactButton}>Contact</button>          
        </div>

        
      </div>
    </div>
  )
}

export default SupplierDetails