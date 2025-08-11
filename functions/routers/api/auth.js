import express from "express";
import { findOneDocument, insertOneDocument } from "../../database/mongo.js";

const router = express.Router();

// ANCHOR - Buscar User-pelo Id após login pelo Front
router.get("/api/auth/user/:uid", async (req, res) => {
  try {
    console.log("userAuth beep beep", req.params.uid);
    const uid = req.params.uid;
    const filter = { _id: uid };
    const user = await findOneDocument("Users", filter);
    // console.log('userAuth.USER', user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error../api/auth/user/: ", error);
    res.status(500).json({ error: JSON.stringify(error) });
  }
});

// router.post("/api/sessionLogin", (req, res) => {
//   // Get the ID token passed and the CSRF token.
//   const idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRmOGIxNTFiY2Q5MGQ1YjMwMjBlNTNhMzYyZTRiMzA3NTYzMzdhNjEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSWFuIFNhbnRvcyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQWNIVHRjRVNvNWh4TlhzVG9xUU5RMWxYc3JqSVc3RGJYYk1ic1MzVDEtRXJBPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2FsbGluZ3VhcmRhdHVkby01MTNiMyIsImF1ZCI6ImFsbGluZ3VhcmRhdHVkby01MTNiMyIsImF1dGhfdGltZSI6MTcxOTAwNzA1OSwidXNlcl9pZCI6Imhqd0FFdDh0Nm5TeWUxVzRBakxvcWF0VzZrcDIiLCJzdWIiOiJoandBRXQ4dDZuU3llMVc0QWpMb3FhdFc2a3AyIiwiaWF0IjoxNzE5MDA3MDU5LCJleHAiOjE3MTkwMTA2NTksImVtYWlsIjoiaWFuLnNhbnRvczAwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA1MjY3OTk1MTk2Nzk0NTYyODA1Il0sImVtYWlsIjpbImlhbi5zYW50b3MwMEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.iuP_LqL0Pb9bTIZitexb9i3W4knH8wGEexKbwTLGGIQobrTEpaZYilu2f7tiM5VICmoBkfITfRKHkFWwjt7A3xT5ebYoYNYhhRrXkBR29zINUb9wq4fFjUwAzmiJQZ3euZ8gK6o21SDq7dXx28gL0XxHZ7ctANUmjWKIRjG4u8D2EUFKoOOXg0QgsQLL3URk9SUgvXzvLInyMaDQjgzR3wc2YPomsUcJD2yhlE_udrQcMghv0CnE04XELOyKnh9IjaUmt4e-hoSQnuAy0U_KfIexY5JCc-dRekiya248XdKjMvOJPmQbYdqgmEMFVWHbcalKXc8TIvswHyXBIoLL-w";
//   // const idToken = req.body.idToken.toString();
//   // const csrfToken = req.body.csrfToken.toString();
//   // Guard against CSRF attacks.
//   // if (csrfToken !== req.cookies.csrfToken) {
//   //   res.status(401).send('UNAUTHORIZED REQUEST!');
//   //   return;
//   // }
//   // Set session expiration to 5 days.
//   const expiresIn = 60 * 60 * 24 * 5 * 1000;
//   // Create the session cookie. This will also verify the ID token in the process.
//   // The session cookie will have the same claims as the ID token.
//   // To only allow session cookie setting on recent sign-in, auth_time in ID token
//   // can be checked to ensure user was recently signed in before creating a session cookie.
//   admin
//       .auth()
//       .createSessionCookie(idToken, {expiresIn})
//       .then(
//           (sessionCookie) => {
//             // Set cookie policy for session cookie.
//             const options = {maxAge: expiresIn, httpOnly: true, secure: true};
//             res.cookie("session", sessionCookie, options);
//             res.end(JSON.stringify({status: "success"}));
//           },
//           (error) => {
//             res.status(401).send("UNAUTHORIZED REQUEST!");
//           },
//       );
// });

// router.post("/api/auth/login", async (req, res) => {
//   // console.log('/api/auth/login');

//   // console.log('REQ-dataLogin:', req.body);

