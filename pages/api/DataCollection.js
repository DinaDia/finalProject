import { useState, useEffect } from "react"
const DataCollection = (url) => {

    const [data, SetData]=useState(null);
    const [error, setError]=useState(null);

    useEffect(()=>{
      fetch(url)

      .then(res=>{
        if(!res.ok){
          throw Error('Error occurred. Please try again');
        }
        return res.json();
      })
      .then(data=>{
        SetData(data);
        setError(null);
      })

      .catch(err=>{
        setError(err.message);
      });
      
    }, [url])
  return {data, error}
}

export default DataCollection