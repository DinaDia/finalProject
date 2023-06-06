import styles from '@/styles/users.module.css'
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
    <div className={styles.mainArea}>
      <h1 className={styles.SupplierHeaderTextStyle}>Supplier information</h1>
      <p>{farmer.Name}</p>
    </div>
  )
}

export default SupplierDetails