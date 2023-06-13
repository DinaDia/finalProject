import styles from '@/styles/SignUp.module.css'
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';


const SignupTwo = ({finalSubmit}) => {

    const [mainProduct, setMainProduct]=useState();
    
    const handleSubmit=(e)=>{
        e.preventDefault();
        finalSubmit(mainProduct);
        
    }

  return (
    <div className={styles.questionOneStyle}>
        <Head>
            <title>Get started | FarmConnectET</title>
        </Head>    
        <div>
        <Image className={styles.imgStyle} src="/logo.jpg" height={65} width={230}></Image>
        <h1 className={styles.headerTextStyle}>Customize Your Preferences</h1>
        
        <div className={styles.formDivStyle}>
            <form className={styles.formStyle}>

            <label className={styles.labelStyle}> What is your main product?</label>
            <select className={styles.optionStyle} value={mainProduct}
            onChange={(e)=>setMainProduct(e.target.value)}>
                <option hidden>Select your main product</option>
                <option value="Avocado">Avocado</option>
                <option value="Barley">Barley</option>
                <option value="Cabbage">Cabbage</option>
                <option value="Carrot">Carrot</option>
                <option value="Chickpea">Chickpea</option>
                <option value="chilliPaper">chilli paper</option>
                <option value="Cinnamon">Cinnamon</option>
                <option value="Coffee">Coffee</option>
                <option value="Corn">Corn</option>
                <option value="FavaBean">Fava bean</option>
                <option value="Flaxseed">Flaxseed</option>
                <option value="Garlic">Garlic</option>
                <option value="Ginger">Ginger</option>
                <option value="Groundnut">Groundnut</option>
                <option value="HairCotBean">Haircot bean</option>
                <option value="KidneyBean">Kidney bean</option>
                <option value="Lentil">Lentil</option>
                <option value="Oat">Oat</option>
                <option value="Onion">Onion</option>
                <option value="Potato">Potato</option>
                <option value="Rice">Rice</option>
                <option value="SesameSeed">Sesame seed</option>
                <option value="Sorghum">Sorghum</option>
                <option value="Soybean">Soybean</option>
                <option value="SunFlowerSeed">Sunflower seed</option>
                <option value="SweetPotato">Sweet potato</option>
                <option value="Tea">Tea</option>
                <option value="Tomato">Tomato</option>
                <option value="Wheat">Wheat</option>
                <option value="WholePea">Whole pea</option>

                
            </select>
            <button className={styles.loginButton}
            onClick={handleSubmit}>Submit</button>
            </form>

        </div>
        </div>
    </div>

  )
}

export default SignupTwo