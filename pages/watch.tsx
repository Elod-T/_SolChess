import React, { useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import Navbar from "../components/navbar";
import Link from "next/link";

export default function Watch() {
  const [games, setGames] = React.useState([
    {
      id: "",
      state: "",
      fen: "",
      white: "",
      black: "",
      startedAt: "",
      players: [
        {
          id: "",
          name: "",
          wallet: "",
          gameId: "",
        },
      ],
    },
  ]);

  useEffect(() => {
    getGames();
  }, []);
  if (games.length != 0 && games[0].id === "") {
    return <div>Loading...</div>;
  }

  async function getGames() {
    const config = {
      method: "GET",
      url: `${process.env.DOMAIN}/api/getGames`,
    };

    const games = await axios(config);
    setGames(games.data);
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
          <div className="card mockup-window border border-base-300 w-[400px] bg-gray-800 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Games</h2>
              <p>Click the game you want to watch!</p>
              <div className="divider"></div>
              {games.map((game) => (
                <div
                  key={game.id}
                  className="flex justify-between hover:bg-accent hover:text-black p-2 rounded-md"
                >
                  <Link href={"/watch/" + game.id}>
                    {game.players[0].name} vs {game.players[1].name}{" "}
                  </Link>
                  {game.startedAt.slice(11, 19)}
                </div>
              ))}
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
