import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { HomeWrapper } from './components/Home/HomeWrapper';
import { Profile } from './components/Profile/Profile';
import { NavBar } from './components/NavBar/NavBar';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { AuthProvider } from './components/Auth/AuthProvider';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MembersList } from './components/Members/MembersList';
import { BillingWrapper } from './components/Billing/BillingWrapper';
import { ScheduleWrapper } from './components/Schedule/ScheduleWrapper';
import { Rooms } from './components/Rooms/Rooms';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavBar />}>
      <Route index element={<HomeWrapper />}/>
      <Route path="profile" element={<Profile />} />
      <Route path="members" element={<MembersList />} />
      <Route path="billing" element={<BillingWrapper />} />
      <Route path="schedule" element={<ScheduleWrapper />} />
      <Route path="rooms" element={<Rooms />}/>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route>
  )
)

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
