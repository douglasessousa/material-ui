'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { OverridableComponent } from '@mui/types';
import capitalize from '@mui/utils/capitalize';
import usePreviousProps from '@mui/utils/usePreviousProps';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import styled from '../styles/styled';
import useThemeProps from '../styles/useThemeProps';
import useSlot from '../utils/useSlot';
import badgeClasses, { getBadgeUtilityClass } from './badgeClasses';
import { BadgeProps, BadgeOwnerState, BadgeTypeMap } from './BadgeProps';

const useUtilityClasses = (ownerState: BadgeOwnerState) => {
  const { color, variant, size, anchorOrigin, invisible } = ownerState;

  const slots = {
    root: ['root'],
    badge: [
      'badge',
      invisible && 'invisible',
      anchorOrigin &&
        `anchorOrigin${capitalize(anchorOrigin.vertical)}${capitalize(anchorOrigin.horizontal)}`,
      variant && `variant${capitalize(variant)}`,
      color && `color${capitalize(color)}`,
      size && `size${capitalize(size)}`,
    ],
  };

  return composeClasses(slots, getBadgeUtilityClass, {});
};

const BadgeRoot = styled('span', {
  name: 'JoyBadge',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: BadgeOwnerState }>(({ theme, ownerState }) => {
  const size = ownerState.size ?? 'md';

  return {
    ...(size === 'sm' && {
      '--Badge-minHeight': ownerState.badgeContent ? '1rem' : '0.5rem',
      '--Badge-paddingX': '0.25rem',
    }),
    ...(size === 'md' && {
      '--Badge-minHeight': ownerState.badgeContent ? '1.25rem' : '0.75rem',
      '--Badge-paddingX': '0.375rem',
    }),
    ...(size === 'lg' && {
      '--Badge-minHeight': ownerState.badgeContent ? '1.5rem' : '1rem',
      '--Badge-paddingX': '0.5rem',
    }),
    '--Badge-ringSize': '2px',
    '--Badge-ring': `0 0 0 var(--Badge-ringSize) var(--Badge-ringColor, ${theme.vars.palette.background.surface})`,
    position: 'relative',
    display: 'inline-flex',
    verticalAlign: 'middle',
    flexShrink: 0,
  };
});

const BadgeBadge = styled('span', {
  name: 'JoyBadge',
  slot: 'Badge',
  overridesResolver: (props, styles) => styles.badge,
})<{ ownerState: BadgeOwnerState }>(({ theme, ownerState }) => {
  const size = ownerState.size ?? 'md';
  const variant = ownerState.variant ?? 'solid';
  const color = ownerState.color ?? 'primary';
  const anchorOrigin = ownerState.anchorOrigin ?? {
    vertical: 'top',
    horizontal: 'right',
  };

  const inset = {
    top: ownerState.badgeInset,
    right: ownerState.badgeInset,
    bottom: ownerState.badgeInset,
    left: ownerState.badgeInset,
  };

  if (typeof ownerState.badgeInset === 'string') {
    const values = ownerState.badgeInset.split(' ');
    if (values.length === 2) {
      inset.top = values[0];
      inset.bottom = values[0];
      inset.left = values[1];
      inset.right = values[1];
    }
  }

  const translateY = anchorOrigin.vertical === 'top' ? 'translateY(-50%)' : 'translateY(50%)';
  const translateX = anchorOrigin.horizontal === 'left' ? 'translateX(-50%)' : 'translateX(50%)';

  const typography =
    theme.typography[
      `body-${({ sm: 'xs', md: 'sm', lg: 'md' } as const)[size]}`
    ];

  return {
    '--Icon-color': 'currentColor',
    display: 'inline-flex',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    boxShadow: 'var(--Badge-ring)',
    padding: '0 calc(var(--Badge-paddingX) - var(--variant-borderWidth, 0px))',
    minHeight: 'var(--Badge-minHeight)',
    minWidth: 'var(--Badge-minHeight)',
    borderRadius: 'var(--Badge-radius, var(--Badge-minHeight))',
    zIndex: theme.vars.zIndex.badge,
    backgroundColor: theme.vars.palette.background.surface,
    [anchorOrigin.vertical]: inset[anchorOrigin.vertical],
    [anchorOrigin.horizontal]: inset[anchorOrigin.horizontal],
    transform: `scale(1) ${translateX} ${translateY}`,
    [`&.${badgeClasses.invisible}`]: {
      transform: `scale(0) ${translateX} ${translateY}`,
    },
    ...typography,
    fontWeight: theme.vars.fontWeight.md,
    ...theme.variants[variant]?.[color],
  };
});

const Badge = React.forwardRef(function Badge(inProps, ref) {
  const props = useThemeProps<typeof inProps & BadgeProps>({
    props: inProps,
    name: 'JoyBadge',
  });

  const {
    anchorOrigin: anchorOriginProp = { vertical: 'top', horizontal: 'right' },
    badgeInset: badgeInsetProp = 0,
    children,
    size: sizeProp = 'md',
    color: colorProp = 'primary',
    invisible: invisibleProp = false,
    badgeContent: badgeContentProp = '',
    variant: variantProp = 'solid',
    component,
    slots = {},
    slotProps = {},
    ...other
  } = props;

  const invisible =
    invisibleProp ||
    ((badgeContentProp === 0 || badgeContentProp == null) && !props.showZero);

  const ownerState = {
    ...props,
    anchorOrigin: anchorOriginProp,
    badgeInset: badgeInsetProp,
    variant: variantProp,
    invisible,
    color: colorProp,
    size: sizeProp,
  };

  const classes = useUtilityClasses(ownerState);
  const externalForwardedProps = { ...other, component, slots, slotProps };

  const [SlotRoot, rootProps] = useSlot('root', {
    ref,
    className: classes.root,
    elementType: BadgeRoot,
    externalForwardedProps,
    ownerState,
  });

  const [SlotBadge, badgeProps] = useSlot('badge', {
    className: classes.badge,
    elementType: BadgeBadge,
    externalForwardedProps,
    ownerState,
  });

  return (
    <SlotRoot {...rootProps}>
      {children}
      <SlotBadge {...badgeProps}>{badgeContentProp}</SlotBadge>
    </SlotRoot>
  );
}) as OverridableComponent<BadgeTypeMap>;

export default Badge;
