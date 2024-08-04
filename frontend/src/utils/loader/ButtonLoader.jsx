import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const ButtonLoader = () => {
  const override = {
    display: 'block',
    margin: '0 auto',
    borderColor: 'green',
  };
  return (
    <ClipLoader
      color={'green'}
      cssOverride={override}
      size={25}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default ButtonLoader;
