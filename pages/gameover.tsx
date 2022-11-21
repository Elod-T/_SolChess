import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../components/navbar";

export default function GameOver() {
  const router = useRouter();
  const [winner, setWinner] = React.useState(false);

  useEffect(() => {
    const win = new URLSearchParams(window.location.search).get("winner");
    if (win == "true") {
      setWinner(true);
    }
  }, []);

  return (
    <div>
      <Head>
        <title>SolChess</title>
        <meta name="description" content="SolChess" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="relative lg:mt-[200px] md:mt-32 mt-20 z-10 h-full">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-7xl font-bold">You {winner ? "won" : "lost"}!</h1>
          <button
            className="btn btn-primary mt-10 text-md"
            onClick={() => {
              router.push("/play");
            }}
          >
            Go next
          </button>
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
