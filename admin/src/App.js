import logo from './logo.svg';
import './App.css';
import Sidebar from './components/Sidebar';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom'
import Home from './pages/Home';
import UserManagement from './pages/UserManagement';
import PostContent from './pages/PostContent';
import AdminProfile from './pages/AdminProfile';


function App() {
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<div className='flex'><div className=''><Sidebar/></div><Home/></div>} />
        <Route path='/user-management' element={<><div className='flex'><Sidebar/><UserManagement/></div></>} />
        <Route path='/post-content' element={<><div className='flex'><Sidebar/><PostContent/></div></>} />
        <Route path='/admin-profile' element={<><div className='flex'><Sidebar/><AdminProfile/></div></>} />
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router}/>
   
    
    </>
  )
}

export default App;
