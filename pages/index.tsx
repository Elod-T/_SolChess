import Head from "next/head";
import { useEffect } from "react";
import Navbar from "../components/navbar";

const content = [
  {
    title: "What is SolChess?",
    content:
      "SolChess is a chess game built on the Solana blockchain. Players can play against each other in real time.",
    image: "fingerprint.jpg",
  },
  {
    title: "How does it work?",
    content:
      "You can use your own crypto wallet to log into the app. You can then play against other players in real time using websocket P2P connection.",
    image: "chess.jpg",
  },
  {
    title: "How do I get started?",
    content: `You need a 
              <a id="phantomwallet" href="https://phantom.app">
                Phantom wallet
              </a> wallet to play the game. You can get one by clicking the link above."`,
    image: "wallet.jpg",
  },
  {
    title: "Why SolChess?",
    content:
      "Solana is a blockchain that is fast, secure, and scalable. It is the perfect blockchain for a chess game. SolChess is the first chess game built on the Solana blockchain.",
    image: "solana.png",
  },
];

export default function Home() {
  useEffect(() => {
    // style doesn'get added with dangerouslySetInnerHTML
    const phantomwallet = document.getElementById("phantomwallet");

    phantomwallet?.classList.add("text-purple-400");
  }, []);

  function scrollToInformation() {
    const element = document.getElementById("information");

    if (!element) return;

    element.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div>
      <Head>
        <title>SolChess</title>
        <meta name="description" content="SolChess" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="z-10">
        <div className="relative lg:mt-[200px] md:mt-32 mt-20 z-10 h-full">
          <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
            <h1 className="text-7xl font-bold">
              Play the{" "}
              <span className="bg-gradient-to-r from-purple-400 via-purple-800 to-purple-400 gradient font-black text-8xl">
                future
              </span>{" "}
              of chess!
            </h1>
            <p className="mt-3 text-2xl">Powered by the Solana blockchain</p>
            <button
              className="btn btn-primary mt-10 text-md"
              onClick={scrollToInformation}
            >
              Learn More ...
            </button>
          </div>
        </div>

        <div className="absolute top-0 w-full h-full bg-center z-0">
          <img
            src="/chess.jpg"
            alt="Chess"
            className="w-full h-full opacity-25 object-cover"
          />
        </div>

        <div
          id="information"
          className="relative mt-96 mb-40 w-[40%] mx-auto z-10"
        >
          {content.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-2 grid-rows-2 bg-gray-900 pl-4 p-px rounded-lg mt-10"
            >
              <div className="text-3xl font-bold mt-4">{item.title}</div>
              <img
                src={item.image}
                alt="fingerprint"
                className="row-span-2 object-fill w-full h-full invisible lg:visible"
              />
              <div
                className="mb-2"
                dangerouslySetInnerHTML={{
                  __html: item.content,
                }}
              ></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
