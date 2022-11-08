import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { hideRightBar, unhiddenRightBar } from './redux/rightbar/actions';

export const useCloseRightbar = () => {
  const dispatch = useDispatch();
    setTimeout(function(){
      dispatch(hideRightBar());
    }, 1200);
    var element = document.getElementById('swingRight');
    if (element && element.classList.contains('slide-in-right')) {
      element.classList.remove('slide-in-right');      
      element.classList.add('slide-out-right');
    }
}

export const useOpenRightbar = () => {
  const dispatch = useDispatch();
  setTimeout(function(){
    dispatch(unhiddenRightBar());
  }, 1200);
}

export function changeHeightVmax() {
    document.getElementsByClassName("myDiv")[0].style.height = "100vmax";
    window.scrollTo(0, 0);
  }

export  function changeHeightToPercentage() {
    document.getElementsByClassName("myDiv")[0].style.height = "100%";
    window.scrollTo(0, 0);
}