import './App.css'
import Header from './components/Header/Header'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import {BrowserRouter , Route, Routes} from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';


function App() {

  return (
    <>
    <ToastContainer/>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
