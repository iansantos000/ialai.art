<script setup>
// eslint-disable-next-line import/extensions
import { resolveErrorRes } from "@/utils/utils";
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

// Router
const route = useRoute()
const router = useRouter()

// Ability
const ability = useAbility()

const isPasswordVisible = ref(false)
const refVForm = ref()

const isSnackbarVisible = ref(false)
const textSnackbar = ref()

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})


const feedback = ref({
  isVisible: false,
  isText: 'undefined',
  isColor: '',
  isTimeout: '',
})

const form = ref({
  username: '',
  email: '',
  password: '',
  privacyPolicies: false,
  termsConditions: false,
})

const register = () => {
  console.log('Register...')

  const credentials = {
    name: form.value.username,
    email: form.value.email,
    password: form.value.password,
    privacyPolicies: form.value.privacyPolicies,
    termsConditions: form.value.termsConditions,
  }


  // const auth = getAuth();
  // createUserWithEmailAndPassword(auth, email, password)
  //   .then((userCredential) => {
  //     // Signed up 
  //     const user = userCredential.user;
  //     // ...
  //   })
  //   .catch((error) => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // ..
  //   });

  const auth = getAuth()

  createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
    .then(async userCredential => {
      console.log('userCredential: ', userCredential)

      credentials.uid = userCredential.user.uid
      credentials.token =  userCredential.user._lat

      feedback.value.isVisible = true
      feedback.value.isColor = 'sucess'
      feedback.value.isText = 'Cadastrando dados...'
      feedback.value.isTimeout = '2000'
      
      // await cadastraUSer(credentials)

      nextTick(() => {
        router.replace(route.query.to ? String(route.query.to) : '/')
      })

      feedback.value.isVisible = true
      feedback.value.isColor = 'sucess'
      feedback.value.isText = 'Registro realizado com sucesso.'
      feedback.value.isTimeout = '2000'

    }).catch(e => {
      feedback.value.isVisible = true
      feedback.value.isColor = 'error'
      feedback.value.isText = resolveErrorRes(e)
      feedback.value.isTimeout = '2000'
      console.log("eRegister: ", e)
    })
}

// const cadastraUSer = async credentials => {
//   // console.log('credentialsCad: ', credentials)
//   await axios
//     .post("/api/auth/cadastro", credentials)
//     .then(response => {
//       // console.log('responseCadastro: ', response.data)
      
//       const accessToken = credentials.token

//       const userData = {
//         "id": response.data.userData.userId,
//         "fullName": response.data.userData.name,
//         "name": response.data.userData.name,
//         "username": response.data.userData.userName,
//         "avatar": "",
//         "email": response.data.userData.email,
//         "role": response.data.userData.role,
//       }

//       const userAbilityRules = [
//         {
//           action: 'manage',
//           subject: 'all',
//         },
//       ]

//       useCookie('userAbilityRules').value = userAbilityRules
//       ability.update(userAbilityRules)
//       useCookie('userData').value = userData
//       useCookie('accessToken').value = accessToken

//       // console.log('userData: ', userData)
//       // console.log('accessToken: ', accessToken)
//       // console.log('userAbilityRules: ', userAbilityRules)

//     })
//     .catch(e => {
//       console.log("eCadastro: ", e)
//       feedback.value.isVisible = true
//       feedback.value.isColor = 'error'
//       feedback.value.isText = resolveErrorRes(e)
//       feedback.value.isTimeout = '2000'
//     })
// }

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      register()
  })
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-sm-4 pa-md-7 pa-0"
      style="inline-size: 460px;"
    >
      <VCardText>
        <div class="d-flex align-center gap-x-3 justify-center mb-6">
          <RouterLink to="/">
            <VNodeRenderer :nodes="themeConfig.app.logo" />
          </RouterLink>
        </div>

        <h4 class="text-h4 mb-1">
          Bem vindo a All In Guarda Tudo
        </h4>
        <p class="mb-0">
          faça seu registro para acessar sua conta
        </p>
      </VCardText>

      <VCardText>
        <VForm
          ref="refVForm"
          @submit.prevent="onSubmit"
        >
          <VRow>
            <!-- Username -->
            <VCol cols="12">
              <VTextField
                v-model="form.username"
                autofocus
                type="text"
                label="Username" 
                placeholder="Username"
              />
            </VCol>

            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
                placeholder="email@email.com"
                :rules="[requiredValidator, emailValidator]"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                :rules="[requiredValidator]"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <div class="d-flex align-center mt-5 mb-1">
                <VCheckbox
                  id="privacy-policy"
                  v-model="form.privacyPolicies"
                  :rules="[requiredValidator]"
                  inline
                />
                <VLabel
                  for="privacy-policy"
                  style="opacity: 1;"
                >
                  <span class="me-1 text-high-emphasis">Eu aceito as</span>
                  <a
                    href="/politica-de-privacidade"
                    target="_blank"
                    class="text-primary"
                  >política de privacidade</a>
                </VLabel>
              </div>

              <div class="d-flex align-center mt-1 mb-5">
                <VCheckbox
                  id="privacy-policy"
                  v-model="form.termsConditions"
                  :rules="[requiredValidator]"
                  inline
                />
                <VLabel
                  for="privacy-policy"
                  style="opacity: 1;"
                >
                  <span class="me-1 text-high-emphasis">Eu aceito os</span>
                  <a
                    href="/termos-e-condicoes"
                    target="_blank"
                    class="text-primary"
                  > termos e condições </a>
                </VLabel>
              </div>

              <VBtn
                block
                type="submit"
              >
                Registrar
              </VBtn>
            </VCol>
          </VRow>

          <!-- create account -->
          <div class="text-center text-base my-5">
            <span class="d-inline-block">
              já possui uma conta?
            </span>
            <RouterLink
              class="text-primary d-inline-block"
              :to="{ name: 'login' }"
            >
              Em vez disso, faça login
            </RouterLink>
          </div>

          <div class="d-flex align-center mb-5">
            <VDivider />
            <span class="mx-4 text-high-emphasis" />
            <VDivider />
          </div>

          <!-- auth providers -->
          <div class="text-center">
            <!-- <AuthProvider /> -->
          </div>
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
