import { useState } from "react";
import SignupOne from "./SignupOne";
import { useRouter } from "next/router";
import SignupTwo from "./SignupTwo";
import SignupThree from "./SignupThree";
import Login from "./Login";
import FinalQuestion from "./FinalQuestion";
import AgriMaterial from "../AgriMaterial";

const Signup = () => {
  const router=useRouter();

  const [order, setOrder]=useState(0);
  const [userName, setUserName]=useState('');
  const [userCity, setUserCity]=useState('');
  const [userEmail, setUserEmail]=useState('');
  const [userPassWord, setUserPassWord]=useState('');

  const [userSignupType, setUserSignupType]=useState('');

  const [products, setProducts]=useState([]);

  const [primeProduct, setPrimeProduct]=useState('');


  const orderChanges=()=>{
    if(order === 0){
      return <SignupOne firstSubmit={getContactInfo}/>
  
    }
    else if(order === 1){
      return <SignupTwo secondSubmit={getUserType}/>
    }
    else if(order === 2){
      return <SignupThree  thirdSubmit={getProductListing}/>
    }
    else if(order === 3){
      return <AgriMaterial/>
    }
    else if(order=== 4) {
      return <FinalQuestion finalSubmit={getMainProduct}/>
    }
  }

  const getContactInfo=(name, city, email, passWord)=>{
    setUserName(name);
    setUserCity(city);
    setUserEmail(email);
    setUserPassWord(passWord);
    setOrder(1);
  }

  const getUserType=(userType)=>{
    if(userType === "Farmer" || userType ==="Both"){
      setOrder(2);
      }
  else if(userType === "Material"){
    setOrder(3);
  }
  else{
    setOrder(5);
  }

  setUserSignupType(userType);

  }

  const getProductListing=(selectedProducts)=>{
    setProducts([...products, selectedProducts]);
    setOrder(4);
  }

  const getMainProduct=(mainProduct)=>{
    setPrimeProduct(mainProduct);

    const farmer={userName, userCity, userEmail, userPassWord,
       userSignupType, products, primeProduct}

       fetch('http://localhost:8000/farmers',{
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(farmer)
       })
       .then(
        router.push('../ProductSupplier')
       )
  }

  return (
    <div>{orderChanges(order)}</div>
  )
}

export default Signup