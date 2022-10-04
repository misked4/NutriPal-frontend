import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, Typography, CardActions, Checkbox, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import LocalDiningOutlinedIcon from '@mui/icons-material/LocalDiningOutlined';
import { increaseLikes, decreaseLikes, searchIfLiked } from './APIcomms';

const Post = React.forwardRef(({post}, ref) => {
    const { user } = useSelector((state) => state.auth);

    const [postIsLiked, setPostIsLiked] = useState(false);
    const [numbersOfLikes, setNumbersOfLikes] = useState(post.Broj_lajkova);
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
            searchIfLiked(post.id, user[0].id)
                .then(data=>{
                    setPostIsLiked(true);
                })
                .catch(e=>{
                    setPostIsLiked(false);
                });
      },[]);
    
    const postBody = (
        <>
            <Card sx={{margin:5}}>
                <CardHeader
                    avatar={
                    <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                        R
                    </Avatar>
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
                        sx={{ width: 151, m:1.5, borderRadius: "4px" }}
                        image="data:image/jpeg;base64,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"
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