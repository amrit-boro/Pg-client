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
      { path: "/room", element: <ListofRoom /> },
      { path: "/guest", element: <GuestaProfile /> },
      { path: "/c", element: <LandlordProfile /> },
      { path: "/pgDetail", element: <RoomDetail /> },
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
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}
