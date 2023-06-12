import styles from '@/styles/buyer.module.css'
import Head from 'next/head'
import { useState } from 'react'

const Products = () => {

    const [product, setProduct]=useState();
    const [quantity, setQuantity]=useState();

    const handleSubmit=(e)=>{
        e.preventDefault();
    }

  return (
    <div>
        <Head>
            <title>Buyer | FarmConnectET</title>
        </Head>

        <div className={styles.sideBarStyle}>
        <form className={styles.formStyle}>
            <label className={styles.labelStyle}>Product</label>
            <select className={styles.optionStyle} value={product}
            onChange={(e)=>setProduct(e.target.value)}>
                <option hidden>Select product you would like to purchase</option>
                <option value="Onion">Onion</option>
                <option value="Tomato">Tomato</option>
                <option value="Wheat">Wheat</option>
            </select>

            <label className={styles.labelStyle}>Quantity</label>
            <input className={styles.inputStyle} type='number'
            value={quantity}  placeholder="Quantity of product in kgs"
            onchange={(e)=>setQuantity(e.target.value)}/>

            <button className={styles.loginButton}
            onClick={handleSubmit}>Calculate</button>
         
        </form>

        </div>
        <div className={styles.sampleContent}></div>
    </div>
  )
}

export default Products