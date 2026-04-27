<template>
    <v-layout>
        <v-navigation-drawer app>
            <v-toolbar flat>
                <v-toolbar-title>Shoppers</v-toolbar-title>
            </v-toolbar>
            <v-list>
                <v-list-item  icon="mdi-view-dashboard" title="Shopping Lists" to="/admin"/>
                <v-list-item  icon="mdi-view-dashboard" title="Messages" to="/admin/messages"/>
                <v-list-item  icon="mdi-view-dashboard" title="Users" to="/admin/users"/>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <v-toolbar app>
                <v-toolbar-title>{{ props.title }}</v-toolbar-title>
            </v-toolbar>
            <slot />
        </v-main>
    </v-layout>
</template>
<script lang="ts" setup>
    const props = withDefaults(defineProps<{
        title?: string
    }>(), {
        title: 'Admin Dashboard'
    });
</script>