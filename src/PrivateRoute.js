import { Route, Redirect } from "react-router";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute ({ children, user, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                user.token ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            } />
    )
};

export default PrivateRoute;