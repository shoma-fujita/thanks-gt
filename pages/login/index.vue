<script setup lang="ts">
const supabase = useSupabaseClient()

const signInWithSlack = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'slack_oidc',
    options: {
      redirectTo: '/home',
    },
  })

  if (error) {
    return console.error('Slack Auth Error:', error)
  }
}
</script>

<template>
  <div class="Login">
    <h1>login Page</h1>
    <button
      @click="signInWithSlack"
    >
      Slackでログイン
    </button>
  </div>
</template>
