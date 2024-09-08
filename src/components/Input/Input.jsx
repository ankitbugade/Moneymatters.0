import React from 'react'
import './Input.css'

function Input({label, state, setState, placeholder,type="text"}) {
  return (
    <div className=''>
      <p className='mt-2 mb-1 text-sm label-input'>{label}</p>
      <input 
      type={type}
      className='custom-input text-sm border-0 border-b-4 pb-0 w-[100%] py-2 px-0  opacity-80 mb-3' 
      placeholder={placeholder}
      value={state} 
      onChange={(e)=>{setState(e.target.value)}}
      />
    </div>
  )
}

export default Input
