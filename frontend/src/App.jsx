// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import Navigation from "./components/Navigation/Navigation";
// import * as sessionActions from "./store/session";

// function Layout() {
//   const dispatch = useDispatch();
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     dispatch(sessionActions.restoreUser()).then(() => {
//       setIsLoaded(true);
//     });
//   }, [dispatch]);

//   return (
//     <>
//       <Navigation isLoaded={isLoaded} />
//       {isLoaded && <Outlet />}
//     </>
//   );
// }

// const router = createBrowserRouter([
//   {
//     element: <Layout />,
//     children: [
//       {
//         path: "/",
//         element: <h1>Welcome!</h1>,
//       },
//     ],
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import { restoreUser } from "./store/session";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AllTheSpots from "./components/AllTheSpots/AllTheSpots";
import SpotDetailPage from "./components/SpotDetailPage";
import SpotForm from "./components/SpotsFormPage/SpotForm";
import { getAllSpots } from "./store/spots";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true));
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    path: "/",
    children: [
      {
        index: true,
        element: (
          <main>
            <AllTheSpots isCurrent={false} />
          </main>
        ),
      },
      {
        path: "restaurants/:id",
        element: <SpotDetailPage />,
      },
      {
        path: "restaurants/new",
        element: <SpotForm isNewSpot={true} />,
      },
      {
        path: "restaurants/current",
        element: (
          <>
            <h1>Restaurant Entries</h1>
            <AllTheSpots isCurrent={true} />
          </>
        ),
      },
      {
        path: "restaurants/:id/edit",
        element: <SpotForm isNewSpot={false} />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
