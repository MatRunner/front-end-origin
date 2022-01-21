import './Picture.css'
export default function Picture(props){
  let className1=props.multiple?'':'sinpicturein'
  let className2=props.multiple?'multipicturein':''
  return(
    <div className='mypicture'>
      <p className={'mypicturein'}/>
      <p className={'mypicturein '+className2}/>
      <p className={'mypicturein '+className1}/>
      <p className={'mypicturein '+className2}/>
    </div>  
  )
}