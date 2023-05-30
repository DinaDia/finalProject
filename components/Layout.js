import Footer from "./Footer"
import NavBar from "./NavBar"


export const LayOut = ({children}) => {
  return (
    <div>
        <NavBar/>
        {children}
        <Footer/>
    </div>
  )
}
