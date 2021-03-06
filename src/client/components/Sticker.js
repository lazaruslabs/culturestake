import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';

import rectangle from '~/client/assets/images/rectangle.svg';
import star from '~/client/assets/images/star.svg';
import styles from '~/client/styles/variables';
import swirl from '~/client/assets/images/swirl.svg';
import {
  CLIP_PATHS,
  CLIP_PATH_DIMENSION,
} from '~/client/components/SVGDefinitions';
import { useScheme } from '~/client/hooks/scheme';
import { useSticker } from '~/client/hooks/sticker';

const PARTICLE_PATHS = {
  rectangle,
  star,
  swirl,
};

const Sticker = (props) => {
  const {
    clipShapeId,
    particlePositions,
    particleShapeId,
    scheme,
  } = useSticker(props.code);

  const { scheme: innerScheme } = useScheme(scheme);

  return (
    <StickerStyle
      color={styles.schemes[innerScheme].foreground}
      height={CLIP_PATH_DIMENSION}
      width={CLIP_PATH_DIMENSION}
      xmlns="http://www.w3.org/2000/svg"
    >
      <StickerImage
        clipShapeId={clipShapeId}
        scheme={innerScheme}
        src={props.imagePath}
      />

      <Suspense fallback={null}>
        <StickerParticles
          path={PARTICLE_PATHS[particleShapeId]}
          positions={particlePositions}
          scheme={innerScheme}
        />
      </Suspense>

      {clipShapeId === 'clip-path-corners' ? (
        <g
          fill="transparent"
          shapeRendering="crispEdges"
          stroke={styles.schemes[innerScheme].foreground}
          strokeWidth="1.5"
        >
          <rect
            height={CLIP_PATH_DIMENSION / 1.5}
            width={CLIP_PATH_DIMENSION / 1.75}
            x={CLIP_PATH_DIMENSION / 4.7}
            y={CLIP_PATH_DIMENSION / 6}
          />
        </g>
      ) : null}
    </StickerStyle>
  );
};

const StickerImage = ({ offset = 30, ...props }) => {
  const StickerImageBorderShape = CLIP_PATHS[props.clipShapeId];

  return (
    <g
      clipPath={`url(#${props.clipShapeId})`}
      height={CLIP_PATH_DIMENSION}
      width={CLIP_PATH_DIMENSION}
    >
      {props.src && (
        <image
          filter={`url(#filter-${props.scheme})`}
          height={CLIP_PATH_DIMENSION + offset * 2}
          href={props.src}
          transform={`translate(-${offset}, -${offset})`}
          width={CLIP_PATH_DIMENSION + offset * 2}
        />
      )}

      <g
        fill="transparent"
        stroke={styles.schemes[props.scheme].foreground}
        strokeWidth="3"
      >
        <StickerImageBorderShape />
      </g>
    </g>
  );
};

const StickerParticles = (props) => {
  const { xml } = useLoader(SVGLoader, props.path);

  return props.positions.map(({ x, y }, index) => {
    // Make elements smaller
    xml.firstChild.setAttribute('transform', 'scale(0.7)');

    return (
      <g
        dangerouslySetInnerHTML={{ __html: xml.innerHTML }}
        key={index}
        transform={`translate(${x}, ${y})`}
      />
    );
  });
};

export const StickerStyle = styled.svg`
  display: block;

  width: ${CLIP_PATH_DIMENSION}px;

  margin: 0 auto;

  [fill] {
    fill: ${(props) => props.color};
  }

  [fill='transparent'] {
    fill: transparent;
  }

  [fill='none'] {
    fill: none;
  }

  [stroke] {
    stroke: ${(props) => props.color};
  }
`;

const particlePositions = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
);

Sticker.propTypes = {
  code: PropTypes.string,
  imagePath: PropTypes.string,
};

StickerParticles.propTypes = {
  particlePath: PropTypes.string,
  particlePositions,
};

StickerImage.propTypes = {
  clipShapeId: PropTypes.string.isRequired,
  offset: PropTypes.number,
  scheme: PropTypes.string.isRequired,
  src: PropTypes.string,
};

export default Sticker;
