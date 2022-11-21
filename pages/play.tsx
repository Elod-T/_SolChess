import React, { useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useRouter } from "next/router";
import { useUser } from "@thirdweb-dev/react/solana";
import Head from "next/head";
import Navbar from "../components/navbar";

const socket = io(process.env.SOCKETIO_SERVER || "http://152.70.185.148:3001");

export default function Play() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [inQueue, setInQueue] = React.useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    const config = {
      method: "GET",
      url: `${process.env.DOMAIN}/api/getCurrentUser`,
    };

    axios(config)
      .then((response) => {
        if (response.data.gameId) {
          listenForRedirect(response.data.gameId);
          setInQueue(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return router.push("/login");
  }

  async function joinQueue() {
    let config = {
      method: "POST",
      url: "/api/joinGame",
    };

    axios(config)
      .then((response) => {
        socket.emit("join", response.data.id);
        socket.emit("update", response.data.id);
        socket.emit("leave", response.data.id);
        router.push(`/play/${response.data.id}`);
      })
      .catch((error) => {
        if (error.response.data.message == "No games available.") {
          config = {
            method: "POST",
            url: "/api/createGame",
          };

          axios(config)
            .then((response) => {
              if (response.status === 200) {
                listenForRedirect(response.data.id);
              }
            })
            .catch();
        }
      });

    setInQueue(true);
  }

  function listenForRedirect(gameId: string) {
    socket.emit("join", gameId);
    socket.on("update", () => {
      socket.emit("leave", gameId);
      router.push(`/play/${gameId}`);
    });
  }

  async function leaveQueue() {
    let config = {
      method: "DELETE",
      url: "/api/endGame",
    };

    await axios(config);
    setInQueue(false);
    socket.emit("leave", "all");
  }

  return (
    <div>
      <Head>
        <title>SolChess</title>
        <meta name="description" content="SolChess" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="z-10">
        <main className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="card mockup-window border border-base-300 w-96 bg-gray-800 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Play</h2>
              <p>Click the button below to join the queue</p>
              <div className="card-actions justify-end mt-4">
                {inQueue ? (
                  <button className="btn btn-error" onClick={leaveQueue}>
                    Leave queue
                  </button>
                ) : (
                  <button className="btn btn-accent" onClick={joinQueue}>
                    Play
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <img
        className="absolute top-20 left-1/2 -translate-x-1/2 opacity-40 z-0"
        src="/chess.jpg"
        alt="chessboard background image"
      />
    </div>
  );
}
