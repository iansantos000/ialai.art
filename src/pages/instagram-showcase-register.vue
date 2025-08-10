<template>
  <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow no-gutters class="auth-wrapper">
    <VCol md="8" class="d-none d-md-flex position-relative">
      <div class="d-flex align-center justify-end w-100 h-100 pa-10 pe-0">
        <VImg max-width="797" :src="authThemeImg" class="auth-illustration" />
      </div>
      <VImg :src="tree1" alt="tree image" height="190" width="90" class="auth-footer-tree" />
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface));">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>ö
          <h4 class="text-h4 mb-1">
            Cadastrar Novo Cliente 🚀
          </h4>
          <p class="mb-0">
            Preencha os dados para adicionar um novo perfil à vitrine.
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="handleSubmit">

            <VRow>
              <!-- Nome Completo -->
              <VCol cols="12">
                <VTextField v-model="form.name" autofocus label="Nome Completo" placeholder="Café Delícia"
                  :rules="[requiredValidator]" />
              </VCol>

              <!-- Nome de Usuário -->
              <VCol cols="12">
                <VTextField v-model="form.username" label="Nome de Usuário" placeholder="cafedelicia"
                  :rules="[requiredValidator]" />
              </VCol>

              <!-- URL do Avatar -->
              <VCol cols="12">
                <VTextField v-model="form.avatar" label="URL do Avatar" placeholder="https://example.com/avatar.png"
                  hint="Opcional. Use uma URL de imagem pública." />
              </VCol>

              <!-- Biografia -->
              <VCol cols="12">
                <VTextarea v-model="form.bio" label="Biografia" rows="3" placeholder="O melhor café da cidade." />
              </VCol>

              <!-- Botão de Cadastro -->
              <VCol cols="12">
                <VBtn block type="submit">
                  Cadastrar Cliente
                </VBtn>
              </VCol>

              <!-- Voltar para a Vitrine -->
              <VCol cols="12" class="text-center">
                <RouterLink class="text-primary d-inline-block" :to="{ name: 'instagramshow-case' }">
                  <VIcon icon="ri-arrow-left-s-line" class="flip-in-rtl" />
                  <span class="d-inline-block">Voltar para a Vitrine</span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
<script setup>
import tree1 from '@images/misc/tree1.png'
import authV2RegisterIllustrationBorderedDark from '@images/pages/auth-v2-register-illustration-bordered-dark.png'
import authV2RegisterIllustrationBorderedLight from '@images/pages/auth-v2-register-illustration-bordered-light.png'
import authV2RegisterIllustrationDark from '@images/pages/auth-v2-register-illustration-dark.png'
import authV2RegisterIllustrationLight from '@images/pages/auth-v2-register-illustration-light.png'
import authV2MaskDark from '@images/pages/mask-v2-dark.png'
import authV2MaskLight from '@images/pages/mask-v2-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Roteamento baseado em arquivos. Esta página será /instagram-showcase-register
definePage({
  meta: {
    layout: 'blank',
    // Você pode adicionar regras de autenticação aqui depois
  },
})

const authThemeImg = useGenerateImageVariant(authV2RegisterIllustrationLight, authV2RegisterIllustrationDark, authV2RegisterIllustrationBorderedLight, authV2RegisterIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const router = useRouter()

const form = ref({
  name: '',
  username: '',
  avatar: '',
  bio: '',
})

const refVForm = ref()

// Validador simples para campos obrigatórios
const requiredValidator = value => !!value || 'Este campo é obrigatório'

const handleSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      // Em uma aplicação real, você enviaria os dados para uma API
      console.log('Dados do formulário:', form.value)

      // Para demonstração, exibimos um alerta e redirecionamos
      alert('Cliente cadastrado com sucesso! (Verifique o console do navegador)')
      router.push({ name: 'instagramshow-case' }) // Redireciona para a vitrine
    }
  })
}
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth"
</style>class=class=class=class=class=class=class=class=class=class=class=class=
