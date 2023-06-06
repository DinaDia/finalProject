import { useRouter } from "next/router"
import Footer from "./Footer"
import NavBar from "./NavBar"
import MainNavBar from "./MainNavBar";


export const LayOut = ({children}) => {
  const router=useRouter();
  
  if(router.pathname =="/"){
    return(
      <div>
        <NavBar/>
        {children}
        <Footer/>

      </div>
    )
  }
  
  
  
  else if(router.pathname!="/Login" && router.pathname !="/Signup"
   && router.pathname !="/Questions/QuestionOne" 
   && router.pathname !="/Questions/QuestionTwo"){
  return (
    <div>
        <MainNavBar/>
        {children}
        <Footer/>
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
