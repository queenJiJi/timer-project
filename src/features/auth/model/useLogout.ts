import { useNavigate } from "react-router-dom";
import useLogoutMutation from "./useLogoutMutation";

export default function useLogout() {
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return { onLogout };
}
