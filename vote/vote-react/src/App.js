import './App.css';
import {Switch,Route,HashRouter,Redirect} from 'react-router-dom'
import Login from './Login'
import Main from './Main'
import ViewVote from './ViewVote'
import CreateVote from './CreateVote'
import AntdRegister from './AntdRegister'
import MeinianAcquisitionToolsHome from './test';
import 'antd/dist/antd.css';
function App() {
  return (
    <HashRouter>
      <div className="App">
        <Switch>
          <Route path='/' exact>
            <Redirect to="/test"/>
          </Route>
          <Route path='/login' component={Login} />
          <Route path='/register' component={AntdRegister} />
          <Route path='/main' component={Main} />
          <Route path='/vote/:id' component={ViewVote} />
          <Route path='/create' component={CreateVote} />
          <Route path='/test' component={MeinianAcquisitionToolsHome} />
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
