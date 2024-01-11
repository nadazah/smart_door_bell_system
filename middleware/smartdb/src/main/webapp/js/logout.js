// Gestion de la déconnexion
document.addEventListener('DOMContentLoaded', function () {
  // Ajouter un événement de clic au bouton de déconnexion
  const logoutButton = document.getElementById('logout-button');
  logoutButton.addEventListener('click', function () {
    // Effacer les informations d'authentification du stockage local
    localStorage.removeItem('Token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');

    // Envoyer un message au service worker pour vider le cache dynamique
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ action: 'clearDynamicCache' });
    }

    // Rediriger vers la page de connexion
    window.location.href = '../pages/login.html';
  });
});
