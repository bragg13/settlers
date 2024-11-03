const PlayPage = () => {
  // const world = useRef(null);
  // const location = useLocation();
  // const [loaded, setLoaded] = useState(false);
  // const [players, setPlayers] = useState([]);
  // const [currentPlayer, setCurrentPlayer] = useState(null);
  // const [turn, setTurn] = useState(null);
  // const [availableActions, setAvailableActions] = useState([]);

  // useEffect(() => {
  //   const initialGameState = location.state.initialGameState;

  //   // initialize the world
  //   world.current = new World("three-js-canvas", socket);
  //   world.current.initialize(initialGameState);

  //   // I NEED TO USE A REDUCER HERE

  //   // initialize the GUI
  //   setPlayers(initialGameState.players);
  //   setTurn(initialGameState.turn);
  //   setCurrentPlayer(initialGameState.players[socket.id]);
  //   setLoaded(true);
  // }, [location.state.initialGameState, socket]);

  // // listen to server updates
  // useEffect(() => {
  //   if (loaded) {
  //     socket.on("earlyGameUpdate", (updateData) => processEarlyGameUpdate(updateData));
  //     socket.on("gameUpdate", (updateData) => processGameUpdate(updateData));
  //   }
  // }, [socket, loaded]);

  // const processEarlyGameUpdate = (gameUpdate) => {
  //   // update the board
  //   world.current.updateScene([...gameUpdate.updatedBoard]);

  //   // update the GUI - TODO: might just use setState
  //   setTurn(gameUpdate.turn);
  //   setPlayers((prevPlayers) => {
  //     return { ...prevPlayers, ...gameUpdate.players };
  //   });
  //   setCurrentPlayer((prevPlayer) => {
  //     return {
  //       ...prevPlayer, ...gameUpdate.players[socket.id],  };
  //   });

  //   // play the turn (if it is mine)
  //   if (gameUpdate.turn.player === socket.id && gameUpdate.turn.round !== 0) {
  //     world.current.handleEarlyGame(currentPlayer, { ...gameUpdate });
  //   }
  // };

  // const processGameUpdate = (gameUpdate) => {
  //   console.log('gameUpdate', gameUpdate);

  //   // update the board
  //   world.current.updateScene([...gameUpdate.updatedBoard]);

  //   // update the GUI - TODO: might just use setState
  //   setTurn(gameUpdate.turn);
  //   setPlayers((prevPlayers) => {
  //     return { ...prevPlayers, ...gameUpdate.players };
  //   });
  //   setCurrentPlayer((prevPlayer) => {
  //     return {
  //       ...prevPlayer,
  //       ...gameUpdate.players[socket.id],
  //       playing: (gameUpdate.turn.player === socket.id),
  //       inventory: {
  //         ...gameUpdate.players[socket.id].inventory,
  //       },
  //     };
  //   });
  //   setAvailableActions((prevActions) => {
  //     return {...prevActions, ...gameUpdate.availableActions};
  //   });

  //   console.log("currentPlayer", currentPlayer);

  //   // play the turn (if it is mine)
  //   if (gameUpdate.turn.player === socket.id) {
  //     world.current.handleGame(currentPlayer, { ...gameUpdate });
  //   }
  // };

  // const handleCrafting = () => {
  //   world.current.handleCrafting();
  // };

  // const handleDiceRoll = (value1, value2) => {
  //   // send values to server
  //   world.current.handleDiceRoll(value1, value2);
  // };

  // const handlePassTurn = () => {
  //   world.current.handlePassTurn();
  // };

  return (
    <div id="container">
      <canvas id="three-js-canvas" />
      {/* <MainContainer
        handleCrafting={handleCrafting}
        handleDiceRoll={handleDiceRoll}
        handlePassTurn={handlePassTurn}
        players={players}
        currentPlayer={
          availableActions !== undefined
            ? {
                ...currentPlayer,
                availableActions: availableActions,
              }
            : {
                ...currentPlayer,
              }
        }
        turn={turn}
      /> */}
    </div>
  );
};

export default PlayPage;
