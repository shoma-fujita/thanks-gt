<script setup>
const supabase = useSupabaseClient()

const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: '/home',
    },
  })

  if (error) {
    return console.error('Google Auth Error:', error)
  }
}
</script>

<template>
  <div class="Login">
    <h1>login Page</h1>
    <button
      @click="signInWithGoogle"
    >
      Googleでログイン
    </button>
  </div>
</template>
