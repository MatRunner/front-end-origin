<template>
<div>
  <el-table
    :data="files"
    style="width: 100%"
    empty-text="暂无已完成任务">
    <el-table-column
      prop="files[0].path"
      label="文件">
    </el-table-column>
    <el-table-column
      prop="totalLength"
      label="大小">
    </el-table-column>
    <el-table-column
      prop="timeStamp"
      label="时间">
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
      name:'completed',
      data() {
        return {
          tasks:[],
        }
      },
      computed:{
        files(){
          return this.tasks.map(it=>{
            //改文件名
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
            //挂时间戳
            it.timeStamp=this.$store.state.timeStamp[it.gid]
            return it
          })
        }
      },
      methods:{
        pauseAll(){
          this.$store.state.aria2.pauseAll()
        },
        unpauseAll(){
          this.$store.state.aria2.unpauseAll()
        },
        forceRemoveAll(){
          this.$store.state.aria2.forceRemoveAll()
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
          this.$store.state.aria2.forceRemove(gid)
        },
        open() {
        this.$prompt('请输入链接', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async ({value})=>{
          let url=value.trim()
          let gid=await this.$store.state.aria2.addUri([url])
          let state=await this.$store.state.aria2.tellStatus(gid)
          if(state.completedLength==0){
            throw new Error()
          }else{
            return value
          }
        }).then( ()=> {
          this.$message({
            type: 'success',
            message: '开始下载'
          });
        }).catch((e) => {
          if(e=='cancel'){
            this.$message({
              type:'info',
              message:'取消',
            })
          }
          if(e.code==1){
            this.$message({
              type: 'error',
              message: '链接无效',
            });       
          }
        });
      }
      },
      async mounted(){
        let files=await this.$store.state.aria2.tellStopped(0,99)
        this.tasks=files.filter(item=>item.status=='complete')
      }
    }
  </script>

  <style scoped>
    .grid-content{
      min-height: 20px;
    }
  </style>