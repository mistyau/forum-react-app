import { Route, Redirect } from "react-router";
import { isLogin } from '../utils';

const PrivateRoute = ({component: Component, ...rest}) => {
  return (
      // Show the component only when the use is logged in
      // Otherwise, redirect the user to /login page
      <Route {...rest} render={props => (
          isLogin() ? <Component {...props } /> : <Redirect to="/login" />
      )} />
  )  
};

export default PrivateRoute;