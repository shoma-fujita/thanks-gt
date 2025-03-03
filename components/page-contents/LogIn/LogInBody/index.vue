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
    <div class="LogInBody__Container">
      <div class="LogInBody__Head">
        <h1 class="LogInBody__Title">
          Thanks GT へようこそ！
        </h1>
        <p class="LogInBody__Description">
          Slack アカウントでログインしてください
        </p>
      </div>
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
      <p>Slack アカウントをお持ちでない場合は、<NuxtLink to="https://slack.com/get-started#/createnew">こちら</NuxtLink></p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>
