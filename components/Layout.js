import { useRouter } from "next/router"
import Footer from "./Footer"
import NavBar from "./NavBar"
import MainNavBar from "./MainNavBar";
import BuyerNavBar from "./BuyerNavBar";


export const LayOut = ({children}) => {
  const router=useRouter();
  if(router.pathname== "/"){
    return(
      <div>
        <NavBar/>
        {children}
        <Footer/>

      </div>
    )    
  }
  else if(router.pathname =="/ProductSupplier" || router.pathname =="/ProductSupplier/Order" ){
    return(
      <div>
        <MainNavBar/>
        {children}
        <Footer/>

      </div>
    )
  }
  
  else if(router.pathname=="/Buyer" || router.pathname=="/Buyer/Products" ||
  router.pathname=="/Buyer/Supplier" || router.pathname=="/Buyer/[id]"){
    return (
      <div>
          <BuyerNavBar/>
          {children}
          <Footer/>
      </div>
    )    
    }
  
  
  else if(router.pathname=="/AccountSetup/Login" || router.pathname =="/AccountSetup/Signup"){
  return (
    <div>
        {children}
    </div>
  )    
  }
   
  else{
    return(
      <div>
        {children}
      </div>
    )
  }

}
