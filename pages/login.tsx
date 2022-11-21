import Head from "next/head";
import dynamic from "next/dynamic";
import Navbar from "../components/navbar";
import { useLogin } from "@thirdweb-dev/react/solana";
require("@solana/wallet-adapter-react-ui/styles.css");

const ConnectButton = dynamic(() => import("../components/connectButton"), {
  ssr: false,
});

export default function Login() {
  const login = useLogin();

  return (
    <div>
      <Head>
        <title>SolChess</title>
        <meta name="description" content="SolChess" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <main className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="card mockup-window border border-base-300 w-96 bg-gray-800 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Login</h2>
            <p>
              You need to first connect your wallet, then sign a challenge for a
              secure login!
            </p>
            <div className="card-actions justify-center mt-2">
              <ConnectButton />
              <button className="btn btn-accent" onClick={() => login()}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </main>

      <img
        className="absolute top-20 left-1/2 -translate-x-1/2 opacity-40 z-0"
        src="/chess.jpg"
        alt=""
      />
    </div>
  );
}
