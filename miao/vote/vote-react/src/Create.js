import {Link} from 'react-router-dom'
export default function Create(){
  return (
    <div>
      <section>
        <Link to="/create">创建单选</Link>
      </section>
      <section>
        <Link to="/create?multiple=1">创建多选</Link>
      </section>
    </div>
  )
}