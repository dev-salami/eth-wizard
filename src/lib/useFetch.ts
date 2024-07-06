import { useState } from "react";
 

export function useFetch({network,address} : {network : string , address : string} ) {
  const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
  const [datum, setData] = useState(null);




  return {isLoading, error,datum} // infers [boolean, typeof load] instead of (boolean | typeof load)[]
}

//  const {
//       isLoading,
//       error,
//       datum,
//     }: { isLoading: boolean; error: any; datum: any } = useFetch(data);