//   const email = req.body.email;
//   const password = req.body.password;

//   // console.log('tryLogin-email:', email);
//   // console.log('tryLogin-psw:', password);

//   firebase
//       .auth()
//       .signInWithEmailAndPassword(email, password)
//       .then((userCredential) => {
//         console.log("userCredential.user: ", userCredential);
//         console.log("accessToken: ", userCredential.user._lat);

//         res.cookie("accessToken", userCredential.user._lat);
//         res.status(200).json(userCredential.user);
//       })
//       .catch((error) => {
//         const errorMessage = verifyErroCode(error.code);
//         // console.log('errorLogin: ', errorMessage)
//         res.status(400).send(errorMessage);
//       });
// });

// router.post("/api/auth/register", async (req, res) => {
//   const name = req.body.name;
//   const email = req.body.email;
//   const password = req.body.password;
//   const privacyPolicies = (req.body.privacyPolicies) ? 1 : 0;
//   const termsConditions = (req.body.termsConditions) ? 2 : 0;
//   const terms = (privacyPolicies + termsConditions);

//   if (terms !== 3) {
//     return res.status(402).send(`Necessário aceitar os termos de uso.`);
//   }

//   firebase
//       .auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then((credential) => {
//         const result = updateUserData(
//             credential.user.uid, credential.user.email, name, terms,
//         );

//         if (result.status === -1) {
//           return res.status(400).send(result.error);
//         } else if (result.status === 0) {
//           return res.status(201).send(`Nenhum dado atualizado.`);
//         } else {
//           return res.status(200).json({
//             credential: credential.user, userData: result.data,
//           });
//         }
//       })
//       .catch((error) => {
//         const errorMessage = verifyErroCode(error.code);
//         // console.log('errorRegister: ', errorMessage)
//         res.status(400).send(errorMessage);
//       });
// });

// router.post("/api/auth/logout", isUser, async (req, res) => {
//   firebase
//       .auth()
//       .signOut()
//       .then(() => {
//         console.log("logout success.");
//         return res.status(201).send(`logout success.`);
//       }).catch((error) => {
//         const errorMessage = verifyErroCode(error.code);
//         // console.log('errorRegister: ', errorMessage)
//         res.status(400).send(error);
//       });
// });

async function updateUserData(uid, email, name, terms) {
  try {
    const data = {};
    const createdAt = new Date().toISOString();
    data.createdAt = createdAt;
    data.codigo = await geraCodigo();
    data._id = uid;
    data.terms = terms;
    (data.email = email), (data.userName = name), (data.nome = "");
    data.lastName = "";
    data.SocialNumber = "";
    data.SocialNumberType = "";
    data.telefone = "";
    data.empresa = "";
    data.idioma = "Português";
    data.moeda = "BRL";
    data.role = false;
    data.picture = null;
    data.homeAddress = {};
    data.billingAddress = [];
    data.cards = [];
    data.userAbilityRules = [
      {
        action: "user",
        subject: "limited",
      },
    ];
    data.active = true;

    const result = await insertOneDocument("Users", data);

    return { status: result.insertedCount, data: data };
  } catch (error) {
    return { status: -1, error: error };
  }
}

async function geraCodigo() {
  try {
    const codigos = mongoClient.getCollection("geracao_codigos");
    const filter = { _id: "Users" };
    const update = { $inc: { numero_atual: 1 } };
    const options = { returnDocument: "after" };

    const result = await codigos.findOneAndUpdate(filter, update, options);

    console.log("geraCodigo", result);

    if (result) {
      const contador_codigo = result.value.numero_atual;
      return contador_codigo;
    } else {
      return 0;
    }
  } catch (error) {
    return -1;
  }
}

// async function enviaEmailCadastro(email) {
//   console.log("enviaEmailCadastro...");
//   console.log("cadastraUSer", email);

//   const contato = email;
//   console.log(contato);

