'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { OverridableComponent } from '@mui/types';
import capitalize from '@mui/utils/capitalize';
import isMuiElement from '@mui/utils/isMuiElement';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import clsx from 'clsx';
import { useThemeProps } from '../styles';
import useSlot from '../utils/useSlot';
import styled from '../styles/styled';
import { getBreadcrumbsUtilityClass } from './breadcrumbsClasses';
import { BreadcrumbsProps, BreadcrumbsOwnerState, BreadcrumbsTypeMap } from './BreadcrumbsProps';
import { TypographyInheritContext } from '../Typography/Typography';

const useUtilityClasses = (ownerState: BreadcrumbsOwnerState) => {
  const size = ownerState.size ?? 'md';

  const slots = {
    root: ['root', `size${capitalize(size)}`],
    li: ['li'],
    ol: ['ol'],
    separator: ['separator'],
  };

  return composeClasses(slots, getBreadcrumbsUtilityClass, {});
};

const BreadcrumbsRoot = styled('nav', {
  name: 'JoyBreadcrumbs',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: BreadcrumbsOwnerState }>(({ theme, ownerState }) => {
  const size = ownerState.size ?? 'md';

  return {
    ...(size === 'sm' && {
      '--Icon-fontSize': theme.vars.fontSize.lg,
      gap: '0.25rem',
      padding: '0.5rem',
    }),
    ...(size === 'md' && {
      '--Icon-fontSize': theme.vars.fontSize.xl,
      gap: '0.375rem',
      padding: '0.75rem',
    }),
    ...(size === 'lg' && {
      '--Icon-fontSize': theme.vars.fontSize.xl2,
      gap: '0.5rem',
      padding: '1rem',
    }),
    ...theme.typography?.[`body-${size}`],
  };
});

const BreadcrumbsOl = styled('ol', {
  name: 'JoyBreadcrumbs',
  slot: 'Ol',
})({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'inherit',
  padding: 0,
  margin: 0,
  listStyle: 'none',
});

const BreadcrumbsLi = styled('li', {
  name: 'JoyBreadcrumbs',
  slot: 'Li',
})({
  display: 'flex',
  alignItems: 'center',
});

const BreadcrumbsSeparator = styled('li', {
  name: 'JoyBreadcrumbs',
  slot: 'Separator',
})({
  display: 'flex',
  userSelect: 'none',
});

const Breadcrumbs = React.forwardRef(function Breadcrumbs(inProps, ref) {
  const props = useThemeProps<typeof inProps & BreadcrumbsProps>({
    props: inProps,
    name: 'JoyBreadcrumbs',
  });

  const {
    children,
    className,
    size = 'md',
    separator = '/',
    component,
    slots = {},
    slotProps = {},
    ...other
  } = props;

  const ownerState: BreadcrumbsOwnerState = {
    ...props,
    size,
    separator,
  };

  const classes = useUtilityClasses(ownerState);
  const externalForwardedProps = { ...other, component, slots, slotProps };

  const [SlotRoot, rootProps] = useSlot('root', {
    ref,
    className: clsx(classes.root, className),
    elementType: BreadcrumbsRoot,
    externalForwardedProps,
    ownerState,
  });

  const [SlotOl, olProps] = useSlot('ol', {
    className: classes.ol,
    elementType: BreadcrumbsOl,
    externalForwardedProps,
    ownerState,
  });

  const [SlotLi, liProps] = useSlot('li', {
    className: classes.li,
    elementType: BreadcrumbsLi,
    externalForwardedProps,
    ownerState,
  });

  const [SlotSeparator, separatorProps] = useSlot('separator', {
    additionalProps: { 'aria-hidden': true },
    className: classes.separator,
    elementType: BreadcrumbsSeparator,
    externalForwardedProps,
    ownerState,
  });

  const items = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child, index) => (
      <SlotLi key={index} {...liProps}>
        {isMuiElement(child, ['Typography'])
          ? React.cloneElement(child, { component: child.props.component ?? 'span' })
          : child}
      </SlotLi>
    ));

  return (
    <TypographyInheritContext.Provider value>
      <SlotRoot {...rootProps}>
        <SlotOl {...olProps}>
          {items.flatMap((item, index) =>
            index < items.length - 1
              ? [
                  item,
                  <SlotSeparator key={`sep-${index}`} {...separatorProps}>
                    {separator}
                  </SlotSeparator>,
                ]
              : [item],
          )}
        </SlotOl>
      </SlotRoot>
    </TypographyInheritContext.Provider>
  );
}) as OverridableComponent<BreadcrumbsTypeMap>;

export default Breadcrumbs;
