import PropTypes from 'prop-types';
import React, { Suspense, Fragment, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';

import Instructions from '~/client/components/Instructions';
import Navigation from '~/client/components/Navigation';
import ThreeButtonInfo from '~/client/components/ThreeButtonInfo';
import ThreeButtonLogo from '~/client/components/ThreeButtonLogo';
import ThreeButtonNavigation from '~/client/components/ThreeButtonNavigation';
import ThreeCanvas from '~/client/components/ThreeCanvas';
import ThreeRotator from '~/client/components/ThreeRotator';
import styles from '~/client/styles/variables';

const ThreeInterface = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const { isAlternateColor } = useSelector((state) => state.app);

  const location = useLocation();
  const history = useHistory();

  const isShowingHome = location.pathname === '/';
  const isShowingVote = location.pathname.includes('/vote');

  const onClickLogo = () => {
    setIsExpanded(false);

    history.push('/');
  };

  const onClickNavigation = () => {
    setIsExpanded(!isExpanded);
  };

  const onClickInfo = () => {
    setIsInfoExpanded(!isInfoExpanded);
  };

  const onClickNavigationItem = () => {
    setIsExpanded(false);
  };

  return (
    <Fragment>
      <ThreeInterfaceElement
        isVisible={!isShowingHome && !isInfoExpanded}
        left
        top
        onClick={onClickLogo}
      >
        <ThreeRotator>
          <ThreeButtonLogo
            isAlternateColor={isAlternateColor}
            rotation={[3.5, -0.6, 0]}
          />
        </ThreeRotator>
      </ThreeInterfaceElement>

      <ThreeInterfaceElement
        isVisible={!isInfoExpanded}
        right
        top
        onClick={onClickNavigation}
      >
        <ThreeRotator>
          <ThreeButtonNavigation
            isAlternateColor={isAlternateColor}
            isExpanded={isExpanded}
            rotation={[3.5, 0.3, 0]}
          />
        </ThreeRotator>
      </ThreeInterfaceElement>

      <ThreeInterfaceElement
        bottom
        isVisible={props.isShowingInfo || (isShowingVote && !isExpanded)}
        right
        onClick={onClickInfo}
      >
        <ThreeButtonInfo
          isAlternateColor={isAlternateColor}
          isExpanded={isInfoExpanded}
          rotation={[3, -0.5, -0.1]}
        />
      </ThreeInterfaceElement>

      <Navigation isExpanded={isExpanded} onClickItem={onClickNavigationItem} />
      {isInfoExpanded && <Instructions />}
    </Fragment>
  );
};

const ThreeInterfaceElement = ({ isVisible = true, ...props }) => {
  return (
    <ThreeInterfaceElementStyle isVisible={isVisible} {...props}>
      <ThreeCanvas>
        <Suspense fallback={null}>{props.children}</Suspense>
      </ThreeCanvas>
    </ThreeInterfaceElementStyle>
  );
};

ThreeInterface.propTypes = {
  isShowingInfo: PropTypes.bool,
};

ThreeInterfaceElement.propTypes = {
  bottom: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isVisible: PropTypes.bool,
  left: PropTypes.bool,
  offset: PropTypes.number,
  right: PropTypes.bool,
  top: PropTypes.bool,
};

const ThreeInterfaceElementStyle = styled.div`
  position: fixed;

  top: ${(props) => (props.top ? '0' : null)};
  right: ${(props) => (props.right ? '0' : null)};
  bottom: ${(props) => (props.bottom ? '0' : null)};
  left: ${(props) => (props.left ? '0' : null)};

  z-index: ${styles.layers.ThreeInterfaceElement};

  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};

  width: 6.5rem;
  height: 6.5rem;

  margin: 1rem;

  cursor: pointer;
`;

export default ThreeInterface;
