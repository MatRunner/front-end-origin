import './App.css';
import {Switch,Route,NavLink,Link,HashRouter,Redirect} from 'react-router-dom'
import Login from './Login'
import Main from './Main'
import Register from './Register'
import ViewVote from './ViewVote'
import CreateVote from './CreateVote'
import 'antd/dist/antd.css';
function App() {
  return (
    <HashRouter>
      <div className="App">
        <Switch>
          <Route path='/' exact>
            <Redirect to="/main"/>
          </Route>
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/main' component={Main} />
          <Route path='/vote/:id' component={ViewVote} />
          <Route path='/create' component={CreateVote} />
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
