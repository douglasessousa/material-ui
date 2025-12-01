import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AvatarProps } from '@mui/material/Avatar';
import Box, { BoxProps } from '@mui/material/Box';
import Slide from 'docs/src/components/animation/Slide';
import FadeDelay from 'docs/src/components/animation/FadeDelay';

// 🔥 1. Centralizar tipos de união
type DesignToolBrand = 'figma' | 'sketch' | 'xd';
type AnimationDirection = 'up' | 'down';

// 🔥 2. Melhorar definição de keyframes com type safety
interface CSSKeyframe {
  transform?: string;
  opacity?: number;
}

type CSSKeyframes = Record<`${number}%`, CSSKeyframe>;

// 🔥 3. Configurações centralizadas para brands
const DESIGN_TOOL_CONFIGS: Record<
  DesignToolBrand, 
  { 
    href: string; 
    logo: string;
    available: boolean;
  }
> = {
  figma: {
    href: 'https://mui.com/store/items/figma-react/?utm_source=marketing&utm_medium=referral&utm_campaign=home-products',
    logo: 'figma-logo.svg',
    available: true,
  },
  sketch: {
    href: 'https://mui.com/store/items/sketch-react/?utm_source=marketing&utm_medium=referral&utm_campaign=home-products',
    logo: 'sketch-logo.svg',
    available: true,
  },
  xd: {
    href: '#',
    logo: 'xd-logo.svg',
    available: false,
  },
};

// 🔥 4. Keyframes padrão como constantes tipadas
const DEFAULT_ANIMATIONS: Record<AnimationDirection, CSSKeyframes> = {
  up: {
    '0%': { transform: 'translateY(-300px)' },
    '100%': { transform: 'translateY(-20px)' },
  },
  down: {
    '0%': { transform: 'translateY(150px)' },
    '100%': { transform: 'translateY(-80px)' },
  },
};

const ratio = 900 / 494;
const transparent = 'rgba(255,255,255,0)';

// ... (styled components mantidos igual) ...

const Image = styled('img')(({ theme }) => ({
  // ... (estilos mantidos) ...
}));

const Anchor = styled('a')(({ theme }) => [
  // ... (estilos mantidos) ...
]);

// 🔥 5. Componente com tipo específico
interface DesignToolLinkProps extends React.PropsWithChildren {
  brand: DesignToolBrand;
}

const DesignToolLink = React.forwardRef<HTMLAnchorElement, DesignToolLinkProps>(
  function DesignToolLink({ brand, ...other }, ref) {
    const config = DESIGN_TOOL_CONFIGS[brand];
    
    return (
      <Anchor
        ref={ref}
        aria-label={`Go to MUI ${brand} design kit`}
        href={config.href}
        target="_blank"
        {...(config.available ? {} : { 
          'aria-disabled': 'true',
          onClick: (e) => e.preventDefault()
        })}
        {...other}
      />
    );
  }
);

// 🔥 6. Props interface específica
interface DesignToolLogoProps extends AvatarProps {
  brand: DesignToolBrand;
}

const DesignToolLogo = React.forwardRef<HTMLDivElement, DesignToolLogoProps>(
  function DesignToolLogo({ brand, ...props }, ref) {
    const config = DESIGN_TOOL_CONFIGS[brand];
    
    return (
      <Box
        ref={ref}
        {...props}
        sx={{
          display: 'flex',
          p: 2,
          borderRadius: '50%',
          ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        }}
      >
        <img
          src={`/static/branding/design-kits/${config.logo}`}
          alt=""
          loading="lazy"
          width="60"
          height="60"
        />
      </Box>
    );
  }
);

export function PrefetchDesignKitImages() {
  const imageNames = [
    'designkits1', 'designkits2', 'designkits3', 
    'designkits4', 'designkits5', 'designkits6',
    'designkits-figma', 'designkits-sketch', 'designkits-xd'
  ] as const;

  return (
    <Box
      sx={{
        width: 0,
        height: 0,
        position: 'fixed',
        top: -1000,
        zIndex: -1,
        '& > img': {
          position: 'absolute',
        },
      }}
    >
      {imageNames.map((img) => (
        <img
          key={img}
          src={`/static/branding/design-kits/${img}.jpeg`}
          alt=""
          loading="lazy"
        />
      ))}
    </Box>
  );
}

