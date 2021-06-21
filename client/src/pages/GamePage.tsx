import React from 'react';
import { Grid } from '@material-ui/core';
import Board from '../components/Game/Board';
import GameSideBar from '../components/Game/GameSideBar';

interface GamePageProps {}

const GamePage: React.FC<GamePageProps> = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={7}>
        <Board />
      </Grid>
      <Grid item xs={5}>
        <GameSideBar />
      </Grid>
    </Grid>
  );
};

export default GamePage;
