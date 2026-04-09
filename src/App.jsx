import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./Layout";
import Homepage from "./features/pages/Home/Homepage";
import ListofRoom from "./features/pages/RoomList/ListofRoom";
import RoomDetail from "./features/pages/RoomDetail/RoomDetail";
import LandlordProfile from "./features/pages/Landlord/LandlordProfile";
import GuestaProfile from "./features/pages/Guest/GuestsProfile";
import LandlordCrud from "./features/pages/Landlord/LandlordCrud";

import AigeneratedDes from "./features/pages/Landlord/AigeneratedDes";
import StayEasyRoom from "./features/pages/RoomList/StayEasyRoom";
import Profile from "./features/pages/Guest/Profile";
import MyRooms from "./features/pages/Landlord/Myrooms";
import SavedListings from "./features/pages/Landlord/SavedListings";
import CreateRoom from "./features/pages/Guest/CreateRoom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/listings", element: <ListofRoom /> },
      {
        path: "/account",
        element: <Profile />,
        children: [
          { index: true, element: <SavedListings /> }, // /account
          { path: "saved", element: <SavedListings /> }, // /account/saved  👈 add this back
          { path: "rooms", element: <MyRooms /> }, // /account/rooms
        ],
      },
      { path: "/guest", element: <GuestaProfile /> },
      { path: "/createRoom", element: <CreateRoom /> },
      // { path: "/c", element: <LandlordProfile /> },
      { path: "/listingDetail", element: <RoomDetail /> },
      { path: "/roomdetail", element: <StayEasyRoom /> },
      { path: "/landlordCrud", element: <LandlordCrud /> },
      { path: "/generatedPage", element: <AigeneratedDes /> },
    ],
  },
  // { path: "/login", element: <Login /> },
  // { path: "/signup", element: <Signup /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
