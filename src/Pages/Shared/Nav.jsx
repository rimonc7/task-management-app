import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { AuthContext } from "../../Provider/AuthProvider";

const Nav = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const { user, logOutUser } = useContext(AuthContext);

  const links = (
    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 text-gray-900 uppercase">
      <NavLink to="/" className="py-2 px-4 hover:text-blue-600">
        Home
      </NavLink>
      <NavLink
        to="/add-task"
        className="flex items-center gap-2 py-2 px-4 hover:text-blue-600"
      >
        <FaPlus /> Add Task
      </NavLink>
      <NavLink to="/manage-tasks" className="py-2 px-4 hover:text-blue-600">
        Manage Task
      </NavLink>
    </div>
  );

  return (
    <nav className="fixed w-full z-20 bg-blue-300 bg-opacity-90 text-gray-900 shadow-md px-4 lg:px-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <div className="flex items-center">
          <a href="/" className="text-xl font-bold uppercase tracking-wide">
            Task Manager
          </a>
        </div>

        <div className="hidden lg:flex">{links}</div>
        <div className="flex items-center space-x-4">
          {user ? (
            <button
              onClick={logOutUser}
              className="hidden lg:block btn btn-sm border-gray-700 text-gray-900 hover:bg-blue-400"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="hidden lg:flex btn btn-sm border-gray-700 text-gray-900 hover:bg-blue-400"
            >
              Login
            </NavLink>
          )}

          {/* User Profile */}
          {user ? (
            <img
              className="w-10 h-10 rounded-full border-2 border-gray-300"
              src={user.photoURL}
              alt=""
              title={user.displayName || "User"}
            />
          ) : (
            <FaUserCircle
              className="text-4xl text-gray-700"
              title="Guest User"
            />
          )}
          <button
            onClick={() => setDarkTheme(!darkTheme)}
            className={`flex items-center justify-center p-1 rounded-full border-2 border-gray-300 transition-all duration-300 ${
              darkTheme ? "bg-yellow-500 text-black " : "bg-gray-800 text-white"
            } hover:bg-gray-600`}
          >
            {darkTheme ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
          </button>

          {/* Mobile Menu (Dropdown) */}
          <div className="lg:hidden">
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </button>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 w-48 bg-blue-400 text-white rounded-box shadow-lg"
              >
                {links}
                {user ? (
                  <li>
                    <button
                      onClick={logOutUser}
                      className="w-full py-2 px-4 text-left hover:bg-blue-500"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <li>
                    <NavLink
                      to="/login"
                      className="w-full py-2 px-4 text-left hover:bg-blue-500"
                    >
                      Login
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
