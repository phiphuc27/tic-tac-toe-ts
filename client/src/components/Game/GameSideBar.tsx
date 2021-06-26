import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/store';
import { useHistory } from 'react-router-dom';
import { Paper, Divider, Box, Typography } from '@material-ui/core';
import { Autorenew, ExitToApp, Undo, Redo } from '@material-ui/icons';
import { newGame } from '../../pages/Game/gameSlice';
import { moveJumpAction } from '../../pages/Game/gameActions';
import ButtonBox from '../Form/ButtonBox';
import ButtonContained from '../Form/ButtonContained';
import History from './History';

interface GameSideBarProps {}

const GameSideBar: React.FC<GameSideBarProps> = () => {
  const dispatch = useAppDispatch();
  const { winner, isTurn, step, history, score, opponent } = useAppSelector((state) => state.game);
  const [status, setStatus] = useState('');
  const redirectHistory = useHistory();

  useEffect(() => {
    if (!winner.name) {
      setStatus(`Next Player: ${isTurn ? 'X' : 'O'}`);
    } else {
      const { name } = winner;
      if (name === 'draw') {
        setStatus('Draw');
      } else {
        setStatus(`Winner: ${name.toUpperCase()}`);
      }
    }
  }, [winner, isTurn]);

  return (
    <Paper elevation={1} style={{ height: '100%', minHeight: '640px' }}>
      <Box padding={2}>
        <Box>
          <ButtonBox gap={1}>
            <ButtonContained startIcon={<Autorenew />} onClick={() => dispatch(newGame())}>
              New Game
            </ButtonContained>
            <ButtonContained startIcon={<ExitToApp />} onClick={() => redirectHistory.push('/')}>
              Quit Game
            </ButtonContained>
          </ButtonBox>
          <ButtonBox gap={1}>
            <ButtonContained
              startIcon={<Undo />}
              onClick={() => dispatch(moveJumpAction(opponent === 'player' ? step - 1 : step - 2))}
              disabled={step < 1}>
              Undo
            </ButtonContained>
            <ButtonContained
              startIcon={<Redo />}
              onClick={() => dispatch(moveJumpAction(opponent === 'player' ? step + 1 : step + 2))}
              disabled={step >= history.length}>
              Redo
            </ButtonContained>
          </ButtonBox>
        </Box>
        <Divider style={{ margin: '1rem 0' }} />
        <Box>
          <Typography variant='h6'>{status}</Typography>
          <Typography variant='h6' display='inline'>
            Score
          </Typography>
          <Box display='inline-flex' justifyContent='space-evenly' width='60%'>
            <Typography variant='h6'>X: {score.X}</Typography>
            <Typography variant='h6'>O: {score.O}</Typography>
          </Box>
        </Box>
        <Divider style={{ margin: '1rem 0' }} />
        <History />
      </Box>
    </Paper>
  );
};

export default GameSideBar;
