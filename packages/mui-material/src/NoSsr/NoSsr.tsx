'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import exactProp from '@mui/utils/exactProp';
import { NoSsrProps } from './NoSsr.types';

interface NoSsrPropTypes {
  children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
  defer: PropTypes.Requireable<boolean>;
  fallback: PropTypes.Requireable<PropTypes.ReactNodeLike>;
}

/**
 * NoSsr purposely removes components from the subject of Server Side Rendering (SSR).
 *
 * This component can be useful in a variety of situations:
 *
 * * Escape hatch for broken dependencies not supporting SSR.
 * * Improve the time-to-first paint on the client by only rendering above the fold.
 * * Reduce the rendering time on the server.
 * * Under too heavy server load, you can turn on service degradation.
 *
 * Demos:
 *
 * - [No SSR](https://mui.com/material-ui/react-no-ssr/)
 *
 * API:
 *
 * - [NoSsr API](https://mui.com/material-ui/api/no-ssr/)
 */
function NoSsr(props: NoSsrProps): React.JSX.Element {
  const { children, defer = false, fallback = null } = props;
  const [mountedState, setMountedState] = React.useState(false);

  useEnhancedEffect(() => {
    if (!defer) {
      setMountedState(true);
    }
  }, [defer]);

  React.useEffect(() => {
    if (defer) {
      setMountedState(true);
    }
  }, [defer]);

  // TODO casting won't be needed at one point https://github.com/DefinitelyTyped/DefinitelyTyped/pull/65135
  return (mountedState ? children : fallback) as React.JSX.Element;
}

NoSsr.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * You can wrap a node.
   */
  children: PropTypes.node,
  /**
   * If `true`, the component will not only prevent server-side rendering.
   * It will also defer the rendering of the children into a different screen frame.
   * @default false
   */
  defer: PropTypes.bool,
  /**
   * The fallback content to display.
   * @default null
   */
  fallback: PropTypes.node,
} satisfies NoSsrPropTypes;

if (process.env.NODE_ENV !== 'production') {
  (NoSsr as React.ComponentType & { propTypes: NoSsrPropTypes }).propTypes = exactProp(NoSsr.propTypes);
}

export default NoSsr;
