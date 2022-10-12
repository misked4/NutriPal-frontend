import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, Typography, CardActions, Checkbox, Box, Chip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import LocalDiningOutlinedIcon from '@mui/icons-material/LocalDiningOutlined';
import { increaseLikes, decreaseLikes, searchIfLiked, getRecipeWithHisGroceries } from './APIcomms';
import './Post.css'
const numberToDisplay = 4;
const Post = React.forwardRef(({post}, ref) => {
    const { user } = useSelector((state) => state.auth);

    const [postIsLiked, setPostIsLiked] = useState(false);
    const [numbersOfLikes, setNumbersOfLikes] = useState(post.Broj_lajkova);
    const [groceriesForRecipe, setGroceriesForRecipe] = useState([]);
    const [numbersOfGroceriesToDisplay, setNumbersOfGroceriesToDisplay] = useState(numberToDisplay);

    let dateFromSql = sqlToJsDate(post.Datum).toGMTString().replace('GMT', '');
    let NameAndSurname = post.Ime + " " + post.Prezime;
    
    //u useeffect ovde ispitati kroz listu svojih lajkova da li smo lajkovali
    const likePost = () => {
        console.log(postIsLiked);
        if(postIsLiked === false)
        {
            console.log("INCREASE" + postIsLiked);
            increaseLikes(post.id, user[0].id)
            .then(data=>{
                setPostIsLiked(true);
                setNumbersOfLikes(numbersOfLikes + 1);
            })
            .catch(e=>console.log(e));
        }
        else{
            console.log("DECREASE " +postIsLiked );
            decreaseLikes(post.id, user[0].id)
            .then(data=>{
                setPostIsLiked(false);                
                setNumbersOfLikes(numbersOfLikes - 1);
            })
            .catch(e=>console.log(e));
        }
    }

    useEffect(()=>{
        getRecipeWithHisGroceries(post.id)
            .then(result=>setGroceriesForRecipe(result))
            .catch(e=>console.log(e));
        searchIfLiked(post.id, user[0].id)
            .then(data=>{
                setPostIsLiked(true);
            })
            .catch(e=>{
                setPostIsLiked(false);
            });
      },[]);
    
    const generateLabelName = (grocery) => {
        var name = "";
        if(grocery.Naziv.length >= 40)
            name = grocery.Naziv.slice(0, 40) + "...";
        else name = grocery.Naziv.slice(0, 40) + " - ";
        return name + "[" + grocery.Kolicina*100 + "gr" + "]";
    }

    const postBody = (
        <>
            <Card sx={{margin:5}} className="scale-in-center">
                <CardHeader
                    avatar={
                    <Avatar aria-label="recipe" src={post.KorisnikSlika}/>
                    }
                    action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon/>
                    </IconButton>
                    }
                    title={NameAndSurname}
                    subheader={dateFromSql}
                />
                <Box sx={{ display: 'flex' }}>
                    <CardMedia
                        component="img"
                        sx={{ height: 140, width: 151, m:1.5, borderRadius: "4px" }}
                        src={post.ReceptSlika}
                        alt={post.Naslov}
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.primary">
                        {post.Naslov}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        {post.Opis} + {post.id}
                        </Typography>
                    </CardContent>
                </Box>
                <CardActions>
                <Box>
                  {groceriesForRecipe.map(x=>
                    <Chip label={generateLabelName(x)} sx={{m:0.5}} variant="outlined" color="primary" avatar={<Avatar src={x.Slika} alt="Nemamo sliku :(" />} />
                  ).slice(0,numbersOfGroceriesToDisplay)}
                  {((groceriesForRecipe.length - numbersOfGroceriesToDisplay)>0)? 
                    <IconButton aria-label="add to favorites" onClick={()=>setNumbersOfGroceriesToDisplay(groceriesForRecipe.length)}>
                        <Chip label={"+" + (groceriesForRecipe.length - numberToDisplay)} sx={{m:0.5}} variant="outlined" color="primary"/>
                    </IconButton> :
                    (groceriesForRecipe.length - numberToDisplay) > 0 ?
                    <IconButton aria-label="add to favorites" onClick={()=>setNumbersOfGroceriesToDisplay(numberToDisplay)}>
                        <Chip label={"Sakrij"} sx={{m:0.5}} variant="outlined" color="primary"/>
                    </IconButton> : <Box></Box>
                  }
                </Box>
                </CardActions>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <Checkbox onChange={likePost} icon={<FavoriteBorderIcon />} checked={postIsLiked} checkedIcon={<FavoriteIcon sx={{color: "red"}}/>} />
                        <Typography>{numbersOfLikes}</Typography>
                    </IconButton>
                    <IconButton aria-label="add to favorites">
                        <Checkbox icon={<AlarmOnIcon />} />
                        <Typography>{post.Minutaza} min</Typography>
                    </IconButton>
                    <IconButton aria-label="add to favorites">
                        <Checkbox icon={<LocalDiningOutlinedIcon />} />
                        <Typography>Broj porcija {post.Broj_porcija}</Typography>
                    </IconButton>
                </CardActions>
            </Card>
        </>
    )

    const content = ref ? <article ref={ref}>{postBody}</article> : <article>{postBody}</article>
    return content
})

function sqlToJsDate(sqlDate){
    //sqlDate in SQL DATETIME format ("yyyy-mm-ddThh:mm:ss.msZ")
    var sqlDateArr1 = sqlDate.split("-");
    //format of sqlDateArr1[] = ['yyyy','mm','ddThh:mm:msZ']
    var sYear = sqlDateArr1[0];
    var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
    var sqlDateArr2 = sqlDateArr1[2].split("T");
    //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.msZ']
    var sDay = sqlDateArr2[0];
    var sqlDateArr3 = sqlDateArr2[1].split(":");
    //format of sqlDateArr3[] = ['hh','mm','ss.msZ']
    var sHour = sqlDateArr3[0];
    var sMinute = sqlDateArr3[1];
    var sqlDateArr4 = sqlDateArr3[2].split(".");
    //format of sqlDateArr4[] = ['ss','msZ']
    var sSecond = sqlDateArr4[0];
     
    return new Date(sYear,sMonth,sDay,sHour,sMinute,sSecond);
}

export default Post;