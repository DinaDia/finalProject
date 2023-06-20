import Image from "next/image"
import Link from "next/link"
import styles from "@/styles/navbar.module.css"
import { useRouter } from "next/router"

const BuyerNavBar = () => {
  const router=useRouter();

  const handleSubmit=(e)=>{
    e.preventDefault();
    router.push("/UserSetting")

  }
  return (
    <div className={styles.NavStyle}>
      <Link className={styles.logoStyle} href="/Homepage">
        <Image src="/logo.jpg" alt="logo" height={55} width={220}></Image></Link>
        <div className={styles.navbarItemsStyle}>
          <Link className={styles.navLinkStyle} href="/Buyer/Products">Products</Link>
          <Link className={styles.navLinkStyle} href="/Buyer/Supplier">Suppliers</Link>
          <Link className={styles.navLinkStyle} href="/MarketAnalysis">Market analysis</Link>
          <Link className={styles.navLinkStyle} href="/AboutUs">About us</Link>

        </div>
      <div>
        <Image onClick={handleSubmit} alt="user" className={styles.profilePictureStyle} src="/user.jpg" width={50} height={50}></Image>
      </div>

    </div>
  )
}

export default BuyerNavBar