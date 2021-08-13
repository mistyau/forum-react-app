import { Route, Redirect } from "react-router";
import { isLogin } from '../utils';

const PublicRoute = ({component: Component, restricted, ...rest}) => {
    return (
        // restricted = false => public route
        // restricted = true => restricted route
        <Route {...rest} render={props => (
            isLogin() && restricted ?
                <Redirect to="/dashboard" />
            : <Component {...props} />
        )} />
    );
};

export default PublicRoute;