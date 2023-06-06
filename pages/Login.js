import Head from "next/head";
import { useRouter } from "next/router"
import { useState } from "react";
import styles from "@/styles/SignUp.module.css";
import Link from "next/link";
import Image from "next/image";

const Login = () => {
  const router=useRouter();
  const [email, setEmail]=useState('');
  const [passWord, setPassWord]=useState('');

  const handleSubmit=(e)=>{
    e.preventDefault();
    router.push("/Homepage")
  }
  
    
  return (
    <div className={styles.mainBodyStyle}>
    <Head>
      <title>Log in | FarmConnectET</title>
    </Head>
    <div>
    <Image className={styles.imgStyle} src="/logo.jpg" height={65} width={230}></Image>
      <h1 className={styles.headerTextStyle}>Welcome back</h1>
      <div className={styles.formDivStyle}>
        <form className={styles.formStyle}>
            <label className={styles.labelStyle}>Username or email address</label>
            <input className={styles.inputStyle} type="Username or email address"
            value={email} placeholder="Email address"
            onchange={(e)=>setEmail(e.target.value)}/>

            <label className={styles.labelStyle}>Password</label>
            <input className={styles.inputStyle} type="text"
            value={passWord}  placeholder="Password"
            onchange={(e)=>setPassWord(e.target.value)}/>

            <button className={styles.loginButton}
            onClick={handleSubmit}>Log in</button>
         
        </form>

        <div className={styles.newAccountStyle}>
          <p className={styles.lastTextStyle}>
            Don't have an account? <Link className={styles.linkStyle} href="/Signup">Sign up</Link>.
          </p>
      </div>
      
      </div>

      
    </div>
    </div>
  )
}

export default Login