// 🔥 7. Props interfaces específicas para componentes de imagem
interface DesignKitImagesProps extends BoxProps {
  keyframes?: CSSKeyframes;
  animationDirection?: AnimationDirection;
}

export function DesignKitImagesSet1({
  keyframes,
  animationDirection = 'up',
  ...props
}: DesignKitImagesProps) {
  const finalKeyframes = keyframes || DEFAULT_ANIMATIONS[animationDirection];
  
  return (
    <Slide animationName="designkit-slideup" {...props} keyframes={finalKeyframes}>
      <FadeDelay delay={400}>
        <Image src="/static/branding/design-kits/designkits1.jpeg" alt="" />
      </FadeDelay>
      <FadeDelay delay={200}>
        <Image src="/static/branding/design-kits/designkits3.jpeg" alt="" />
      </FadeDelay>
      <FadeDelay delay={0}>
        <Image src="/static/branding/design-kits/designkits5.jpeg" alt="" />
      </FadeDelay>
    </Slide>
  );
}

export function DesignKitImagesSet2({
  keyframes,
  animationDirection = 'down',
  ...props
}: DesignKitImagesProps) {
  const finalKeyframes = keyframes || DEFAULT_ANIMATIONS[animationDirection];
  
  return (
    <Slide animationName="designkit-slidedown" {...props} keyframes={finalKeyframes}>
      <FadeDelay delay={100}>
        <Image src="/static/branding/design-kits/designkits2.jpeg" alt="" />
      </FadeDelay>
      <FadeDelay delay={300}>
        <Image src="/static/branding/design-kits/designkits4.jpeg" alt="" />
      </FadeDelay>
      <FadeDelay delay={500}>
        <Image src="/static/branding/design-kits/designkits6.jpeg" alt="" />
      </FadeDelay>
    </Slide>
  );
}

// 🔥 8. Props interface para DesignKitTools
interface DesignKitToolsProps extends BoxProps {
  disableLink?: boolean;
  availableBrands?: DesignToolBrand[];
}

export function DesignKitTools({
  disableLink,
  availableBrands = ['figma', 'sketch'],
  ...props
}: DesignKitToolsProps) {
  const renderTool = (brand: DesignToolBrand) => {
    if (!DESIGN_TOOL_CONFIGS[brand].available) {
      return <DesignToolLogo brand={brand} sx={{ opacity: 0.5 }} />;
    }
    
    return disableLink ? (
      <DesignToolLogo brand={brand} />
    ) : (
      <DesignToolLink brand={brand}>
        <DesignToolLogo brand={brand} />
      </DesignToolLink>
    );
  };

  return (
    <Box
      {...props}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        display: 'grid',
        gap: { xs: 3, lg: 6 },
        py: 4,
        gridTemplateColumns: `repeat(${availableBrands.length}, 1fr)`,
        '& .MuiAvatar-root': {
          width: { xs: 80, sm: 100 },
          height: { xs: 80, sm: 100 },
        },
        ...props.sx,
      }}
    >
      {availableBrands.map((brand, index) => (
        <FadeDelay key={brand} delay={200 * (index + 1)}>
          {renderTool(brand)}
        </FadeDelay>
      ))}
    </Box>
  );
}

// ... (restante do código mantido) ...

export default function DesignKits() {
  return (
    <Box
      sx={{
        mx: { xs: -2, sm: -3, md: 0 },
        my: { md: -18 },
        height: { xs: 300, sm: 360, md: 'calc(100% + 320px)' },
        overflow: 'hidden',
        position: 'relative',
        width: { xs: '100vw', md: '50vw' },
      }}
    >
      <DesignKitTools />
      <Box sx={{ position: 'relative', height: '100%', perspective: '1000px' }}>
        <Box
          sx={{
            left: '36%',
            position: 'absolute',
            display: 'flex',
            transform: 'translateX(-40%) rotateZ(30deg) rotateX(8deg) rotateY(-8deg)',
          }}
        >
          <DesignKitImagesSet1 />
          <DesignKitImagesSet2 sx={{ ml: { xs: 2, sm: 4, md: 8 } }} />
        </Box>
      </Box>
    </Box>
  );
}
