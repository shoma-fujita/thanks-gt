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
    <h1>LogIn Page</h1>
    <button
      @click="signInWithSlack"
    >
      Slack でログイン
    </button>
  </div>
</template>
