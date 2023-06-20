import styles from '@/styles/buyer.module.css';
import Head from 'next/head';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactStars from 'react-stars';

export const getStaticProps=async()=>{

    const res=await fetch('http://localhost:8000/products');
    const data= await res.json();

    const resOne=await fetch('http://localhost:8000/availableProducts');
    const dataOne=await resOne.json();

    const resTwo=await fetch('http://localhost:8000/productType');
    const dataTwo=await resTwo.json();

    return{
        props: {
            products: data,
            availableProducts: dataOne,
            productTypes:dataTwo
        },
    };
  }



const Products = ({products, availableProducts, productTypes}) => {

    const [product, setProduct]=useState();
    const [quantity, setQuantity]=useState();

    const[ sorting, setSorting]=useState('');

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(sorting)
        console.log(product)
    }

  return (
    <div>
        <Head>
            <title>Products | FarmConnectET</title>
        </Head>

        <div className={styles.sideBarStyle}>
        <form className={styles.formStyle}>
            <label className={styles.labelStyle}>Product</label>
            <select className={styles.optionStyle} value={product}
            onChange={(e)=>setProduct(e.target.value)}>
                <option hidden>Select product you would like to purchase</option>
                
                {products.map((product, index)=>{
                    return(
                        <option className={styles.optionStyle} key={index} value={product.value}>{product.textValue}</option>
                    )
                })}

            </select>

            <label className={styles.labelStyle}>Quantity</label>
            <input className={styles.inputStyle} type='number'
            value={quantity}  placeholder="Quantity of product in kgs"
            onchange={(e)=>setQuantity(e.target.value)}/>

            <button className={styles.loginButton}
            onClick={handleSubmit}>Calculate</button>
         
        </form>
        </div>

        <div className={styles.sampleContent}>
            <div className={styles.filerStyles}>
                <select className={styles.multipleOptionStyle}
                value={sorting}
                onChange={(e)=>setSorting(e.target.value)}>
                <option hidden>Sorting type</option>
                <option value="Ascending">Ascending</option>
                <option value="Descending">Descending</option>

             </select>

             <select className={styles.multipleOptionStyle}>
                <option hidden>Select Product</option>

                {products.map((product, index)=>{
                    return(
                        <option className={styles.optionStyle} key={index} value={product.value}>{product.textValue}</option>
                    )
                })}

             </select>   

             
             <select className={styles.multipleOptionStyle}>
                <option hidden>Select Product Type</option>

                {productTypes.map((productType, index)=>{
                    return(
                        <option className={styles.optionStyle} key={index} value={productType.id}>{productType.name}</option>
                    )
                })}

             </select>            


            </div>


            <div className={styles.farmerInfo}>
                    {availableProducts.map(availableProduct=>(
                        <Link href={'/Buyer/'+ availableProduct.supplierId} key={availableProduct.id} className={styles.single}>
                            <div>
                                <div className={styles.productInfo}>
                                <Image className={styles.pictureStyle} src={availableProduct.src} alt="product picture"  width={120} height={120}></Image>
                                <div className={styles.productInfoStyle}>
                                    <div className={styles.productNameStyle}>{availableProduct.name}</div>
                                    <div className={styles.locationStyle}>Crop origin:  {availableProduct.Location}</div>


                                    <div className={styles.productRatingAndDeal}> 
                                        <div className={styles.dealsAndProduct}>{availableProduct.supplier}</div>
                                        <div className={styles.verticalLine}>&#124;</div>
                                        <div className={styles.dealsAndProduct}>{availableProduct.Deals} deals </div>
                                        <div className={styles.verticalLine}>&#124;</div>
                                        <div className={styles.dealsAndProduct}>{availableProduct.availability} available</div>
                                </div>
                                </div>   

                                  
                                </div>  

                                
                            </div>

                            
                            <div className={styles.priceStyle}>{availableProduct.price} birr/kg</div>

            

                        </Link>
                    ))}
                </div>
        </div>
    </div>
  )
}

export default Products