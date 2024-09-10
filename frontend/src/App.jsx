import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import * as sessionActions from './store/session';
import Navigation from "./components/Navigation";
import GetAllSpots from "./components/GetAllSpots";
import SpotDetails from "./components/SpotDetails";
import CreateSpot from "./components/CreateSpot/CreateSpot";



function Layout() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => { setIsLoaded(true) })
  }, [dispatch]);

  return (
    <>
      <Navigation />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {

    element: <Layout />,
    children: [
      {
        path: '/',
        element: <GetAllSpots />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />
      },
      {
        path: '/spots',
        element: <CreateSpot />
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
