import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";

import Home from "../pages/Home";
import CheckPassword from "../pages/CheckPassword";
import MessagePage from "../components/MessagePage";
import AuthLayout from "../layout";
import ForgotPassword from "../pages/ForgotPassword";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children:[
        {
          path: 'register',
          element: <AuthLayout><RegisterPage/></AuthLayout>
        },
        {
            path: 'email',
            element:   <AuthLayout><CheckEmailPage/></AuthLayout> 
        },
        {
            path: 'password',
            element:  <AuthLayout> <CheckPassword/> </AuthLayout> 
        },
        {
          path: 'forgot-password',
          element: <AuthLayout><ForgotPassword/></AuthLayout>,
        },
        {
            path: '',
            element: <Home/>,
            children: [
                {
                    path: ':userId',
                    element:   <MessagePage/>,
                    
                }
            ]
        }
    ]
  }  

])
export default router