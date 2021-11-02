<template>
  <el-row :gutter="20">
    <el-col :span="6"><div class="grid-content">正在进行{{active}}个任务</div></el-col>
    <el-col :span="6"><div class="grid-content">{{waiting}}个任务待执行</div></el-col>
    <el-col :span="6"><div class="grid-content">全局下载速度：{{downloadSpeed}}</div></el-col>
    <el-col :span="6"><div class="grid-content">全局上传速度：{{uploadSpeed}}</div></el-col>
  </el-row>
</template>

<script>
export default {
  name:'view-footer',
  data() {
    return{
      download:0,
      upload:0,
      active:0,
      waiting:0,
      intervalId:null,
    }
  },
  computed:{
    downloadSpeed(){
      if(this.download<1024){
        return this.download+'B/S'
      }else if(this.download<1024**2){
        return Math.ceil(this.download/1024)+'KB/S'
      }else if(this.download<1024**3){
        return Math.ceil(this.download/1024/1024)+'MB/S'
      }else{
        return null
      }
    },
    uploadSpeed(){
      if(this.upload<1024){
        return this.upload+'B/S'
      }else if(this.upload<1024**2){
        return Math.ceil(this.upload/1024)+'KB/S'
      }else if(this.upload<1024**3){
        return Math.ceil(this.upload/1024/1024)+'MB/S'
      }else{
        return null
      }
    },
  },
  mounted(){
    this.intervalId=setInterval(async ()=>{
      let state=await this.$store.state.aria2.getGlobalStat()
      this.download=state.downloadSpeed
      this.upload=state.uploadSpeed
      this.active=state.numActive
      this.waiting=state.numWaiting
    },3000)
  },
  beforeDestroy(){
    clearInterval(this.intervalId)
  }
}
</script>
<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    font-size:13px;
    vertical-align: middle;
}
</style>