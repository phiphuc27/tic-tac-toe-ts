import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../store';
import { Paper, Divider, Box, Typography } from '@material-ui/core';
import { Autorenew, ExitToApp, Undo, Redo } from '@material-ui/icons';
import ButtonBox from '../shared/form/ButtonBox';
import ButtonContained from '../shared/form/ButtonContained';
import { newGame, moveJump, quitGame } from '../../actions/game';
import History from './History';

interface GameSideBarProps {}

const GameSideBar: React.FC<GameSideBarProps> = () => {
  const dispatch = useDispatch();
  const { winner, isTurn, step, history, score } = useSelector((state: AppState) => state.game);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!winner) {
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
    <Paper elevation={1} style={{ height: '100%' }}>
      <Box padding={2}>
        <Box>
          <ButtonBox gap={1}>
            <ButtonContained startIcon={<Autorenew />} onClick={() => dispatch(newGame())}>
              New Game
            </ButtonContained>
            <ButtonContained startIcon={<ExitToApp />} onClick={() => dispatch(quitGame())}>
              Quit Game
            </ButtonContained>
          </ButtonBox>
          <ButtonBox gap={1}>
            <ButtonContained
              startIcon={<Undo />}
              onClick={() => dispatch(moveJump(step - 1))}
              disabled={step < 1}
            >
              Undo
            </ButtonContained>
            <ButtonContained
              startIcon={<Redo />}
              onClick={() => dispatch(moveJump(step + 1))}
              disabled={step >= history.length}
            >
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