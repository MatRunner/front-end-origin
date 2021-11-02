<template>
  <div class='homebox'>
  <el-container>
    <el-header></el-header>
    <el-container>
    <el-aside>
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              router>
              <el-menu-item index="download">
                <i class="el-icon-download"></i>
                  <span slot="title">正在下载</span>
              </el-menu-item>
              <el-menu-item index="completed">
                <i class="el-icon-check"></i>
                <span slot="title">已完成</span>
              </el-menu-item>
              <el-menu-item index="recycle">
                <i class="el-icon-delete"></i>
                <span slot="title">回收站</span>
              </el-menu-item>
              <el-menu-item index="settings">
                <i class="el-icon-setting"></i>
                <span slot="title">设置</span>
              </el-menu-item>
            </el-menu>
      </el-aside>
    <el-container>
    <el-main>
      <keep-alive include="download">
      <router-view></router-view>
      </keep-alive>
    </el-main>
    <el-footer>
      <view-footer></view-footer>
    </el-footer>
    </el-container>
    </el-container>
  </el-container>
  </div>
</template>

<script>
import Footer from './views/Footer.vue'
export default {
  data() {
    return{}
  },
  components:{
    'view-footer':Footer,
  },
methods: {
  
    },
}
</script>
<style lang="less">
  html,body,.homebox,.el-container{
    height:100%;
    padding:0;
    margin:0;
  }
  .el-header{
    height:100px;
    border:1px solid;
  }
  .el-aside{
    height:100%;
    background-color:#545c64;
  }
</style>
