// https://github.com/EnCiv/undebate-ssp/issues/6

import { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import svg from '../../assets/svg/clock.svg';

const ElectionTimeInput = (props) => {
  const { defaultValue = '', onDone = () => {} } = props;
  const [time, setTime] = useState(defaultValue);
  const classes = useStyles(time);
  const inputRef = useRef(null);

  useEffect(() => {
    handleDone(time);
  }, []);

  const handleChange = (e) => {
    setTime(e.target.value);
  };

  const handleDone = (e) => {
    onDone({ valid: time ? true : false, value: time });
  };

  return (
    <>
      <input
        className={classes.electionTimeInput}
        type="time"
        defaultValue={time}
        onBlur={handleDone}
        onChange={handleChange}
        onKeyPress={(e) => {
          if (e.key === 'Enter') inputRef.current.blur();
        }}
        ref={inputRef}
        placeholder=""
      />
    </>
  );
};

export default ElectionTimeInput;

const useStyles = createUseStyles({
  electionTimeInput: (time) => ({
    borderRadius: '0.625rem',
    background:
      'linear-gradient(0deg, rgba(38, 45, 51, 0.2), rgba(38, 45, 51, 0.2)), #FFFFFF',
    color: time ? 'black' : 'grey',
    padding: '1rem 1.25rem',
    border: 'none',
    fontSize: '1.125rem',
    width: '100%',
    '&::-webkit-calendar-picker-indicator': {
      backgroundImage: `url(${svg})`,
    },
  }),
});
