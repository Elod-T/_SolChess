import Link from "next/link";
import { useUser, useLogout } from "@thirdweb-dev/react/solana";

export default function Navbar() {
  const logout = useLogout();
  const { user } = useUser();

  return (
    <div className="sticky mt-2 mx-auto w-3/4 navbar bg-base-300 rounded-xl z-50 drop-shadow-[0_20px_20px_rgba(150,150,150,0.15)]">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/play">Play</Link>
            </li>
            <li>
              <Link href="/watch">Watch</Link>
            </li>
          </ul>
        </div>
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          SolChess
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link
              className="btn bg-gray-800 text-white px-7 mr-5 opacity-90"
              href="/play"
            >
              Play
            </Link>
          </li>
          <li>
            <Link
              className="btn bg-gray-800 text-white px-7 opacity-90"
              href="/watch"
            >
              Watch
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end p-px">
        {user ? (
          <button className="btn btn-primary" onClick={logout}>
            Log out
          </button>
        ) : (
          <Link className="btn btn-primary" href="/login">
            Login with wallet
          </Link>
        )}
      </div>
    </div>
  );
}
