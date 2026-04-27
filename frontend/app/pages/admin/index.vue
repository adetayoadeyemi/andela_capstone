<template>
    <nuxt-layout name="admin" title="Shopping List">
        <v-data-table :headers="headers" :items="shoppingList" class="elevation-1">
            <template v-slot:item.sn="{ item,index }">{{ index + 1 }}</template>
            <template v-slot:item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
            <template v-slot:item.user_id="{ item }">{{ getUserPhone(item.user_id) }}</template>
            <template v-slot:item.action="{ item }">
                <v-btn color="primary" @click="viewDetails(item)">View Details</v-btn>
            </template>
            
        </v-data-table>
        <v-dialog v-model="detailsDialog" max-width="500px">
            <v-card>
                <v-card-title class="headline">Shopping List Details</v-card-title>
                <v-card-text>
                    <p><strong>Name:</strong> {{ selectedList.name }}</p>
                    <p><strong>Created At:</strong> {{ formatDate(selectedList.created_at) }}</p>

                    <v-divider class="my-4"></v-divider>

                    <v-data-table :headers="shoppingListItemsHeaders" :items="shoppingListItems" class="elevation-1">
                        <template v-slot:item.sn="{ item,index }">{{ index + 1 }}</template>
                    </v-data-table>
                    <!-- Add more details as needed -->
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="detailsDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </nuxt-layout>
    
</template>
<script lang="ts" setup>

    const headers = [
        { title: 'S/N', value: 'sn' },
        { title: 'Created At', value: 'created_at' },
        { title: 'Created By', value: 'user_id' },
        { title: 'Name', value: 'name' },
        { title: 'Action', value: 'action' },
    ]

    const shoppingListItemsHeaders = [
        { title: 'S/N', value: 'sn' },
        { title: 'Name', value: 'product_name' },
        { title: 'Unit', value: 'unit' },
    ]

    const supabase = useSupabaseClient();

    const shoppingList = ref([]);

    const loadShoppingLists = async () => {
        const { data, error } = await supabase.from('shopping_lists').select('*');
        if (error) {
            console.error('Error fetching shopping lists:', error.message);
        } else {
            console.log('Shopping lists fetched successfully:', data);
            shoppingList.value = data;
        }
    };
    //
    onMounted(() => {
        loadShoppingLists();
    });

    const selectedList = ref({});
    const shoppingListItems = ref([]);

    const detailsDialog = ref(false);
    const viewDetails = (passedList: any) => {
        detailsDialog.value = true;
        selectedList.value = passedList;
        shoppingListItems.value = [];
        const supabase = useSupabaseClient();
        supabase.from('shopping_list_items').select('*')
        .eq('shopping_list_id', passedList.id)
        .then(({ data, error }) => {
            if (error) {
                console.error('Error fetching shopping lists:', error.message);
            } else {
                console.log('Shopping list items fetched successfully:', data);
                shoppingListItems.value = data;
            }
        });
    }

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