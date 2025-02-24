<script setup lang="ts">
const supabase = useSupabaseClient()
const config = useRuntimeConfig()

const signInWithSlack = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'slack_oidc',
    options: {
      redirectTo: config.public.supabaseRedirectUrl as string,
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
      ログイン画面
    </h1>
    <button
      class="LogInBody__Button"
      @click="
        signInWithSlack"
    >
      <img
        src="@/assets/img/slack-icon.png"
        alt="Slack のアイコン画像"
        class="LogInBody__Image"
      >Slack でログイン
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
