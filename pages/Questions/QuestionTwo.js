import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "@/styles/SignUp.module.css"
import ProductList from "../ProductList";
import { useState } from "react";

const QuestionTwo = () => {
    const router=useRouter();
    const [selectedProducts, setSelectedProducts]=useState([]);
    const {list}=ProductList();


  return (
    <div className={styles.mainBodyStyle}>
        <Head>
            <title> Get started | FarmConnectET</title>
        </Head>
        <div>
            <Image className={styles.imgStyle} src="/logo.jpg" height={65} width={230}></Image>
            <h1 className={styles.headerTextStyle}>Customize Your Preferences</h1>
            <div className={styles.productStyle}>
                <div className={styles.productRowStyle}>
                    <div className={styles.selectedProductStyle}>Choose Products from a list </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default QuestionTwo