import React, { useEffect } from 'react';
import './Header.css';
import {auth} from '../../firebase';
import {useAuthState} from "react-firebase-hooks/auth";
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import userImg from '../../assets/userImg.svg'


function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(()=>{
    if(user){
      navigate("/dashboard");
    }
  },[user,loading]);

  function logoutFnc(){
    try {
      signOut(auth).then(() => {
        toast.success("Logout successful!");
        navigate("/");
        // Sign-out successful.
      }).catch((error) => {
        toast.error(error.message);
        // An error happened.
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='navbar'>
      <p className='navbar-heading'>moneymatters</p>
      {user && (
        <div style={{display:"flex", alignItems:"center", gap:"0.75rem"}}>
          <img 
          src={user.photoURL ? user.photoURL : userImg}
           
          style={{borderRadius:"50%", height:"1.5rem", 
            width:"1.5rem"}}/>
        <p onClick={logoutFnc} className=' navbar-heading link ' >
          Logout
        </p>
      </div>
      )
      }
      
    </div>
  )
}

export default Header
