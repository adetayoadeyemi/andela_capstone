<template>
    <nuxt-layout name="admin" title="Messages">
        <v-data-table :headers="headers" :items="messages" class="elevation-1">
            <template v-slot:item.sn="{ item,index }">{{ index + 1 }}</template>
            <template v-slot:item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
            <template v-slot:item.user_id="{ item }">{{ getUserPhone(item.user_id) }}</template>
        </v-data-table>
    </nuxt-layout>
    
</template>
<script lang="ts" setup>

    const headers = [
        { title: 'S/N', value: 'sn' },
        { title: 'Created At', value: 'created_at' },
        { title: 'Created By', value: 'user_id' },
        { title: 'Body', value: 'body' },
    ]

    const messages = ref([]);

    const supabase = useSupabaseClient();
    const loadMessages = async () => {
        const { data, error } = await supabase.from('messages').select('*');
        if (error) {
            console.error('Error fetching messages:', error.message);
        } else {
            console.log('Messages fetched successfully:', data);
            messages.value = data;
        }
    };
    //
    onMounted(() => {
        loadMessages();
    });

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
    const getUserPhone = (userId: string) => {
        const user = users.value.find((u: any) => u.id === userId);
        return user ? user.phone_number : 'N/A';
    }

    const formatDate = (date: Date) => {
        if(!date) return useDateFormat(new Date(), 'YYYY-MM-DD, HH:mm:ss');
        return useDateFormat(date, 'YYYY-MM-DD, HH:mm:ss');
    }
</script>