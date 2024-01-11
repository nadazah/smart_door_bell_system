const apiUrl = 'http://localhost:8080/api';

async function requestLoginId(codeChallenge) {
  const preLoginUrl = `${apiUrl}/authorize`;

  const clientId = generateRandomAlphaNumeric(10);

  // Définir la fonction generateRandomAlphaNumeric

  const encoded = btoa(`${clientId}#${codeChallenge}`);
  const requestOptions = {
    method: 'POST',
    path: '/',
    contentType: 'application/json',
    headers: { 'Pre-Authorization': `Bearer ${encoded}` },
  };

  const response = await fetch(preLoginUrl, requestOptions);
  const data = await response.json();

  return data.signInId;
}

function generateRandomAlphaNumeric(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function requestAuthCode(username, password, signInId) {
  const preLoginUrl = `${apiUrl}/authenticate/`;

  const requestOptions = {
    method: 'POST',
    path: '/',
    contentType: 'application/json',
  };

  const data = { username, password, signInId };

  const response = await fetch(preLoginUrl, {
    ...requestOptions,
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result.authCode;
}

async function requestToken(authCode, codeVerifier) {
  const preLoginUrl = `${apiUrl}/oauth/token`;

  const encoded = btoa(`${authCode}#${codeVerifier}`);
  const requestOptions = {
    method: 'GET',
    path: '/',
    contentType: 'application/json',
    headers: { 'Post-Authorization': `Bearer ${encoded}` },
  };

  const response = await fetch(preLoginUrl, requestOptions);
  const data = await response.json();

  return data;
}

async function refreshToken() {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const deleted1 = localStorage.removeItem('accessToken');
  const deleted2 = localStorage.removeItem('refreshToken');

  const url = `${apiUrl}/oauth/token/refresh`;
  const requestOptions = {
    method: 'GET',
    path: '/',
    contentType: 'application/json',
    headers: { 'Refresh-Authorization': refreshToken, 'Authorization': `Bearer ${accessToken}` },
  };

  const response = await fetch(url, requestOptions);
  const responseData = await response.json();

  localStorage.setItem('accessToken', responseData.accessToken);
  localStorage.setItem('refreshToken', responseData.refreshToken);

  return responseData;
}

export { requestLoginId, requestAuthCode, requestToken, refreshToken };
