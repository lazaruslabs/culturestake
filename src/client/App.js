import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Normalize } from 'styled-normalize';
import { useDispatch, useSelector } from 'react-redux';

import GlobalStyle from '~/client/styles';
import Notifications from '~/client/components/Notifications';
import Routes from '~/client/routes';
import SVGDefinitions from '~/client/components/SVGDefinitions';
import ThreeInterface from '~/client/components/ThreeInterface';
import { initializeApp } from '~/client/store/app/actions';
import { initializeProvider } from '~/client/store/ethereum/actions';

const App = () => {
  const dispatch = useDispatch();
  const { isAlternateColor } = useSelector((state) => state.app);

  const onAppStart = () => {
    const initialize = async () => {
      await dispatch(initializeApp());
      await dispatch(initializeProvider());
    };

    initialize();
  };

  useEffect(onAppStart, [dispatch]);

  return (
    <Fragment>
      <Normalize />
      <GlobalStyle isAlternateColor={isAlternateColor} />
      <SVGDefinitions />

      <Router>
        <Notifications />
        <ThreeInterface />
        <Routes />
      </Router>
    </Fragment>
  );
};

export default App;
