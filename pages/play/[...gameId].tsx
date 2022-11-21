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
  const [userData, setUserData] = React.useState({
    id: "",
    name: "",
    wallet: "",
    gameId: "",
  });
  const [opponentData, setOpponentData] = React.useState({
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
  const [color, setColor] = React.useState("");

  useEffect(() => {
    const gId = window.location.pathname.split("/")[2];
    setGameId(gId);

    fetchData();

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

  if (isLoading || color == "" || gameId == "") {
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
    const winner = game.turn() != color[0];

    const config = {
      method: "DELETE",
      url: `${process.env.DOMAIN}/api/endGame`,
    };
    await axios(config).catch((error) => {
      console.log(error);
    });

    router.push(`/gameover?winner=${winner}`);
  }

  async function fetchData() {
    let config: any = {
      method: "GET",
      url: `${process.env.DOMAIN}/api/getCurrentUser`,
    };

    const uData: any = await axios(config).catch(() => {
      router.push("/login");
    });
    setUserData(uData.data);

    config = {
      method: "GET",
      url: `${process.env.DOMAIN}/api/getCurrentGame`,
    };

    const gData: any = await axios(config).catch(() => {
      router.push("/login");
    });
    if (gData == undefined || gData.data == null) {
      router.push("/gameover?winner=false");
      return;
    }
    setGameData(gData.data);
    setGame(new Chess(gData.data.fen));

    if (gData.data.black === uData.data.id) {
      setColor("black");
    } else {
      setColor("white");
    }

    config = {
      method: "GET",
      url: `${process.env.DOMAIN}/api/getUser`,
      params: {
        id:
          gData.data.black === uData.data.id
            ? gData.data.white
            : gData.data.black,
      },
    };

    const oData = await axios(config);
    setOpponentData(oData.data);
  }

  async function movePiece(fen: string) {
    const config = {
      method: "POST",
      url: `${process.env.DOMAIN}/api/move`,
      params: {
        gameId: gameId,
        fen: fen,
      },
    };

    const response = await axios(config);
    setGameData(response.data);
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // TODO allow user to choose
    });

    if (move === null) return false;

    setGame(new Chess(game.fen())); // seems pointless but this way the chessboard gets re-rendered with the new position
    movePiece(game.fen());

    socket.emit("update", gameId);

    return true;
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
            <span className="font-bold">{opponentData.name}</span>
            {game.turn() != color[0] && "'s turn"}
          </div>
          <div className="text-sm invisible lg:visible w-min">
            {opponentData.wallet}
          </div>
        </div>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={chessboardWidth}
          arePiecesDraggable={color[0] == game.fen().split(" ")[1]}
          boardOrientation={color as "white" | "black"}
        />
        <div className="bg-purple-600 bg-opacity-50 rounded-b-md p-4">
          <div className="text-sm invisible lg:visible w-min">
            {userData.wallet}
          </div>
          <div className="text-2xl font-bold">{userData.name}</div>
        </div>
        {gameData.startedAt}
      </main>
    </div>
  );
}
