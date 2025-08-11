<script setup>
import { resolveErrorRes } from "@/utils/utils"
import miscMaskDark from '@images/misc/misc-mask-dark.png'
import miscMaskLight from '@images/misc/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { getAuth, sendPasswordResetEmail } from "firebase/auth"


const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const auth = getAuth()

const feedback = ref({
  isVisible: false,
  isText: 'undefined',
  isColor: '',
  isTimeout: '',
})

const form = ref({ email: '' })

const refVForm = ref()

const ressetPassword = () => {
  console.log('ressetPassword...', form.value.email)

  sendPasswordResetEmail(auth, form.value.email)
    .then(function(result) {
      feedback.value.isVisible = true
      feedback.value.isColor = 'success'
      feedback.value.isText = 'e-mail de recuperação enviado!'
      feedback.value.isTimeout = '2000'
    }).catch(function(e) {
    // Handle error.
      // console.log("error...SendPasswordResetEmail.", error)
      feedback.value.isVisible = true
      feedback.value.isColor = 'error'
      feedback.value.isText = resolveErrorRes(e)
      feedback.value.isTimeout = '2000'
    })  
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      ressetPassword()
  })
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-sm-4 pa-md-7 pa-0"
      max-width="460"
    >
      <VCardText>
        <div class="d-flex align-center gap-x-3 justify-center mb-6">
          <RouterLink to="/">
            <VNodeRenderer :nodes="themeConfig.app.logo" />
          </RouterLink>

          <h1 class="auth-title">
            {{ themeConfig.app.title }}
          </h1>
        </div>

        <h4 class="text-h4 mb-1 text-center">
          Esqueceu sua senha?
        </h4>
        <p class="mb-0">
          Digite seu e-mail e enviaremos instruções para redefinir sua senha
        </p>
      </VCardText>

      <VCardText>
        <VForm
          ref="refVForm"
          @submit.prevent="onSubmit"
        >
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                :rules="[requiredValidator, emailValidator]"
                autofocus
                label="Email"
                type="email"
                placeholder="email@email.com"
              />
            </VCol>

            <!-- reset password -->
            <VCol cols="12">
              <VBtn
                block
                type="submit"
              >
                Enviar link de resset
              </VBtn>
            </VCol>

            <!-- back to login -->
            <VCol cols="12">
              <RouterLink
                class="d-flex align-center justify-center"
                :to="{ name: 'login' }"
              >
                <VIcon
                  icon="ri-arrow-left-s-line"
                  size="20"
                  class="flip-in-rtl me-2"
                />
                <span>Voltar para login</span>
              </RouterLink>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
    <div class="text-center">
      <VSnackbar
        v-model="feedback.isVisible"
        :color="feedback.isColor"
        timeout="2000"
        multi-line
      >
        {{ feedback.isText }}
        <template #actions>
          <VBtn
            color="red"
            variant="text"
            @click="feedback.isVisible = false"
          >
            Fechar
          </VBtn>
        </template>
      </VSnackbar>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
