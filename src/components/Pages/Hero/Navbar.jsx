import React from "react";
import "./Navbar.css";
import { FaDumbbell } from "react-icons/fa"; // Correct import of the icon
import { NavbarMenu } from "../../NavbarData/data"; // Ensure this is correctly defined and imported
import { MdMenu } from "react-icons/md";
import ResponsiveMenu from "./ResponsiveMenu";
import logo from "../../../assets/logo.png";

function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <nav className=" text-white">
      <div className="container flex justify-between items-center py-4 px-6">
        {/* Logo section */}
        <div className="text-2xl flex items-center gap-2 font-bold uppercase">
          <img src={logo} className="w-36"/>
        </div>
        {/* Menu section */}
        <div className="hidden md:flex items-center gap-8 ml-[190px]">
          <ul className="flex items-center gap-8">
            {NavbarMenu.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  className="text-white font-secondary hover:text-third font-regular text-lg"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Login/Signup section */}
        <div className="hidden md:flex items-center gap-4">
        <button className="text-primary border border-primary  hover:bg-third hover:text-white font-semibold py-1 px-11 rounded">
            Login
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
          Get started for free
          </button>
        </div>
        {/* Mobile responsive section */}
        <div className="md:hidden" onClick={() => setOpen(!open)}>
          <MdMenu className="text-3xl text-white" />
        </div>
        {/* Mobile sidebar section */}
        {open && <ResponsiveMenu open={open} />}
      </div>
    </nav>
  );
}

export default Navbar;
