<script setup lang="ts">
const supabase = useSupabaseClient()

const signInWithSlack = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'slack_oidc',
    options: {
      redirectTo: 'http://localhost:3000/home',
    },
  })

  if (error) {
    return console.error('Slack Auth Error:', error)
  }
}
</script>

<template>
  <div class="LogInBody">
    <h1 class="LogInBody__Title">
      LogIn Page
    </h1>
    <button
      class="LogInBody__Button"
      @click="
        signInWithSlack"
    >
      <img
        src="@/assets/img/slack-icon.png"
        alt="Slack のアイコン画像"
        class="LogInBody__Icon"
      >Slack でログイン
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
