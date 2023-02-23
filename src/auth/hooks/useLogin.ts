import { useMutation } from "react-query";

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> => {
  return password;
};

export function useLogin() {
  const { isLoading, mutateAsync } = useMutation(login);

  return { isLoggingIn: isLoading, login: mutateAsync };
}
