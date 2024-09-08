import React, { useState } from 'react'
import {  createUserWithEmailAndPassword, signInWithEmailAndPassword , signInWithPopup,GoogleAuthProvider} from "firebase/auth";
import {auth, doc, setDoc, getDoc, db, provider} from"../../firebase"
import './SignupSignIn.css'
import Input from '../Input/Input'
import Button from '../Button/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";


function SignupSignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading,setLoading] = useState(false);
  const navigate =  useNavigate();

  function SignupWithEmail(){
    setLoading(true);
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    
    if(name != "" && email!="" && password!="" && confirmPassword!="" )
    {
      if(password === confirmPassword){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          console.log("User",user)
          toast.success("User Created");
          setLoading(false);
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          createDoc(user);
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
      }
      else
      {
        toast.error("Password and Confirm Password don't match!");
        setLoading(false);
      }
    }
    else
    {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  function loginWithEmail(){
    setLoading(true);

    if(email!="" && password!=""){
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        toast.success("Login successful");
        setEmail("");
        setPassword("");
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(error.message);
        setLoading(false);
      });
    }
    else
    {
      toast.error("All fields are mandatory");
      setLoading(false);
    }
    
  }

  async function createDoc(user){
    setLoading(true);
    if (!user) return;

    const userRef = doc(db,"users",user.uid);
    const userData = await getDoc(userRef);

    if(!userData.exists()){
      try {
        await setDoc(doc(db,"users",user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL : user.photoURL ? user.photoURL : "",
          createdAt : new Date()
        });
        toast.success("Doc created");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);

      }
    }else{
      toast.error("Doc already exists");
      setLoading(false);

    }
  }

  function googleAuth(){
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("user>>",user);
        createDoc(user);
        setLoading(false);
        navigate("/dashboard");
        toast.success("User Authenticated!");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    } catch (error) {
      toast.error(error.message);
    }
   
  }


  return (
    <>
    {loginForm ? 
    <div className='signup-wrapper '>
    <h2 className='text-[1.2rem] font-[500] text-center '>
      Log In <span className='hover:font-semibold cursor-pointer' style={{color : "var(--theme)"}}>Moneymatters</span>
      </h2>
      <form>
        <Input 
        type="email"
        label={"Email Id"} 
        state={email} 
        setState={setEmail} 
        placeholder={"johnstorm@gmail.com"}
        />

        <Input 
        label={"Password"} 
        state={password} 
        setState={setPassword} 
        placeholder={"John@321"}
        type="password"
        />

        <Button 
          disabled={loading} 
          text={loading ? "Loading..." :"Login using email and password"} 
          onClick={loginWithEmail}
        />

        <p className='text-sm text-center'> OR </p>

        <Button  
          onClick={googleAuth} 
          text={loading? "Loading...":"Login using Google"} 
          blue={true}
        />
        
        <p className='text-sm text-center'>Don't have an an account? <a onClick={()=>{setLoginForm(false)}} className='text-sm text-center cursor-pointer text-blue-800'>Click here</a></p>
      </form>
  </div>
    : 
    <div className='signup-wrapper '>
        <h2 className='text-[1.2rem] font-[500] text-center '>
          Sign Up on <span className='hover:font-semibold cursor-pointer' style={{color : "var(--theme)"}}>Moneymatters</span>
          </h2>
          <form>
            <Input 
            label={"Full Name"} 
            state={name} 
            setState={setName} 
            placeholder={"John Storm"}
            />

            <Input 
            type="email"
            label={"Email Id"} 
            state={email} 
            setState={setEmail} 
            placeholder={"johnstorm@gmail.com"}
            />

            <Input 
            label={"Password"} 
            state={password} 
            setState={setPassword} 
            placeholder={"John@321"}
            type="password"
            />

            <Input 
            label={"Confirm Password"} 
            state={confirmPassword} 
            setState={setConfirmPassword} 
            placeholder={"John@321"}
            type="password"
            />

            <Button 
              disabled={loading} 
              text={loading ? "Loading..." :"Sign Up using email and password"} 
              onClick={SignupWithEmail}/>

            <p className='text-sm text-center'> OR </p>

            <Button
              onClick={googleAuth} 
              text={loading? "Loading...":"Sign Up using Google"}
              blue={true} />
            <p className='text-sm text-center m-0'>Already have an an account? <a onClick={()=>{setLoginForm(true)}} className='text-sm text-center cursor-pointer text-blue-800'>Click here</a></p>

          </form>
      </div> }
      
    </>
  )
}

export default SignupSignIn
