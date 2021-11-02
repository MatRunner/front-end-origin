<template>
<div>
  <el-row>
    <el-col :span="16"><div class="grid-content"><el-button type="primary" size="mini" @click="open">新建任务</el-button></div></el-col>
    <el-col :span="8">
      <div class="grid-content">
      <el-button type="success" plain round size="mini" @click="unpauseAll">全部开始</el-button>
      <el-button type="warning" plain round size="mini" @click="pauseAll">全部暂停</el-button>
      <el-button type="danger" plain round size="mini" @click="forceRemoveAll">全部取消</el-button>
      </div>
    </el-col>
  </el-row>
  <el-table
    :data="files"
    style="width: 100%"
    empty-text="暂无下载任务">
    <el-table-column
      prop="files[0].path"
      label="文件">
    </el-table-column>
    <el-table-column
      prop="totalLength"
      label="大小">
    </el-table-column>
    <el-table-column
      label="进度">
      <template slot-scope="scope">
        <el-progress v-if="scope.row.status=='paused'" :percentage="scope.row.completedRatio" status="warning"></el-progress>
        <el-progress v-else :percentage="scope.row.completedRatio"></el-progress>
      </template>
    </el-table-column>
    <el-table-column
      prop="currentSpeed"
      label="速度">
    </el-table-column>
    <el-table-column>
      <template slot-scope="scope">
        <el-button
          size="mini"
          icon='el-icon-caret-right'
          circle
          @click="handlePause(scope.$index, scope.row)"></el-button>
        <el-button
          size="mini"
          type="danger"
          icon='el-icon-close'
          circle
          @click="handleDelete(scope.$index, scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>
 <script>
 
    export default {
      name:'download',
      data() {
        return {
          tasks:[],
          intervalId:null,
        }
      },
      computed:{
        files(){
          return this.tasks.filter(it=>{
            return it.status=='paused'||it.status=='active'
          }).map(it=>{
            //该文件名
            let fullpath=it.files[0].path
            let ary=fullpath.split('/')
            it.files[0].path=ary[ary.length-1]
            //改文件大小
            let length=it.totalLength
            if(length<1024){
              it.totalLength=length+'B'
            }else if(length<1024*1024){
              it.totalLength=Math.ceil(length/1024)+'KB'
            }else if(length<1024**3){
              it.totalLength=Math.ceil(length/1024/1024)+'MB'
            }else{
              it.totalLength=Math.ceil(length/1024/1024/1024)+'GB'
            }
            //改完成进度
            let completedRatio=Math.floor(it.completedLength/length*100)
            it.completedRatio= (isNaN(completedRatio)?0:completedRatio)
            //改下载速度
            let speed=it.downloadSpeed
            if(speed<1024){
              it.currentSpeed=speed+'B/S'
            }else if(speed<1024**2){
              it.currentSpeed=Math.ceil(speed/1024)+'KB/S'
            }else if(speed<1024**3){
              it.currentSpeed=Math.ceil(speed/1024/1024)+'MB/S'
            }
            return it
          })
        }
      },
      methods:{
        pauseAll(){
          this.$store.state.aria2.pauseAll()
          this.updatePage()
        },
        unpauseAll(){
          this.$store.state.aria2.unpauseAll()
          this.updatePage()
        },
        forceRemoveAll(){
           this.$confirm('是否终止所有任务并放入回收站？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '放弃'
        })
          .then(() => {
            this.files.forEach(it=>{
              this.$store.state.aria2.remove(it.gid)
            })
            this.$message({
              type: 'info',
              message: '正在取消'
            });
          })
          .catch(() => {
          });
        },
        async handlePause(idx,row){
          let gid=row.gid
          let state=await this.$store.state.aria2.tellStatus(gid)
          if(state.status=='paused'){
            this.$store.state.aria2.unpause(gid)
          }
          if(state.status=='active'){
            this.$store.state.aria2.pause(gid)
          }
        },
        handleDelete(idx,row){
          let gid=row.gid
          this.$store.state.aria2.remove(gid)
        },
        open() {
        this.$prompt('请输入链接', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async ({value})=>{
          let url=value.trim()
          return this.$store.state.aria2.addUri([url])
        }).then(gid=>{
          console.log('time')
          this.$store.commit('recordTime',gid)
          return this.$store.state.aria2.tellStatus(gid)
        }).then(state=>{
          this.tasks.push(state)
        }).then( ()=> {
          this.$message({
            type: 'success',
            message: '开始下载'
          });
        }).catch((e) => {
          console.log(e)
          if(e=='cancel'){
            this.$message({
              type:'info',
              message:'取消',
            })
          }else{
            this.$message({
              type: 'error',
              message: '链接无效',
            });       
          }
        });
      },
      async updatePage(){
        this.tasks=await Promise.all(this.tasks.map(item=>item.gid).map(gid=>{
            return this.$store.state.aria2.tellStatus(gid)
          }))
        },
      },
      mounted(){
        this.$nextTick(async ()=>{
          //首次更新任务
          let active= await this.$store.state.aria2.tellActive()
          let waiting=await this.$store.state.aria2.tellWaiting(0,10)//先限制10个吧
          waiting.forEach(item=>{
            for(let i=0;i<this.tasks.length;i++){
              if(item.gid==this.tasks[i].gid){
                this.tasks.splice(i,1,item)
                return
              }
            }
            this.tasks.push(item)
          })
          active.forEach(item=>{
            for(let i=0;i<this.tasks.length;i++){
              if(item.gid==this.tasks[i].gid){
                this.tasks.splice(i,1,item)
                return
              }
            }
            this.tasks.push(item)
          })
        })
        this.intervalId=setInterval(async ()=>{
          this.tasks=await Promise.all(this.tasks.map(item=>item.gid).map(gid=>{
            return this.$store.state.aria2.tellStatus(gid)
          }))          
        },3000)
      },
      beforeDestroy(){//keep-alive了所以这里意义不大啊
        clearInterval(this.intervalId)
      }
    }
  </script>

  <style scoped>
    .grid-content{
      min-height: 20px;
    }
  </style>