import React, { useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import Head from "next/head";
import Navbar from "../../components/navbar";
import { Chess } from "chess.ts";
import { Chessboard } from "react-chessboard";
import { useRouter } from "next/router";
import { useUser } from "@thirdweb-dev/react/solana";

const socket = io(process.env.SOCKETIO_SERVER || "http://localhost:3001");

export default function Play() {
  const router = useRouter();

  const [chessboardWidth, setChessboardWidth] = React.useState(600);

  const { user, isLoading } = useUser();
  const [whiteData, setWhiteData] = React.useState({
    id: "",
    name: "",
    wallet: "",
    gameId: "",
  });
  const [blackData, setBlackData] = React.useState({
    id: "",
    name: "",
    wallet: "",
    gameId: "",
  });

  const [gameId, setGameId] = React.useState("");
  const [gameData, setGameData] = React.useState({
    id: "",
    startedAt: "",
    state: "",
    fen: "",
    white: "",
    black: "",
  });
  const [game, setGame] = React.useState(new Chess());

  useEffect(() => {
    const gId = window.location.pathname.split("/")[2];
    setGameId(gId);

    fetchData(gId);

    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.emit("join", gId);

    socket.on("update", () => {
      fetchData();
    });

    setChessboardWidth(window.innerWidth * 0.4);
    window.addEventListener("resize", () => {
      handleResize();
    });

    return () => {
      window.removeEventListener("resize", () => {
        handleResize();
      });
      socket.emit("leave", gId);
    };
  }, []);

  if (isLoading || gameId == "") {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push("/login");
  }

  if (game.gameOver()) {
    endGame();
  }

  function handleResize() {
    setChessboardWidth(window.innerWidth * 0.4);
  }

  async function endGame() {
    router.push("/watch");
  }

  async function fetchData(gId?: string) {
    let config = {
      method: "GET",
      url: `${process.env.DOMAIN}/api/getGame`,
      params: {
        id: gameId || gId,
      },
    };

    const response = await axios(config);

    setGameData(response.data);
    setGame(new Chess(response.data.fen));
    console.log(game);

    config = {
      method: "GET",
      url: `${process.env.DOMAIN}/api/getUser`,
      params: {
        id: response.data.white,
      },
    };

    const white = await axios(config);
    setWhiteData(white.data);

    config = {
      method: "GET",
      url: `${process.env.DOMAIN}/api/getUser`,
      params: {
        id: response.data.black,
      },
    };

    const black = await axios(config);
    setBlackData(black.data);
  }

  return (
    <div>
      <Head>
        <title>SolChess</title>
        <meta name="description" content="SolChess" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <main className="mt-10 grid place-content-center">
        <div className="bg-purple-600 bg-opacity-50 rounded-t-md p-4">
          <div className="text-2xl">
            <span className="font-bold">{blackData.name}</span>
            {game.turn() == "b" && "'s turn"}
          </div>
          <div className="text-sm invisible lg:visible w-min">
            {blackData.wallet}
          </div>
        </div>
        <Chessboard
          position={game.fen()}
          boardWidth={chessboardWidth}
          arePiecesDraggable={false}
        />
        <div className="bg-purple-600 bg-opacity-50 rounded-b-md p-4">
          <div className="text-sm invisible lg:visible w-min">
            {whiteData.wallet}
          </div>
          <div className="text-2xl">
            <span className="font-bold">{whiteData.name}</span>
            {game.turn() == "w" && "'s turn"}
          </div>
        </div>
        {gameData.startedAt}
      </main>
    </div>
  );
}
