import { useContext } from 'react';
import ApiContext, { ApiContextProps } from '../api/ApiContext';

export function useApi(): ApiContextProps {
  return useContext(ApiContext);
}
