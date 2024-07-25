import React,{Suspense, lazy} from 'react'
import { Routes, Route } from "react-router-dom"


// import EntryPage from './Pages/EntryPage/EntryPage'
// import BuyPage from './Pages/BuyPage/BuyPage'
// import Feed from './Pages/Feed/Feed'
// import Login from './Pages/LoginPage/Login';
// import ParticipantRanking from './Pages/ParticipantRanking/ParticipantRanking'
// import UserPortfolio from './Pages/UserPortfolio/UserPortfolio'
// import Portfolio from './Pages/Portfolios/Portfolio'
// import UserProfile from './Pages/UserProfile/UserProfile'
// import AudienceRanking from './Pages/AudienceRanking/AudienceRanking'
import Loader from './Pages/Loader/Loader'

// lazy loading 
const EntryPage = lazy(() => import('./Pages/EntryPage/EntryPage'))
const BuyPage = lazy(() => import('./Pages/BuyPage/BuyPage'))
const Feed = lazy(() => import('./Pages/Feed/Feed'))
const Login = lazy(() => import('./Pages/LoginPage/Login'))
const ParticipantRanking = lazy(() => import('./Pages/ParticipantRanking/ParticipantRanking'));
const UserPortfolio = lazy(() => import('./Pages/UserPortfolio/UserPortfolio'));
const Portfolio = lazy(() => import('./Pages/Portfolios/Portfolio'));
const UserProfile = lazy(() => import('./Pages/UserProfile/UserProfile'));
const AudienceRanking = lazy(() => import('./Pages/AudienceRanking/AudienceRanking'));

const AllRoutes = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/Buy/:id" element={<BuyPage />} />
        <Route path="/Feed" element={<Feed />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ParticipantRanking" element={<ParticipantRanking />} />
        <Route path="/Portfolio" element={<Portfolio />} />
        <Route path="/UserPortfolio" element={<UserPortfolio />}  ></Route>
        <Route path='/UserProfile' element = {<UserProfile />} />  
        <Route path='/AudienceRanking' element = {<AudienceRanking />} /> 
        </Routes>
        </Suspense>
    </>
  )
}

export default AllRoutes;