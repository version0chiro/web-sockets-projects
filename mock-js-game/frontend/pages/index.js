import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";

export default function Home() {
  const [arenas, setArenas] = useState([]);

  const [socket, setSocket] = useState(null);

  const [currentArena, setCurrentArena] = useState(null);

  const [activePlayers, setActivePlayers] = useState([]);

  const [attacks, setAttacks] = useState([]);

  const [status, setStatus] = useState("not-started");

  // const connectToSocket = () => {
  //   socket = io("http://localhost:5000");

  //   socket.on("arenas", (data) => {
  //     setArenas(data.arenas);
  //   });
  // };

  useEffect(() => {
    const newSocket = io("http://localhost:5000");

    setSocket(newSocket);

    newSocket.on("arenas", (data) => {
      setArenas(data.arenas);
    });

    newSocket.on("joined", (data) => {
      setCurrentArena(data.arenaName);
      setActivePlayers(data.players);
      setAttacks(data.attacks);
      setStatus(data.status);

      console.log("joined", data);
    });

    newSocket.on("attack", (data) => {
      console.log("attack", data);
      setActivePlayers(data.activePlayers);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Battle Arena</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {status === "not-started" ? (
          <h1 className={styles.title}>All the arenas</h1>
        ) : (
          <>
            <h1 className={styles.title}>{currentArena}</h1>
            <h3>
              Status:
              {status === "ready" ? "started" : "waiting"}
            </h3>
          </>
        )}

        {/* <button onClick={connectToSocket}>Connect to socket</button> */}

        {status === "not-started" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const arenaName = e.target.elements.arenaName.value;
              const name = e.target.elements.name.value;
              socket.emit("join", { arenaName, name });
            }}
          >
            <label>
              Arena name:
              <input type="text" name="arenaName" />
            </label>
            <br />
            <label>
              Name:
              <input type="text" name="name" />
            </label>
            <br />
            <button>Create arena</button>
          </form>
        )}

        {status === "not-started" &&
          arenas.map((arena) => {
            return (
              <div key={arena.name}>
                <h2>{arena.name}</h2>
                <ul>
                  {arena.players.map((player) => {
                    return <li key={player.name}>{player.name}</li>;
                  })}
                </ul>
                <p>{arena.status}</p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const name = e.target.elements.name.value;
                    socket.emit("join", { arenaName: arena.name, name });
                  }}
                >
                  <label>
                    Name:
                    <input type="text" name="name" />
                  </label>
                  <br />
                  <button>Join</button>
                </form>
              </div>
            );
          })}

        <button>Disconnect</button>

        {status === "ready" && (
          <>
            <h2>Active players</h2>
            <ul>
              {activePlayers.map((player) => {
                return (
                  <li key={player.name}>
                    {player.name} health: {player.health}
                  </li>
                );
              })}
            </ul>
            <h2>Attacks</h2>
            <ul>
              {attacks.map((attack, i) => {
                return (
                  <li key={attack.name}>
                    <button
                      onClick={() => {
                        socket.emit("attack", {
                          name: attack.name,
                          arenaName: currentArena,
                        });
                      }}
                    >
                      {attack.name} ({attack.damage})
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
