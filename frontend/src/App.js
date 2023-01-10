import { BrowserRouter, Routes, Route } from "react-router-dom"
import AddUser from "./components/adduser";
// import GetAllUsers from "./component/getAllUsers";
// import EditUser from "./component/editUser";
import Navbar from "./components/navbar";
import './App.css';


function App() {
  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<AddUser />} />
          <Route path="/register" element={<AddUser />} />
          {/* <Route path="/allusers" element={<GetAllUsers />} /> */}
          {/* <Route path="/edituser/:customId" element={<EditUser />} /> */}
        </Routes>
      </BrowserRouter>
  );
}

export default App;
