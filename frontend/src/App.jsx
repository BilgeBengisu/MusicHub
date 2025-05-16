import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import {Login} from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import Navbar from "./components/Navbar";
import { PostsProvider } from "./components/PostsContext";

function App() {
  return (
    <BrowserRouter>
      <PostsProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/create" element={<CreatePost />} />
        </Routes>
      </PostsProvider>
    </BrowserRouter>
  );
}

export default App;
