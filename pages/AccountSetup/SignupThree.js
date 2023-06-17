import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "@/styles/SignUp.module.css"
import { useState } from "react";

const SignupThree = ({thirdSubmit}) => {
    const router=useRouter();
    const [selectedProducts, setSelectedProducts]=useState([]);
    const [isActive, setIsActive]=useState(false);
    

    
    const products=[
      {id: 0, src: "/avocado.jpg", value: "Avocado", textValue: "Avocado"},
      {id: 1, src: "/Barley.jpg", value: "Barley", textValue: "Barley"},
      {id: 2, src: "/Cabbage.jpg", value: "Cabbage", textValue: "Cabbage"},
      {id: 3, src: "/carrot.jpg", value: "Carrot", textValue: "Carrot"},
      {id: 4, src: "/Chickpeas.jpg", value: "Chickpea", textValue: "Chickpea"},
      {id: 5, src: "/chillie paper.jpg", value: "chilliPaper", textValue: "Chilli paper"}

    ]
    const secondProducts=[
      {id: 0, src: "/cinnamon.jpg", value: "Cinnamon", textValue: "Cinnamon"},
      {id: 1, src: "/coffee.jpg", value: "Coffee", textValue: "Coffee"},
      {id: 2, src: "/corn.jpg", value: "Corn", textValue: "Corn"},
      {id: 3, src: "/Fava beans.jpg", value: "FavaBean", textValue: "Fava bean"},
      {id: 4, src: "/Flaxseed.jpg", value: "Flaxseed", textValue: "Flaxseed"},
      {id: 5, src: "/garlic.jpg", value: "Garlic", textValue: "Garlic"}

    ]
    const thirdProducts=[
      {id: 0, src: "/Ginger.jpg", value: "Ginger", textValue: "Ginger"},
      {id: 1, src: "/Groundnuts.jpg", value: "Groundnut", textValue: "Groundnut"},
      {id: 2, src: "/haricot bea.jpg", value: "HaricotBean", textValue: "Haricot bean"},
      {id: 3, src: "/kidney beans.jpg", value: "KidneyBean", textValue: "Kidney bean"},
      {id: 4, src: "/Lentil.jpg", value: "Lentil", textValue: "Lentil"},
      {id: 5, src: "/oats.jpg", value: "Oat", textValue: "Oat"}

    ]
    const fourthProducts=[
      {id: 0, src: "/Onions.jpg", value: "Onion", textValue: "Onion"},
      {id: 1, src: "/potato.jpg", value: "Potato", textValue: "Potato"},
      {id: 2, src: "/rice.jpg", value: "Rice", textValue: "Rice"},
      {id: 3, src: "/sesame seeds.jpg", value: "SesameSeed", textValue: "Sesame seed"},
      {id: 4, src: "/Sorghum.jpg", value: "Sorghum", textValue: "Sorghum"},
      {id: 5, src: "/Soybeans.jpg", value: "Soybean", textValue: "Soybeans"}

    ]

    const fifthProducts=[
      {id: 0, src: "/SunFlowerSeed.jpg", value: "SunFlowerSeed", textValue: "Sunflower seed"},
      {id: 1, src: "/Sweet potatoes.jpg", value: "SweetPotato", textValue: "Sweet potato"},
      {id: 2, src: "/Teff.jpg", value: "Teff", textValue: "Teff"},
      {id: 3, src: "/Tomatoes.jpg", value: "Tomato", textValue: "Tomato"},
      {id: 4, src: "/wheat.jpg", value: "Wheat", textValue: "Wheat"},
      {id: 5, src: "/whole peas.jpg", value: "WholePea", textValue: "WholePea"}

    ]

    const selectedOption=(id, value)=>{
      setSelectedProducts([...selectedProducts, value])
    }

    const handleSubmit=(e)=>{
      e.preventDefault();
      thirdSubmit(selectedProducts);
    }



  return (
    <div className={styles.mainBodyStyle}>
        <Head>
            <title> Get started | FarmConnectET</title>
        </Head>
        <div>
            <Image className={styles.imgStyle} src="/logo.jpg" height={65} width={230}></Image>
            <h1 className={styles.headerTextStyle}>Customize Your Preferences</h1>
            <h3 className={styles.headerProduct}>Select products you would to distribute</h3>

            <div className={styles.productStyle}>

              <div className={styles.productRowStyle}>
              {products.map((product)=>{
                return(
                    <div className={styles.productColumnStyle} key={product.id} onClick={()=>selectedOption(product.id, product.value)}>
                      <Image className={styles.profilePictureStyle} src={product.src} width={150} height={150}></Image>
                      <p>{product.textValue}</p>
                    </div>
                )
              })}
              </div>


              <div className={styles.productRowStyle}>
              {secondProducts.map((product)=>{
                return(
                    <div className={styles.productColumnStyle} key={product.id} onClick={()=>selectedOption(product.id, product.value)}>
                      <Image className={styles.profilePictureStyle} src={product.src} width={150} height={150}></Image>
                      <p>{product.textValue}</p>
                    </div>
                )
              })}
                </div>                  

              <div className={styles.productRowStyle}>
              {thirdProducts.map((product)=>{
                return(
                    <div className={styles.productColumnStyle} key={product.id} onClick={()=>selectedOption(product.id, product.value)}>
                      <Image className={styles.profilePictureStyle} src={product.src} width={150} height={150}></Image>
                      <p>{product.textValue}</p>
                    </div>
                )
              })}
                </div>                  

              <div className={styles.productRowStyle}>
              {fourthProducts.map((product)=>{
                return(
                    <div className={styles.productColumnStyle} key={product.id} onClick={()=>selectedOption(product.id, product.value)}>
                      <Image className={styles.profilePictureStyle} src={product.src} width={150} height={150}></Image>
                      <p>{product.textValue}</p>
                    </div>
                )
              })}
                </div>                  


              <div className={styles.productRowStyle}>
              {fifthProducts.map((product)=>{
                return(
                    <div className={styles.productColumnStyle} key={product.id} onClick={()=>selectedOption(product.id, product.value)}>
                      <Image className={styles.profilePictureStyle} src={product.src} width={150} height={150}></Image>
                      <p>{product.textValue}</p>
                    </div>
                )
              })}
                </div>                  


            </div>
            <div className={styles.buttonDiv}>
              <button className={styles.productButton}
              onClick={handleSubmit}>Next</button>
            </div>
        </div>

    </div>
  )
}

export default SignupThree