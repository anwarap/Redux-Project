import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import {createBrowserRouter,createRoutesFromElements,Route,Routes,RouterProvider} from 'react-router-dom'
import store from './store.js';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import HomeScreens from './screens/HomeScreens.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminHomeScreen from './screens/AdminHomeScreen.jsx';
import AdminLoginScreen from './screens/AdminLoginScreen.jsx'
import UsersListScreen from './screens/UsersListScreen.jsx';
import AdminUserUpdate from './screens/AdminUserUpdate.jsx';
import AdminAddUser from './screens/AdminAddUser.jsx';
import AdminPrivateRoute from './components/AdminPrivateRoute.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index={true} path='/' element={<HomeScreens />}/>
      <Route  path='/login' element={<LoginScreen />}/>
      <Route  path='/register' element={<RegisterScreen/>}/>
      <Route path='' element={<PrivateRoute />}>
      <Route  path='/profile' element={<ProfileScreen/>}/>

      </Route>

      {/* .....Admin Routes.... */}

      <Route path='/admin/login' element={<AdminLoginScreen />} />

      <Route path='' element={<AdminPrivateRoute />}>
        <Route path='/admin' element={<AdminHomeScreen />} />
        <Route path='/admin/users' element={<UsersListScreen />} />
        <Route path='/admin/users/update/:id' element={<AdminUserUpdate />} />
        <Route path='/admin/users/add' element={<AdminAddUser />} />
      </Route>
    



    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>

  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  </Provider>
)
