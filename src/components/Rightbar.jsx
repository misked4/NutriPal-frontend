import React from 'react';
import { AvatarGroup, Box, Typography, Avatar, Divider, ImageList, ImageListItem } from '@mui/material';
import { theme } from "../theme";
import { useEffect, useState } from 'react';
import { getRecipePage } from '../pages/Recipe/APIcalls';
import './Rightbar.css'

export const Rightbar = () => {
  const [ recipes, setRecipes ] = useState([]);
  const [ error, setError ] = useState(false);

  useEffect(()=>{
    getRecipePage(1)
      .then(data => {
        setRecipes(data)
      })
      .catch(e=>{
          setError(true)
    })
  },[]);

  return (
    <Box id='swingRight' className='slide-in-right' bgcolor={theme.palette.cream.main} flex={1.5} p={2} sx={{display:{xs:"none", sm: "block"}, heigth:"100vmax"}}>
      <Box position="fixed">
        <Typography variant="h5" fontWeight={100}>Oni koji su dodali nove recepte</Typography>
        <AvatarGroup max={7}>
          {
            recipes.map(recipe=>(
              <Avatar src={recipe.KorisnikSlika} key={recipe.id} />
            ))
          }
        </AvatarGroup>
        <Divider sx={{m:2}}/>
        <Typography variant="h5" fontWeight={100}>Najnoviji recepti</Typography>
        <ImageList
          sx={{ width: "100%", height: "100%" }}
          variant="quilted"
          cols={4}
          rowHeight={121}
        >
          {recipes.slice(0,-2).map((item, i) => (
            <ImageListItem key={i} cols={i%5==0 || i==3 || i==4? 2 : 1} rows={i%5==0? 2 : 1}>
              <img
                {...srcset(item.ReceptSlika, 121, item.rows, item.cols)}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
        <Divider sx={{m:2}} />
      </Box>
    </Box>
  )
}
//<Typography variant="h5" fontWeight={100}>Latest Conversations</Typography> //ispod Divider
function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function QuiltedImageList() {
  return (
    <ImageList
      sx={{ width: 500, height: 450 }}
      variant="quilted"
      cols={4}
      rowHeight={121}
    >
      {itemData.map((item) => (
        <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
          <img
            {...srcset(item.img, 121, item.rows, item.cols)}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  }
];