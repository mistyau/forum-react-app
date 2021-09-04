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
import CreateThread from './components/CreateThreadForm';
import SearchList from './components/SearchList';

function App() {
  const { token, setToken } = useToken();

  return (
    <div className="wrapper">
      <BrowserRouter>
        <NavBar user={token} />
        <Switch>
          <PublicRoute restricted={false} user={token} path="/" exact>
            <Home />
          </PublicRoute>
          <PublicRoute restricted={false} user={token} path="/thread/:id"> 
            <Thread user={token} />
          </PublicRoute>
          <PublicRoute restricted={false} user={token} path="/search/:parameters">
            <SearchList />
          </PublicRoute>
          <PublicRoute restricted={true} user={token} path="/signup">
            <SignUp/>
          </PublicRoute>
          <PublicRoute restricted={true} user={token} path="/login">
            <Login setToken={setToken} />
          </PublicRoute>
          <PrivateRoute user={token} path="/dashboard">
            <Dashboard user={token}/>
          </PrivateRoute>
          <PrivateRoute user={token} path="/create">
            <CreateThread user={token} />
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
