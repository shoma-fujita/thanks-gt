<script setup lang="ts">
const supabase = useSupabaseClient()

const signInWithSlack = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'slack_oidc',
  })

  if (error) {
    return console.error('Slack Auth Error:', error)
  }
}
</script>

<template>
  <div class="AppHeader">
    <div class="AppHeader__Heading">
      <img
        src="@/assets/img/app-icon.jpg"
        class="AppHeader__ApplicationImage"
        alt="アプリケーションの画像"
      >
      <NuxtLink
        to="/home"
        class="AppHeader__Link"
      >
        Thanks GT
      </NuxtLink>
    </div>
    <button
      class="AppHeader__Button"
      @click="
        signInWithSlack"
    >
      <img
        src="@/assets/img/slack-icon.png"
        alt="Slack のアイコン画像"
        class="AppHeader__SlackImage"
      >Slack でログイン
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
