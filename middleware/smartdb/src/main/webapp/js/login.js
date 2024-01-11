document.addEventListener('DOMContentLoaded', function() {


  
  window.loginUser = async () => {
    try {
      // Perform OAuth flow instead of direct login
      const { accessToken, refreshToken } = await performOAuthFlow();
      console.log(accessToken);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Base64 URL encoding
  function base64URLEncode(buffer) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Generate a random code verifier
  function generateCodeVerifier() {
    const codeVerifierLength = 43; // Length should be between 43 and 128 characters
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let codeVerifier = '';
    for (let i = 0; i < codeVerifierLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      codeVerifier += charset.charAt(randomIndex);
    }
    return codeVerifier;
  }

  // Generate code challenge from code verifier
  async function generateCodeChallenge(codeVerifier) {
    // Convert the code verifier to ArrayBuffer
    const codeVerifierBuffer = new TextEncoder().encode(codeVerifier);

    // Calculate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', codeVerifierBuffer);
    // Convert the hash to base64 URL-encoded string
    const codeChallenge = base64URLEncode(hashBuffer);
    return codeChallenge;
  }

  



  // Function to perform the OAuth with PKCE flow
  async function performOAuthFlow() {

    // Step 0: Get user credentials (email, password)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Step 1: Generate code verifier and code challenge
    const codeVerifier = generateCodeVerifier();
    console.log("codeVerifier:", codeVerifier)
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    console.log("codeChallenge:", codeChallenge)

    // Step 2: Make a request to /authorize
    const authorizeEndpoint = 'http://localhost:8080/api/authorize';
    const myString = `${email}#${codeChallenge}`;
    console.log("myString",myString)
    const buffer = new TextEncoder().encode(myString);
    console.log("clientid#codeChallenge",base64URLEncode(buffer))
    const authorizeHeaders = {
      'Pre-Authorization': `Bearer ${base64URLEncode(buffer)}`,

    };

    const authorizeResponse = await fetch(authorizeEndpoint, {
      method: 'POST',
      headers: new Headers(authorizeHeaders),
    });
    const responseText = await authorizeResponse.text();
    // Parse the JSON content
    const authorize = JSON.parse(responseText);

    // Extract the signInId value
    const signInId = authorize.signInId;
    console.log("signInId:", signInId);

    
    // Step 4: Make a request to /authenticate
    const authenticateEndpoint = 'http://localhost:8080/api/authenticate/';
    const authenticateBody = {
      mail: email,
      password: password,
      signInId: authorize.signInId, // Use the signInId from the authorize response
    };

    const authenticateResponse = await fetch(authenticateEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authenticateBody),
    });

    const response_Text = await authenticateResponse.text();
    // Parse the JSON content
    const authenticate = JSON.parse(response_Text);

    // Extract the authCode value
    const authCode = authenticate.authCode;
    console.log("authCode:", authCode);

    // Step 5: Make a request to /oauth/token
    const tokenEndpoint = 'http://localhost:8080/api/oauth/token';
    const my_String = authCode + '#' + codeVerifier;
    console.log("authCode#codeVerifier:", my_String);
    
    const mybuffer = new TextEncoder().encode(my_String);
    
    const base64Encoded = base64URLEncode(mybuffer);
    console.log("base64Encoded de authCode#codeVerifier :", base64Encoded);
    
    const tokenHeaders = {
      'Post-Authorization': `Bearer ${base64Encoded}`,

    };
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'GET',
      headers: new Headers(tokenHeaders),
    });
    localStorage.setItem("email", email);
    const text = await tokenResponse.text();

    // Parse the JSON content
    const auth = JSON.parse(text);

    // Extract the authCode value
    const Token = auth.accessToken;
    const refreshToken = auth.refreshToken;


    // Step 6: Redirect to contact.html or any other page
    if (Token) {
      localStorage.setItem("Token", Token);
      localStorage.setItem("refreshToken", refreshToken);
      window.location.href = '../pages/profile.html';
    } else {
      console.error('Failed to get access token');
    }
    console.log("Access Token:", Token);
    console.log("Refresh Token:", refreshToken);
    return { accessToken: Token, refreshToken: refreshToken };

  }  

});