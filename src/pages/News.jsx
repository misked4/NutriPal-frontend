import React, { useState, useRef, useCallback } from "react";
import useRecipes from "./Recipe/hooks";
import { Box } from '@mui/material';
import Post from './Recipe/Post';

function changeHeight() {
  document.getElementsByClassName("myDiv")[0].style.height = "100%";
}

export const News = () => {
  const [pageNum, setPageNum] = useState(1)
  const {
    isLoading,
    isError,
    error,
    results,
    hasNextPage
  } = useRecipes(pageNum)


  const intObserver = useRef()
  const lastPostRef = useCallback(post => {
    if(isLoading) return

    if(intObserver.current) intObserver.current.disconnect()

    intObserver.current = new IntersectionObserver(posts => {
      if(posts[0].isIntersecting && hasNextPage && !isError){
        console.log("we are near the last post!")
        setPageNum(prev => prev + 1)
        changeHeight()
      }
    })

    if(post) intObserver.current.observe(post)
  },[isLoading, hasNextPage])

  const content = results.map((post, i) => {
    if(results.length === i + 1){
      return <Post ref={lastPostRef} key={post.id} post={post}></Post>
    }
    return <Post key={post.id} post={post}></Post>
  })
  
  return (
    <Box flex={4} p={2}>
      {content}
      {isLoading && <p>Loading more posts...</p>}
    </Box>
  )
}
