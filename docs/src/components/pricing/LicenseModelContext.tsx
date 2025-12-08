import * as React from 'react';

export interface LicenseModelContextValue {
  licenseModel: string;
  setLicenseModel: React.Dispatch<React.SetStateAction<string>>;
}

export interface LicenseModelProviderProps {
  children: React.ReactNode;
}

const LicenseModel = React.createContext<LicenseModelContextValue | null>(null);

if (process.env.NODE_ENV !== 'production') {
  LicenseModel.displayName = 'LicenseModel';
}

export function LicenseModelProvider(props: LicenseModelProviderProps) {
  const [licenseModel, setLicenseModel] = React.useState<string>('annual');
  const value = React.useMemo(
    () => ({ licenseModel, setLicenseModel }),
    [licenseModel, setLicenseModel],
  );
  return <LicenseModel.Provider value={value}>{props.children}</LicenseModel.Provider>;
}

export function useLicenseModel() {
  const context = React.useContext(LicenseModel);
  
  if (context === null) {
    throw new Error('useLicenseModel must be used within a LicenseModelProvider');
  }
  
  return context;
}