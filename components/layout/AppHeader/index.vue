<template>
  <div class="AppHeader">
    <div class="AppHeader__Heading">
      <img
        src="@/assets/img/app-icon.jpg"
        class="AppHeader__Image"
        alt="ログイン中のユーザーのプロフィール画像"
      >
      <NuxtLink
        to="/home"
        class="AppHeader__Link"
      >
        Thanks GT
      </NuxtLink>
    </div>
    <p class="AppHeader__Item">
      user
    </p>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
