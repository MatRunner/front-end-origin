import { Link,Route,Redirect } from "react-router-dom";
import Create from './Create'
import MyVotes from './MyVotes'

export default function Main(){
  
  return(
    <div>
      <Route path="/main" exact>
        <Redirect to="/main/create"/>
      </Route>
      <Route path='/main/create' component={Create}/>
      <Route path='/main/myvotes' component={MyVotes}/>
      <nav>
      <Link to="/main/create">新建</Link>
      {'|'}
      <Link to="/main/myvotes">我的</Link>
      </nav>
    </div>
  )
}