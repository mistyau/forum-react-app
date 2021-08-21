import { Route, Redirect } from "react-router";

const PublicRoute = ({ children, restricted, user, ...rest }) => {

    return (
        // restricted = false => public route
        // restricted = true => restricted route
        <Route {...rest} render={({ location}) => (
            user.token && restricted ?
                (<Redirect to={{
                pathname: "/dashboard",
                state: { from: location }
            }} />)
            : (children)
        )} />
    );
};

export default PublicRoute;