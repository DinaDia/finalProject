import Image from "next/image"
import Link from "next/link"
import styles from "@/styles/navbar.module.css"
import { useRouter } from "next/router"

const NavBar = () => {
  const router=useRouter();
  return (
    <div className={styles.NavStyle}>
      <Link className={styles.logoStyle} href="/Homepage">
        <Image src="/logo.jpg" alt=" logo"height={55} width={220}></Image></Link>
      <div className={styles.navbarItemsStyle}>
        <Link className={styles.navLinkStyle} href="/AccountSetup/Login">Products</Link>
        <Link className={styles.navLinkStyle} href="/AccountSetup/Login">Suppliers</Link>
        <Link className={styles.navLinkStyle} href="/AccountSetup/Login">Market analysis</Link>
        <Link className={styles.navLinkStyle} href="/AccountSetup/Login">About us</Link>

      </div>

      <div className={styles.signUpStyles}>
        <button className={styles.loginButton} onClick={()=>router.push("/AccountSetup/Login")}>Log in</button>
        <button className={styles.signUpButton} onClick={()=>router.push("/AccountSetup/Signup")}>Sign up</button>
      </div>

    </div>
  )
}

export default NavBar