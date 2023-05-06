import { Navigate, Route, RouteProps } from "react-router";
import { useAuth } from "../../auth/contexts/AuthProvider";

type PrivateRouteProps = {
  roles?: string[];
} & RouteProps;

const PrivateRoute = ({
  children,
  roles,
  ...routeProps
}: PrivateRouteProps) => {
  const { hasRole, userInfo } = useAuth();

  if (userInfo) {
    if (!hasRole(roles)) {
      return <Navigate to={`/403`} />;
    }
    return <Route {...routeProps} />;
  } else {
    return <Navigate to={`/login`} />;
  }
};

export default PrivateRoute;
