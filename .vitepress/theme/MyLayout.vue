<script setup>
import DefaultTheme from "vitepress/theme";

const { Layout } = DefaultTheme;
</script>

<template>
    <Layout>
        <template #home-hero-info>
            <div class="hero-info">
                <h1 class="hero-title">
                    <img src="/logo.png" alt="Picturium Logo" />
                </h1>
                <p class="hero-description">Image delivery, <br />reimagined</p>
            </div>
        </template>
    </Layout>
</template>
