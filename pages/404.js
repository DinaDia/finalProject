import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

const notFound = () => {
  const router=useRouter();
    useEffect(()=>{
      setTimeout(()=>{
        // router.go(-1) basically backarrow. It is used to go between pages 
        router.push('/');
        // If its go(number) its based on the user exerince. 
        // Push('/') directs them a specific page
      }, 3000)
    }, [])

  return (

    <div>
        <h2>Page not found</h2>
        <p>Go back to <Link className="linkStyle" href="/">Homepage</Link></p>
    </div>
  )
}

export default notFound