import Head from "next/head";
import { useRouter } from "next/router"
import { useState } from "react";
import styles from "@/styles/SignUp.module.css";
import Link from "next/link";
import Image from "next/image";

const Signup = () => {

  const router=useRouter();
  const [name, setName]=useState('');
  const [phoneNo, setPhoneNo]=useState('');
  const [city, setCity]=useState('');
  const [email, setEmail]=useState('');
  const [passWord, setPassWord]=useState('');

  const handleSubmit=(e)=>{
    e.preventDefault();
    router.push("/Questions/QuestionOne");
  }
  
  return (
    <div>
    <Head>
      <title>Signup | FarmConnectET</title>
    </Head>
    <div>
      <Image src="/logo.jpg" height={55} width={220}></Image>
      <h1 className={styles.headerTextStyle}>Get started</h1>
      <div className={styles.formDivStyle}>
        <form className={styles.signUpFormStyle}>
            <label className={styles.labelStyle}>Full name</label>
            <input className={styles.inputStyle} type="text"
            value={name} placeholder="Full name"
            onchange={(e)=>setName(e.target.value)}/>

            <label className={styles.labelStyle}>Phone number</label>
            <input className={styles.inputStyle} type="number"
            value={phoneNo}  placeholder="Phone number"
            onchange={(e)=>setPhoneNo(e.target.value)}/>

            <label className={styles.labelStyle}>Password</label>
            <input className={styles.inputStyle} type="text"
            value={passWord}  placeholder="Password"
            onchange={(e)=>setPassWord(e.target.value)}/>


            <button className={styles.loginButton}
            onClick={handleSubmit}>SignUp</button>
         
        </form>

        <div className={styles.newAccountStyle}>
          <p className={styles.lastTextStyle}>
            Already have an account? <Link className={styles.linkStyle} href="/Login">Log in</Link>.
          </p>
      </div>
      
      </div>
    </div>
    </div>
  )
}

export default Signup