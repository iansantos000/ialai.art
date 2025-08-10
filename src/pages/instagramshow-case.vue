<template>
  <div class="instagram-showcase-container">
  <!-- Em src/pages/instagramshow-case.vue -->
<div class="d-flex justify-space-between align-center mb-6">
  <h1 class="mb-0">Vitrine de Clientes - Instagram</h1>
  <VBtn :to="{ name: 'instagram-showcase-register' }">
    Cadastrar Novo Cliente
  </VBtn>
</div>

    <h1 class="mb-6">Vitrine de Clientes - Instagram</h1>

    <!-- Itera sobre cada cliente para criar um card de perfil -->
    <v-card
      v-for="client in clients"
      :key="client.id" 
      class="mb-8 profile-card"
      elevation="2"
    >
      <v-card-text>
        <div class="profile-header">
          <v-avatar :image="client.avatar" size="150" class="mr-8"></v-avatar>
          <div class="profile-info">
            <div class="d-flex align-center mb-4">
              <h2 class="text-h5 mr-4">{{ client.username }}</h2>
              <v-btn color="primary" variant="flat" size="small">Seguir</v-btn>
              <v-btn icon="mdi-dots-horizontal" variant="text" size="small" class="ml-2"></v-btn>
            </div>

            <div class="stats mb-4">
              <span><strong>{{ client.stats.posts }}</strong> posts</span>
              <span><strong>{{ client.stats.followers }}</strong> seguidores</span>
              <span><strong>{{ client.stats.following }}</strong> seguindo</span>
            </div>

            <div class="bio">
              <p class="font-weight-bold">{{ client.name }}</p>
              <p>{{ client.bio }}</p>
            </div>
          </div>
        </div>

        <v-divider class="my-6"></v-divider>

        <!-- Grid de Posts -->
        <div class="post-grid">
          <div
            v-for="post in client.posts"
            :key="post.id"
            class="post-item"
          >
            <v-img
              :src="post.imageUrl"
              aspect-ratio="1"
              cover
              class="post-image"
            >
              <div class="post-overlay">
                <div class="overlay-content">
                  <span><v-icon>mdi-heart</v-icon> {{ post.likes }}</span>
                  <span><v-icon>mdi-comment</v-icon> {{ post.comments }}</span>
                </div>
              </div>
            </v-img>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Dados de exemplo (mock data). Em um projeto real, isso viria de uma API.
const clients = ref([
  {
    id: 1,
    name: 'Café Delícia',
    username: 'cafedelicia',
    avatar: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200',
    stats: {
      posts: 188,
      followers: '5.2k',
      following: 310,
    },
    bio: 'O melhor café da cidade. ☕️ Aberto todos os dias das 8h às 20h.',
    posts: [
      { id: 101, imageUrl: 'https://images.unsplash.com/photo-1511920183353-30a5d9b078e3?w=500', likes: 345, comments: 22 },
      { id: 102, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500', likes: 412, comments: 35 },
      { id: 103, imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500', likes: 520, comments: 48 },
      { id: 104, imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500', likes: 280, comments: 19 },
      { id: 105, imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d713b22e8b4?w=500', likes: 630, comments: 77 },
      { id: 106, imageUrl: 'https://images.unsplash.com/photo-1507133750040-4a8f570215de?w=500', likes: 399, comments: 25 },
    ],
  },
  {
    id: 2,
    name: 'Moda Urbana',
    username: 'modaurbana.style',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200',
    stats: {
      posts: 450,
      followers: '22.7k',
      following: 150,
    },
    bio: 'As últimas tendências da moda de rua. #streetstyle #fashion',
    posts: [
      { id: 201, imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500', likes: 1023, comments: 88 },
      { id: 202, imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500', likes: 2340, comments: 150 },
      { id: 203, imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500', likes: 1890, comments: 121 },
      { id: 204, imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500', likes: 987, comments: 65 },
      { id: 205, imageUrl: 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?w=500', likes: 1543, comments: 99 },
      { id: 206, imageUrl: 'https://images.unsplash.com/photo-1521577352947-f450035810d0?w=500', likes: 1123, comments: 76 },
    ],
  },
]);
</script>

<style scoped>
.profile-card {
  overflow: hidden;
}

.profile-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.profile-info {
  flex-grow: 1;
}

.stats {
  display: flex;
  font-size: 1rem;
  gap: 2rem;
}

.bio p {
  margin: 0;
  line-height: 1.4;
}

.post-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.post-item {
  position: relative;
  cursor: pointer;
}

.post-overlay {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 40%);
  color: white;
  font-size: 1.2rem;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.post-item:hover .post-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  gap: 1.5rem;
}

/* Media queries para responsividade */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-header .v-avatar {
    margin-block-end: 1rem;
    margin-inline-end: 0;
  }

  .profile-info .d-flex {
    justify-content: center;
  }

  .stats {
    justify-content: center;
    gap: 1.5rem;
  }

  .post-grid {
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
