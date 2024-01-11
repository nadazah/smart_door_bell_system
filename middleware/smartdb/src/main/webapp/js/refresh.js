async function refreshToken() {
    const accessToken = localStorage.getItem("Token");
    const refreshToken = localStorage.getItem("refreshToken");
    
    console.log('accessToken1 :', accessToken);
  
    localStorage.removeItem("Token");
    localStorage.removeItem("refreshToken");
  
    const url = "http://localhost:8080/api/oauth/token/refresh";
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Refresh-Authorization': refreshToken,
        'Authorization': `Bearer ${accessToken}`
      },
    });
  
    try {
      const responseData = await response.json();
  
      console.log('response :', responseData);
  
      localStorage.setItem('Token', responseData.accessToken);
      localStorage.setItem('refreshToken', responseData.refreshToken);
  
      const newAccessToken = localStorage.getItem("Token");
      console.log('accessToken2 :', newAccessToken);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token :', error);
      // Gérer les erreurs, par exemple, déconnexion de l'utilisateur
      // ou redirection vers la page de connexion
    }
}
// Appeler refreshToken toutes les 15 minutes
setInterval(refreshToken, 15 * 60 * 1000);  