//   // Email para confirmação de cadastro de Cadastro!
//   const subject = "[All In Guarda Tudo] Conta criada com sucesso!";
//   const templateString = fs.readFileSync("emails/templates/userRegistro.ejs", "utf8");
//   const email_html = ejs.render(templateString, {contato: contato});
//   try {
//     sendMail(contato, subject, email_html);
//   } catch (error) {
//     console.error(error);
//   }
// }

router.post("/api/auth/cadastro", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const uid = req.body.uid;
  const terms = [
    {
      privacyPolicies: req.body.privacyPolicies,
      termsConditions: req.body.termsConditions,
    },
  ];

  const result = await updateUserData(uid, email, name, terms);

  console.log("resultUpdate: ", result);

  // res.cookie("accessToken", credential.user._lat);

  //FIXME - CORRIGIR envio emailsss
  // enviaEmailCadastro(email);

  if (result.status === -1) {
    return res.status(400).send(result.error);
  } else if (result.status === 0) {
    return res.status(201).send(`Nenhum dado atualizado.`);
  } else {
    return res.status(200).json({ credential: name, userData: result.data });
  }
});

router.post("/api/auth/forgot", async (req, res) => {
  const email = req.body.email;

  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then((userCredential) => {
      console.log("userDataCred: ", userCredential);

      res.status(200).json(userCredential);
    })
    .catch((error) => {
      const errorMessage = verifyErroCode(error.code);
      // console.log('errorRegister: ', errorMessage)
      res.status(400).send(errorMessage);
    });
});

router.post("/api/posAuth", async (req, res) => {
  const data = {};
  const myData = req.body;
  const uid = req.body.uid;
  const email = req.body.email;
  const nome = req.body.name;
  const createdAt = new Date().toISOString();
  const role = "false";
  const isTest = "true";

  try {
    const usersCollection = mongoClient.getCollection("Users");
    const current = await usersCollection.findOne({ _id: uid });
    // console.log(`current: ${JSON.stringify(current)}`);

    if (current == null) {
      data.userId = uid;
      data.email = email;
      data.nome = nome;
      data.role = role;
      data.isTest = isTest;
      data.createdAt = createdAt;
    } else {
      // console.log('current:', current)
      if (!current.createdAt) {
        data.createdAt = myData.createdAt;
      }

      if (!current.lastSignInTime) {
        data.lastSignInTime = myData.lastSignInTime;
      }

      if (!current.nome) {
        data.nome = myData.nome;
      }

      if (!current.picture) {
        data.picture = myData.photoURL;
      }
    }
    const update = {
      $set: data,
    };
    const filter = { _id: uid };
    const options = { upsert: true };
    const result = await usersCollection.updateOne(filter, update, options);
    // console.log(`user_modify_n: ${result.modifiedCount}`);

    const user = await usersCollection.findOne({ _id: uid });
    // // console.log('user: ', user);

    res.status(200).json(user);
  } catch (error) {
    console.error(`update_user_error: ${error}`);
    res.status(400).json({ error: JSON.stringify(error) });
  }
});

