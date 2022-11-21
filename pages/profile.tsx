import Head from "next/head";
import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import { useUser } from "@thirdweb-dev/react/solana";

export default function Play() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { success } = router.query;
  const [name, setName] = React.useState("");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return router.push("/login");
  }

  async function getUser() {
    const config = {
      method: "GET",
      url: `${process.env.DOMAIN}/api/getUser`,
      params: { address: user!.address },
    };
    const response = await axios(config);
    return response;
  }

  async function saveData() {
    if (name.length < 3) return;

    const userData = (await getUser()).data;

    const url =
      process.env.DOMAIN +
      "/api/" +
      (userData == null ? "createUser" : "updateUser");

    const config = {
      method: "PUT",
      url: url,
      params: { address: user!.address, name: name },
    };

    const response = await axios(config);

    if (response) {
      router.push("/profile?success=true");
    } else {
      router.push("/profile?success=false");
    }
  }

  function getAlertBox() {
    if (success == "true") {
      return (
        <div className="alert alert-success shadow-lg mb-6">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>User data saved successfully!</span>
          </div>
        </div>
      );
    } else if (success == "false") {
      return (
        <div className="alert alert-error shadow-lg mb-6">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error! Couldn't updata user data!</span>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <Head>
        <title>SolChess</title>
        <meta name="description" content="SolChess" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="card w-[600px] mockup-window border border-base-300 bg-gray-800 shadow-xl">
          <div className="card-body">
            {getAlertBox()}
            <table>
              <caption className="card-title">Profile</caption>
              <tbody>
                <tr>
                  <td>Username</td>
                  <td>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>{user?.address}</td>
                </tr>
              </tbody>
            </table>

            <div className="card-actions justify-end mt-8">
              <button className="btn btn-accent" onClick={saveData}>
                Save
              </button>
            </div>
          </div>
        </div>
      </main>

      <img
        className="absolute top-20 left-1/2 -translate-x-1/2 opacity-40 z-0"
        src="/chess.jpg"
        alt="chessboard background image"
      />
    </div>
  );
}
