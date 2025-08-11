// eslint-disable-next-line import/extensions
import axios from "axios"
// eslint-disable-next-line import/extensions

const accessToken = useCookie('accessToken')

// console.log('accessTokenAPI: ', accessToken.value)

const api = axios.create({
  // You can add your headers here
// ================================

  // `timeout` expecifica o número em milisegundos antes do tempo da requisição acabar.
  // Se a requisição levar um tempo maior do que o `timeout`, a requisição será abortada.
  // timeout: 2000, // o valor padrão do timeout é de `0` (sem intervalo)
})

api.interceptors.request.use(config => {

  // const accessToken = ref(null)
  
  // firebase.auth().onAuthStateChanged(user => {
  //   if (user) {
  //     user.getIdToken(/* forceRefresh */ true).then(token => accessToken.value = token)
  //     // console.log("user LoggedIn ", token)
  //   } else {
  //     // console.log("user noLoggedIn ")
  //     // setUser(null)
  //     // firebase
  //     //   .auth()
  //     //   .signOut()
  //     //   .then(() => {
  //     //     // console.log("signOut... ")
  //     //     // clearAccess()
  //     //   })
  //   }
  // })

  // Retrieve token from localStorage
  const token = accessToken.value

  // // console.log('api.interceptor')

  // If token is found
  if (token) {
    // Get request headers and if headers is undefined assign blank object
    config.headers = config.headers || {}

    // // console.log('config.headers', config.headers, token)

    // Set authorization header
    // ℹ️ JSON.parse will convert token to string
    config.headers.token = token
  }


  // // console.log('api.interceptor', config.headers.token)

  // Return modified config
  return config
})

// ℹ️ Add response interceptor to handle 401 response
api.interceptors.response.use(response => {    
  return response  
}, error => {
  // Handle error
  if (error.response.status === 401) {
    // clearAccess()
  }
  else {
    return Promise.reject(error)
  }
})

export default api
