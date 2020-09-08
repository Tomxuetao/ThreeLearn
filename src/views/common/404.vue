<template>
  <div class="site-wrapper site-page--not-found">
    <div class="site-content__wrapper">
      <div class="site-content">
        <h2 class="not-found-title">404</h2>
        <p class="not-found-desc">抱歉！您访问的页面<em>失联</em>啦 ...</p>
        <el-button @click="$router.go(-1)">返回上一页</el-button>
        <el-button type="primary" class="not-found-btn-gohome" @click="$router.push({ name: 'home' })">进入首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scope>
@import '~@scss/modules/sys/404.scss';
</style>
