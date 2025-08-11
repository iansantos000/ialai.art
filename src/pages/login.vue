<script setup>
import axios from "@/services/api"
import { resolveErrorRes } from "@/utils/utils"
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from "@themeConfig"
import { browserSessionPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from "firebase/auth"
import { VForm } from 'vuetify/components/VForm'


definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const auth = getAuth()


const loadingBtn = ref(false)
const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const ability = useAbility()

const feedback = ref({
  isVisible: false,
  isText: 'undefined',
  isColor: '',
  isTimeout: '',
})

const errors = ref({
  email: undefined,
  password: undefined,
})

const refVForm = ref()

const form = ref({
  email: '',
  password: '',
})

const rememberMe = ref(false)


const persistentAuth = () => {
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return login()
    })
    .catch(error => {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
    })
}

const login = () => {
  // console.log('Login...',)

  loadingBtn.value = true

  signInWithEmailAndPassword(auth, form.value.email, form.value.password)
    .then(async userCredential => {

      console.log("LoginOn... ", userCredential)

      useCookie('accessToken').value = userCredential.user._lat  

      let userDataLogin = {
        "lastSignInTime": userCredential.user.metadata.lastSignInTime,
        "emailVerified": userCredential.user.emailVerified,
        "email": userCredential.user.email,
      }
      
      
      
      await fetchUsers(userCredential._tokenResponse.idToken, userDataLogin, userCredential.user.uid )

      feedback.value.isVisible = true
      feedback.value.isColor = 'sucess'
      feedback.value.isText = 'Localizamos seus dados...'
      feedback.value.isTimeout = '2000'

    })
    .catch(error => {
      var errorCode = error.code
      var errorMessage = error.message
      console.log("eLogin: ", error)
      feedback.value.isVisible = true
      feedback.value.isColor = 'error'
      feedback.value.isText = resolveErrorRes(error)
      feedback.value.isTimeout = '2000'
      loadingBtn.value = false
    })
}

const fetchUsers = async (token, userDataLogin, uid) => {

  await axios.interceptors.request.use(config => {
    if (token) {
      // config.headers = config.headers || {}
      console.log('axios.token on...')
      config.headers.token = token
    } else {
      console.log('axios.token OFF...')
    }

    return config
  }) 

  const resFetch = await axios
    .get("/api/auth/user/" + uid)
    .then(response => {
      //JSON responses are automatically parsed.

      // console.log('response.data: ', typeof response.data, uid, response)
      if(response.data == null) {
        let userData = {
          "uid": uid,
          "name": '',
          "username": '',
          "email": userDataLogin.email,
          "role": false,
        }
        cadastraUSer(userData, token)
      } else {
        console.log('UserDataFetch-else: ', uid)
        let userData = {
          "id": response.data._id ?  response.data._id : uid,
          "name": response.data.nome ? response.data.nome : 'John Doe',
          "username": response.data.userName ? response.data.userName : 'johndoe',
          "email": response.data.email ? response.data.email : 'admin@demo.com',
          "role": response.data.role,
        }       
        
        const userAbilityRules = [
          {
            action: 'manage',
            subject: 'all',
          },
        ]
      
        console.log('inicio useCookie...')
        useCookie('accessToken').value = token
        useCookie('userData').value = userData  
        useCookie('userAbilityRules').value = userAbilityRules
        ability.update(userAbilityRules)

        feedback.value.isVisible = true
        feedback.value.isColor = 'sucess'
        feedback.value.isText = 'Login realizado com sucesso.'
        feedback.value.isTimeout = '2000'

        nextTick(() => {
          router.replace(route.query.to ? String(route.query.to) : '/')
        })

        loadingBtn.value = false
      }
    })
    .catch(e => {
      console.log("userData..Error: ", e)
    })
}

const cadastraUSer = async (credentials, token) => {
  console.log('credentialsCad: ', credentials)
  await axios
    .post("/api/auth/cadastro", credentials)
    .then(response => {
      console.log('responseCadastro: ', response.data)

      const userData = {
        "uid": response.data.userData.userId,
        "id": response.data.userData.userId,
        "fullName": response.data.userData.name,
        "name": response.data.userData.name,
        "username": response.data.userData.userName,
        "avatar": "",
        "email": response.data.userData.email,
        "role": response.data.userData.role,
      }

      const userAbilityRules = [
        {
          action: 'manage',
          subject: 'all',
        },
      ]

      useCookie('userAbilityRules').value = userAbilityRules
      ability.update(userAbilityRules)
      useCookie('userData').value = userData
      useCookie('accessToken').value = token

      // console.log('userData: ', userData)
      // console.log('accessToken: ', accessToken)
      // console.log('userAbilityRules: ', userAbilityRules)

      loadingBtn.value = false
    })
    .catch(e => {
      console.log("eCadastro: ", e)
      feedback.value.isVisible = true
      feedback.value.isColor = 'error'
      feedback.value.isText = resolveErrorRes(e)
      feedback.value.isTimeout = '2000'
      loadingBtn.value = false
    })
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)

      // login()
      persistentAuth()
  })
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-sm-4 pa-md-7 pa-0"
      max-width="448"
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
          faça seu login para acessar sua conta
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
                label="Email"
                placeholder="email@email.com"
                type="email"
                autofocus
                :rules="[requiredValidator, emailValidator]"
                :error-messages="errors.email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :rules="[requiredValidator]"
                :type="isPasswordVisible ? 'text' : 'password'"
                :error-messages="errors.password"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <div class="d-flex align-center flex-wrap justify-space-between my-5 gap-2">
                <VCheckbox
                  v-model="rememberMe"
                  label="Lembre-me"
                />
                <RouterLink
                  class="text-primary"
                  :to="{ name: 'recuperar-senha' }"
                >
                  Esqueceu a senha?
                </RouterLink>
              </div>

              <VBtn
                block
                type="submit"
                :loading="loadingBtn"
              >
                Login
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>Novo em nossa plataforma? </span>
              <RouterLink
                class="text-primary d-inline-block"
                :to="{ name: 'registrar' }"
              >
                Criar uma conta
              </RouterLink>
            </VCol>
            <VCol
              cols="12"
              class="d-flex align-center"
            >
              <VDivider />
              <span class="mx-4">ou</span>
              <VDivider />
            </VCol>

            <!-- auth providers -->
            <VCol
              cols="12"
              class="text-center"
            >
              <AuthProvider />
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
