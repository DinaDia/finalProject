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
  
  
  
  else if(router.pathname!="/AccountSetup/Login" && router.pathname !="/AccountSetup/Signup"
   && router.pathname !="/AccountSetup/QuestionOne" 
   && router.pathname !="/AccountSetup/QuestionTwo"){
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
