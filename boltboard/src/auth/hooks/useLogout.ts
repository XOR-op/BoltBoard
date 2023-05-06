import { useMutation } from "react-query";

const logout = async (): Promise<string> => {
  return '';
};

export function useLogout() {
  const { isLoading, mutateAsync } = useMutation(logout);

  return { isLoggingOut: isLoading, logout: mutateAsync };
}
