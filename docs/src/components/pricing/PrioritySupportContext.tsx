import * as React from 'react';

export interface PrioritySupportContextValue {
  prioritySupport: boolean;
  setPrioritySupport: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PrioritySupportProviderProps {
  children: React.ReactNode; 
}

const PrioritySupport = React.createContext<PrioritySupportContextValue | null>(null);

if (process.env.NODE_ENV !== 'production') {
  PrioritySupport.displayName = 'PrioritySupport';
}

export function PrioritySupportProvider(props: PrioritySupportProviderProps) {
  const [prioritySupport, setPrioritySupport] = React.useState<boolean>(false);
  const value = React.useMemo(
    () => ({ prioritySupport, setPrioritySupport }),
    [prioritySupport, setPrioritySupport],
  );
  return <PrioritySupport.Provider value={value}>{props.children}</PrioritySupport.Provider>;
}

export function usePrioritySupport() {
  const context = React.useContext(PrioritySupport);
  
  if (context === null) {
    throw new Error('usePrioritySupport must be used within a PrioritySupportProvider');
  }
  
  return context;
}