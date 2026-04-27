<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6" class="mx-auto">
                <v-spacer class="my-4"/>
                <h3>Welcome Back!!!!!</h3>
                <p>Login to your account</p>
                <v-form>
                    <v-text-field label="Email" type="email" required v-model="email"></v-text-field>
                    <v-text-field label="Password" type="password" required v-model="password"></v-text-field>
                    <v-btn :loading="loading" color="primary" class="mt-4" block @click="login">Login</v-btn>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>    
<script lang="ts" setup>
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const loading = ref(false);
    const router = useRouter();
    const login = (e) => {
        e.preventDefault();
        const supabase = useSupabaseClient();
        loading.value = true;
        supabase.auth.signInWithPassword({ email: email.value, password: password.value })
        .then(({ data, error }) => {
            loading.value = false;
            if (error) {
                console.error('Login error:', error.message);
                error.value = error.message;
            } else {
                console.log('Login successful:', data);
                router.push('/admin');
            }
        });
    };
</script>