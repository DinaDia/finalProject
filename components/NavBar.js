import Image from "next/image"
import Link from "next/link"
import styles from "@/styles/navbar.module.css"
import { useRouter } from "next/router"

const NavBar = () => {
  const router=useRouter();
  return (
    <div className={styles.NavStyle}>
      <Link className={styles.logoStyle} href="/Homepage">FarmConnetET</Link>
      <div className={styles.navbarItemsStyle}>
        <Link className={styles.linkStyle} href="/MarketPlace">MarketPlace</Link>
      </div>

      <div className={styles.signUpStyles}>
        <button className={styles.loginButton} onClick={()=>router.push("/Login")}>Log in</button>
        <button className={styles.signUpButton} onClick={()=>router.push("/Login")}>Sign up</button>
      </div>

    </div>
  )
}

export default NavBar