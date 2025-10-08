import { useContext } from 'react';
import { AuthContext } from '../context/authContextConstants';

export function useAuth() {
  return useContext(AuthContext);
}
