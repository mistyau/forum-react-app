import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EditThread from './components/EditThread';
import Preferences from './components/Preferences';
import Login from './components/Login';
import Home from './components/Home';
import useToken from './components/userToken';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import SignUp from './components/Signup';
import Thread from './components/Thread';
import NavBar from './components/NavBar';

function App() {
  const { token, setToken } = useToken();

  return (
    <div className="wrapper">
      <BrowserRouter>
        <NavBar user={token} />
        <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/thread/:id" component={Thread}/>
          <PublicRoute restricted={true} user={token} path="/signup">
            <SignUp/>
          </PublicRoute>
          <PublicRoute restricted={true} user={token} path="/login">
            <Login setToken={setToken} />
          </PublicRoute>
          <PrivateRoute user={token} path="/dashboard">
            <Dashboard user={token}/>
          </PrivateRoute>
          <PrivateRoute user={token} path="/edit/:id">
            <EditThread user={token} />
          </PrivateRoute>
          <PrivateRoute user={token} path="/preferences">
            <Preferences />
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
