import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Preferences from './components/Preferences';
import Login from './components/Login';
import Home from './components/Home';
import useToken from './components/userToken';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import SignUp from './components/Signup';
import Thread from './components/Thread';

function App() {
  const { token, setToken } = useToken();

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/thread/:id" component={Thread}/>
          <Route path="/signup">
            {token.token ? <Redirect to="/dashboard" /> : <SignUp/>}
          </Route>
          <Route path="/login">
            {(token.token !== null) ? <Redirect to="/dashboard" /> : <Login setToken={setToken} />}
          </Route>
          <Route path="/dashboard">
            {token.token ? <Dashboard/> : <Redirect to="/login" />}
          </Route>
          <Route path="/preferences">
            <Preferences />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