function verifyErroCode(errorCode) {
  // fonte: https://firebase.google.com/docs/reference/js/firebase.auth.Auth
  // fonte: https://firebase.google.com/docs/auth/admin/errors?hl=pt-br
  switch (errorCode) {
    case "auth/app-deleted":
      return "O banco de dados não foi localizado.";
    case "auth/expired-action-code":
      return "O código da ação o ou link expirou.";
    case "auth/invalid-action-code":
      return "O código da ação é inválido. Isso pode acontecer se o código estiver malformado ou já tiver sido usado.";
    case "auth/user-disabled":
      return "O usuário correspondente à credencial fornecida foi desativado.";
    case "auth/user-not-found":
      return "O usuário não correponde à nenhuma credencial.";
    case "auth/weak-password":
      return "A senha é muito fraca.";
    case "auth/email-already-in-use":
      return "Já existe uma conta com o endereço de email fornecido.";
    case "auth/invalid-email":
      return "O endereço de e-mail não é válido.";
    case "auth/operation-not-allowed":
      return "O tipo de conta correspondente à esta credencial, ainda não encontra-se ativada.";
    case "auth/account-exists-with-different-credential":
      return "E-mail já associado a outra conta.";
    case "auth/auth-domain-config-required":
      return "A configuração para autenticação não foi fornecida.";
    case "auth/credential-already-in-use":
      return "Já existe uma conta para esta credencial.";
    case "auth/operation-not-supported-in-this-environment":
      return "Esta operação não é suportada no ambiente que está sendo executada. Verifique se deve ser http ou https.";
    case "auth/timeout":
      return "Excedido o tempo de resposta. O domínio pode não estar autorizado para realizar operações.";
    case "auth/missing-android-pkg-name":
      return "Deve ser fornecido um nome de pacote para instalação do aplicativo Android.";
    case "auth/missing-continue-uri":
      return "A próxima URL deve ser fornecida na solicitação.";
    case "auth/missing-ios-bundle-id":
      return "Deve ser fornecido um nome de pacote para instalação do aplicativo iOS.";
    case "auth/invalid-continue-uri":
      return "A próxima URL fornecida na solicitação é inválida.";
    case "auth/unauthorized-continue-uri":
      return "O domínio da próxima URL não está na lista de autorizações.";
    case "auth/invalid-dynamic-link-domain":
      return "O domínio de link dinâmico fornecido, não está autorizado ou configurado no projeto atual.";
    case "auth/argument-error":
      return "Verifique a configuração de link para o aplicativo.";
    case "auth/invalid-persistence-type":
      return "O tipo especificado para a persistência dos dados é inválido.";
    case "auth/unsupported-persistence-type":
      return "O ambiente atual não suportar o tipo especificado para persistência dos dados.";
    case "auth/invalid-credential":
      return "A credencial expirou ou está mal formada.";
    case "auth/wrong-password":
      return "Senha incorreta.";
    case "auth/invalid-verification-code":
      return "O código de verificação da credencial não é válido.";
    case "auth/invalid-verification-id":
      return "O ID de verificação da credencial não é válido.";
    case "auth/custom-token-mismatch":
      return "O token está diferente do padrão solicitado.";
    case "auth/invalid-custom-token":
      return "O token fornecido não é válido.";
    case "auth/captcha-check-failed":
      return "O token de resposta do reCAPTCHA não é válido, expirou ou o domínio não é permitido.";
    case "auth/invalid-phone-number":
      return "O número de telefone está em um formato inválido (padrão E.164).";
    case "auth/missing-phone-number":
      return "O número de telefone é requerido.";
    case "auth/quota-exceeded":
      return "A cota de SMS foi excedida.";
    case "auth/cancelled-popup-request":
      return "Somente uma solicitação de janela pop-up é permitida de uma só vez.";
    case "auth/popup-blocked":
      return "A janela pop-up foi bloqueado pelo navegador.";
    case "auth/popup-closed-by-user":
      return "A janela pop-up foi fechada pelo usuário sem concluir o login no provedor.";
    case "auth/unauthorized-domain":
      return "O domínio do aplicativo não está autorizado para realizar operações.";
    case "auth/invalid-user-token":
      return "O usuário atual não foi identificado.";
    case "auth/user-token-expired":
      return "O token do usuário atual expirou.";
    case "auth/null-user":
      return "O usuário atual é nulo.";
    case "auth/app-not-authorized":
      return "Aplicação não autorizada para autenticar com a chave informada.";
    case "auth/invalid-api-key":
      return "A chave da API fornecida é inválida.";
    case "auth/network-request-failed":
      return "Falha de conexão com a rede.";
    case "auth/requires-recent-login":
      return "O último horário de acesso do usuário não atende ao limite de segurança.";
    case "auth/too-many-requests":
      return "As solicitações foram bloqueadas devido a atividades incomuns. Tente novamente depois que algum tempo.";
    case "auth/web-storage-unsupported":
      return "O navegador não suporta armazenamento ou se o usuário desativou este recurso.";
    case "auth/invalid-claims":
      return "Os atributos de cadastro personalizado são inválidos.";
    case "auth/claims-too-large":
      return "O tamanho da requisição excede o tamanho máximo permitido de 1 Megabyte.";
    case "auth/id-token-expired":
      return "O token informado expirou.";
    case "auth/id-token-revoked":
      return "O token informado perdeu a validade.";
    case "auth/invalid-argument":
      return "Um argumento inválido foi fornecido a um método.";
    case "auth/invalid-creation-time":
      return "O horário da criação precisa ser uma data UTC válida.";
    case "auth/invalid-disabled-field":
      return "A propriedade para usuário desabilitado é inválida.";
    case "auth/invalid-display-name":
      return "O nome do usuário é inválido.";
    case "auth/invalid-email-verified":
      return "O e-mail é inválido.";
    case "auth/invalid-hash-algorithm":
      return "O algoritmo de HASH não é uma criptografia compatível.";
    case "auth/invalid-hash-block-size":
      return "O tamanho do bloco de HASH não é válido.";
    case "auth/invalid-hash-derived-key-length":
      return "O tamanho da chave derivada do HASH não é válido.";
    case "auth/invalid-hash-key":
      return "A chave de HASH precisa ter um buffer de byte válido.";
    case "auth/invalid-hash-memory-cost":
      return "O custo da memória HASH não é válido.";
    case "auth/invalid-hash-parallelization":
      return "O carregamento em paralelo do HASH não é válido.";
    case "auth/invalid-hash-rounds":
      return "O arredondamento de HASH não é válido.";
    case "auth/invalid-hash-salt-separator":
      return "O campo do separador de SALT do algoritmo de geração de HASH precisa ser um buffer de byte válido.";
    case "auth/invalid-id-token":
      return "O código do token informado não é válido.";
    case "auth/invalid-last-sign-in-time":
      return "O último horário de login precisa ser uma data UTC válida.";
    case "auth/invalid-page-token":
      return "A próxima URL fornecida na solicitação é inválida.";
    case "auth/invalid-password":
      return "A senha é inválida, precisa ter pelo menos 6 caracteres.";
    case "auth/invalid-password-hash":
      return "O HASH da senha não é válida.";
    case "auth/invalid-password-salt":
      return "O SALT da senha não é válido.";
    case "auth/invalid-photo-url":
      return "A URL da foto de usuário é inválido.";
    case "auth/invalid-provider-id":
      return "O identificador de provedor não é compatível.";
    case "auth/invalid-session-cookie-duration":
      return "A duração do COOKIE da sessão precisa ser um número válido em milissegundos, entre 5 minutos e 2 semanas.";
    case "auth/invalid-uid":
      return "O identificador fornecido deve ter no máximo 128 caracteres.";
    case "auth/invalid-user-import":
      return "O registro do usuário a ser importado não é válido.";
    case "auth/invalid-provider-data":
      return "O provedor de dados não é válido.";
    case "auth/maximum-user-count-exceeded":
      return "O número máximo permitido de usuários a serem importados foi excedido.";
    case "auth/missing-hash-algorithm":
      return "É necessário fornecer o algoritmo de geração de HASH e seus parâmetros para importar usuários.";
    case "auth/missing-uid":
      return "Um identificador é necessário para a operação atual.";
    case "auth/reserved-claims":
      return "Uma ou mais propriedades personalizadas fornecidas usaram palavras reservadas.";
    case "auth/session-cookie-revoked":
      return "O COOKIE da sessão perdeu a validade.";
    case "auth/uid-alread-exists":
      return "O indentificador fornecido já está em uso.";
    case "auth/email-already-exists":
      return "O e-mail fornecido já está em uso.";
    case "auth/phone-number-already-exists":
      return "O telefone fornecido já está em uso.";
    case "auth/project-not-found":
      return "Nenhum projeto foi encontrado.";
    case "auth/insufficient-permission":
      return "A credencial utilizada não tem permissão para acessar o recurso solicitado.";
    case "auth/internal-error":
      return "O servidor de autenticação encontrou um erro inesperado ao tentar processar a solicitação.";
    default:
      return null;
  }
}

export default router;
