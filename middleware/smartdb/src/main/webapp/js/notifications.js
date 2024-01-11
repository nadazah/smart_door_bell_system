document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('notification-container');

    // Connectez-vous au serveur WebSocket
    const socket = new WebSocket('ws://localhost:8080/pushes');

    // Gérez les événements de connexion WebSocket
    socket.addEventListener('open', (event) => {
        console.log('Connexion WebSocket établie');
    });

    // Gérez les messages WebSocket entrants
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        // Décomposez les données du message
        const { id, image, resultat, date } = data;

        // Affichez la notification avec la question
        afficherNotification(id, image, resultat, date);
    });

    // Fonction pour afficher la notification
    function afficherNotification(id, imageBase64, resultat, date) {
        // Supprimez le contenu actuel du conteneur
        container.innerHTML = '';

        // Créez un élément image
        const imgElement = new Image();

        // Définissez le contenu de l'image avec la base64 reçue
        imgElement.src = `data:image/jpeg;base64,${imageBase64}`;

        // Attendez que l'image soit chargée
        imgElement.onload = () => {
            // Créez un élément canvas pour redimensionner l'image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Définissez la taille du canvas pour redimensionner l'image
            canvas.width = 220;
            canvas.height = 225;

            // Redimensionnez l'image sur le canvas
            ctx.drawImage(imgElement, 0, 0, 220, 225);

            // Obtenez la nouvelle base64 de l'image redimensionnée
            const resizedImage = canvas.toDataURL('image/jpeg');

            // Affichez l'image redimensionnée dans le conteneur
            const imgResized = new Image();
            imgResized.src = resizedImage;
            container.appendChild(imgResized);

            // Affichez la question et les boutons
            const questionContainer = document.createElement('div');
            questionContainer.innerHTML = `<p>ID: ${id}</p><p>Résultat: ${resultat}</p><p>Date: ${date}</p>`;
            questionContainer.innerHTML += '<p>Voulez-vous ouvrir la porte?</p>';

            const boutonOui = document.createElement('button');
            boutonOui.textContent = 'Oui';
            boutonOui.addEventListener('click', () => {
                // Gérez l'action lorsque l'utilisateur clique sur Oui
                socket.send('open');
                container.innerHTML = '';
            });

            const boutonNon = document.createElement('button');
            boutonNon.textContent = 'Non';
            boutonNon.addEventListener('click', () => {
                // Gérez l'action lorsque l'utilisateur clique sur Non
                container.innerHTML = '';
            });

            questionContainer.appendChild(boutonOui);
            questionContainer.appendChild(boutonNon);

            container.appendChild(questionContainer);
        };
    }
});
