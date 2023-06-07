import Image from "next/image"
import Link from "next/link"
import styles from "@/styles/navbar.module.css"
import { useRouter } from "next/router"

const MainNavBar = () => {
  const router=useRouter();

  const handleSubmit=(e)=>{
    e.preventDefault();
    router.push("/Users/UserSetting")

  }
  return (
    <div className={styles.NavStyle}>
      <Link className={styles.logoStyle} href="/Homepage">
        <Image src="/logo.jpg" height={55} width={220}></Image></Link>
        <div className={styles.navbarItemsStyle}>
          <Link className={styles.navLinkStyle} href="/Products">Products</Link>
          <Link className={styles.navLinkStyle} href="/Users/Supplier">Suppliers</Link>
          <Link className={styles.navLinkStyle} href="/MarketPlace">Market place</Link>
          <Link className={styles.navLinkStyle} href="/AboutUs">About us</Link>

        </div>
      <div>
        <Image onClick={handleSubmit} className={styles.profilePictureStyle} src="/user.jpg" width={50} height={50}></Image>
      </div>

    </div>
  )
}

export default MainNavBar