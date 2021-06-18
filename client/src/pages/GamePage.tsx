import React from 'react';
import { Grid } from '@material-ui/core';
import Board from '../components/Game/Board';

interface GamePageProps {}

const GamePage: React.FC<GamePageProps> = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={7}>
        <Board />
      </Grid>
    </Grid>
  );
};

export default GamePage;
