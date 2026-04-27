<template>
    <nuxt-layout name="admin" title="Users">
        <v-data-table :headers="headers" :items="users" class="elevation-1">
            <template v-slot:item.sn="{ item,index }">{{ index + 1 }}</template>
            <template v-slot:item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
        </v-data-table>
    </nuxt-layout>
    
</template>
<script lang="ts" setup>

    const headers = [
        { title: 'S/N', value: 'sn' },
        { title: 'Created At', value: 'created_at' },
        { title: 'Phone Number', value: 'phone_number' },
    ]

    const supabase = useSupabaseClient();

    const users = ref([]);
    const loadUsers = async () => {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
            console.error('Error fetching users:', error.message);
        } else {
            console.log('Users fetched successfully:', data);
            users.value = data;
        }
    };
    onMounted(() => {
        loadUsers();
    });

    const formatDate = (date: Date) => {
        if(!date) return useDateFormat(new Date(), 'YYYY-MM-DD, HH:mm:ss');
        return useDateFormat(date, 'YYYY-MM-DD, HH:mm:ss');
    }
</script>