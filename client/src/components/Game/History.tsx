import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { moveJumpAction } from '../../pages/Game/gameActions';
import {
  Box,
  Grid,
  Typography,
  MenuItem,
  List,
  ListItem,
  Radio,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import Select from '../Inputs/Select';

const History: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isAscending, toggleSort] = useState(true);
  const { history, step, opponent } = useAppSelector((state) => state.game);
  const historyRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (historyRefs.current[step]) {
      historyRefs.current[step].scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [step, isAscending]);

  let historyDisplay = [...history];
  historyDisplay = [
    { row: -1, col: -1, value: 'Go to game start' },
    ...historyDisplay,
  ];

  const historyList = historyDisplay.map((item, idx) => {
    const labelId = `history-list-label-${idx}`;
    const text =
      idx === 0
        ? item.value
        : `${item.value} move to square (${item.row + 1}, ${item.col + 1})`;

    return (
      <ListItem
        key={idx}
        ref={(el: HTMLDivElement) => (historyRefs.current[idx] = el)}
        dense
        button
        disabled={opponent === 'computer' && item.value === 'X'}
        onClick={() => dispatch(moveJumpAction(idx))}>
        <ListItemIcon>
          <Radio
            color='primary'
            checked={step === idx}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText
          id={labelId}
          primary={text}
          primaryTypographyProps={{ variant: 'button' }}
        />
      </ListItem>
    );
  });

  return (
    <Box>
      <Grid container alignItems='center' spacing={2}>
        <Grid item xs={2}>
          <Typography variant='h6'>History</Typography>
        </Grid>
        <Grid item xs={4}>
          <Select
            variant='outlined'
            name='Sort'
            defaultValue={Number(isAscending)}
            onChange={() => toggleSort(!isAscending)}>
            <MenuItem value={1}>Ascending</MenuItem>
            <MenuItem value={0}>Descending</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <List style={{ maxHeight: '300px', overflow: 'auto', marginTop: '1rem' }}>
        {isAscending
          ? historyList.sort((a: any, b: any) => a.key - b.key)
          : historyList.sort((a: any, b: any) => b.key - a.key)}
      </List>
    </Box>
  );
};

export default History;
