import axios from "@/services/api"

const radioContentCard = ref()
const radioContentAddress = ref()
const userCards = ref()
const userAdressess = ref()

export const getUserDataPay = async () => {

  const payDataStore = await axios
    .get("/api/user/cards/list")
    .then(response => {
      //JSON responses are automatically parsed.
      userCards.value = response.data
    })
    .catch(e => {
      console.log("payDataStore..Error: ", e)
    })
  
  radioContentCard.value = userCards.value.map(obj => {
    return {
      "title": obj.cardNumber,
      "bandeira": obj.cardBrand,
      "value": obj.cardToken,
      "icon": obj.cardBrand == 'MasterCard' ? "ri-mastercard-fill" : "ri-visa-fill",
    }
  })
  
  radioContentCard.value.push({
    "title": 'Adicionar novo cartão',
    "bandeira": '',
    "value": 'NewCard',
    "icon": "ri-bank-card-2-fill",
  })

  return radioContentCard
}

export const getUserDataAddress = async () => {
  
  const addressDataStore = await axios
    .get("/api/user/addresses/list")
    .then(response => {
      userAdressess.value = response.data.billing
    })
    .catch(e => {
      console.log("addressDataStore..Error: ", e)
    })
  
  radioContentAddress.value = userAdressess.value.map(obj => {
    return {
      "value": {
        "logradouro": obj.logradouro,
        "numero": obj.numero,
        "bairro": obj.bairro,
        "cidade": obj.cidade,
        "estado": obj.estado,
      },
      "icon": "ri-home-2-fill",
    }
  })
  
  
  radioContentAddress.value.push({
    "title": 'Adicionar novo Endereço',
    "icon": "ri-home-2-fill",
    "value": "NewAddress",
  })

  return radioContentAddress
}

export default { 
  radioContentCard,
  radioContentAddress, 
}
