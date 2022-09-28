import React, { useState, useEffect } from "react";
import {getRecipePage} from './APIcomms';

const useRecipes = (pageNum = 1) => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState({});
    const [hasNextPage, setHasNextPage] = useState(false);

    useEffect(()=>{
        setIsLoading(true)
        setIsError(false)
        setError({})

        const controller = new AbortController()
        const { signal } = controller

        getRecipePage(pageNum, { signal } )
            .then(data => {
                setResults(prev => [...prev, ...data])
                setHasNextPage(Boolean(data.length))
                setIsLoading(false)
            })
            .catch(e=>{
                setIsLoading(false)
                if(signal.aborted) return
                setIsError(true)
                setError({message: e.message})
            })

        return () => controller.abort()
    },[pageNum])

    return { isLoading, isError, error, results, hasNextPage }
}

export default useRecipes;
