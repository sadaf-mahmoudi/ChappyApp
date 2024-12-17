import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // Adjust the path if necessary

const Root = () => (
  <section>
    <Navbar />
    <Outlet />
  </section>
);

export default Root;