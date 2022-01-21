import { Link } from 'react-router-dom'
import { Button } from 'antd'
import { useState } from 'react'

const Introduction_Text1 = {
  title: '快速采集网页上的图片',
  content: ['支持批量识别页面中的所有图片一键采集', '支持单张图片右键采集', '支持快速截图采集']
}
const Introduction_Text2 = {
  title: '快速筛选你想要的图片',
  content: ['支持尺寸筛选', '特定网站优化显示']
}

function MeinianAcquisitionToolsHome() {
  const video1 = [{
    src: 'src/video/VID_20211215_205317',
    type: 'video/mp4',
  }, {
    src: 'src/video/VID_20211215_205330',
    type: 'video/mp4',
  }, {
    src: 'src/video/VID_20211215_205340',
    type: 'video/mp4',
  }]
  const video2 = [{
    src: 'src/video/VID_20211215_205317',
    type: 'video/mp4',
  }, {
    src: 'src/video/VID_20211215_205330',
    type: 'video/mp4',
  }, {
    src: 'src/video/VID_20211215_205340',
    type: 'video/mp4',
  }]
  let [activeVideo1, setAvtiveVideo1] = useState(video1[1])
  let [activeVideo2, setAvtiveVideo2]
    = useState(video2[1])
  let switchVideo = (order, idx) => {
    if (order === 1) {
      setAvtiveVideo1(video1[idx])
    }
    if (order === 2) {
      setAvtiveVideo2(video2[idx])
    }
  }

  return (<>
    <main className="meinian-acquisition-tools-home">
      <section className="introduction">
        <div>
          <Link to="">返回美念</Link>
          <Link to="">安装说明</Link>
          <Link to="">使用教程</Link>
        </div>
        <div>
          <div>美念采集工具<span>v1.0.0</span></div>
          <div>逛网站的时候看到好看的样式，随时随地采集到美念里，灵感不丢失。</div>
          <Button>下载浏览器拓展</Button>
          <div>当前支持浏览器（理论上支持所有Chromlum内核浏览器</div>
          <div>
            <span>Chrome</span>
            <span>QQ浏览器</span>
            <span>搜狗浏览器</span>
            <span>Edge</span>
          </div>
        </div>
      </section>
      <section className="details">
        <div>
          <video controls>
            <source src={activeVideo1.src} type={activeVideo1.type} />
          </video>
          <div>
            <p>{Introduction_Text1.title}</p>
            {Introduction_Text1.content.map((it, idx) => <Button onClick={switchVideo(1, idx)}>{it}</Button>)}
          </div>
        </div>
        <div>
          <video controls>
            <source src={activeVideo2.src} type={activeVideo2.type} />
          </video>
          <div>
            <p>{Introduction_Text2.title}</p>
            {Introduction_Text2.content.map((it, idx) => <Button onClick={switchVideo(2, idx)}>{it}</Button>)}
          </div>
        </div>
      </section>
    </main>
  </>)
}
export default MeinianAcquisitionToolsHome