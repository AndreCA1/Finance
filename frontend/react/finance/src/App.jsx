import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard";
import ProfileSetting from "./pages/ProfileSetting";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./utils/PrivateRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* rota para 404 */}
          <Route path="*" element={<NotFound />} />
          <Route path="/setting" element={<ProfileSetting />} />

          <Route
            path="/dashboard"
            element={
              //            <PrivateRoute>
              <Dashboard />
              //          </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
