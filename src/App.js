import './App.css';
import {BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import React, {useState } from "react";
import {signOut} from 'firebase/auth';
import {auth} from './firebase-config'

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear()
      setIsAuth(false)
      window.location.pathname = "/login";
    });
  };

  return (
    <Router>
      <nav>
        <Link to='/'>Home </Link>
        {!isAuth ? (<Link to='/login'>Login  </Link> ):( <>  
        <Link to='/createpost'>New Post </Link>
        <button onClick={signUserOut}>Log Out</button>
        </>
      )}

      </nav>
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />}/>  {/*element is whats gonna render when we go into this route*/}
        <Route path="/login" element={<Login setIsAuth={setIsAuth } />}/>  
        <Route path="/createpost" element={<CreatePost isAuth={isAuth}/>}/>  
      </Routes>

    </Router>
    
    

  );
}

export default App;