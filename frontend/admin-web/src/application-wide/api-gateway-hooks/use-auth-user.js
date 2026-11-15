import { useCallback } from 'react';
import { useAxios } from '../axios';

const UPDATE_PROFILE_API_URL = '/update-profile';
const GET_USER_API_URL = '/user';

const useAuthUser = () => {
  const { loading, error, value, fetch } = useAxios();

  const onUpdateAuthUserProfile = useCallback(
    async (payload) => {
      return await fetch(
        'PUT',
        UPDATE_PROFILE_API_URL,
        payload,
      );
    },
    [fetch]
  );

  const onGetAuthUser = useCallback(
    async () => {
      return await fetch(
        'GET',
        GET_USER_API_URL,
      );
    },
    [fetch]
  );

  return { 
    loading, 
    value, 
    error, 
    onUpdateAuthUserProfile,
    onGetAuthUser
  };
};

export default useAuthUser;