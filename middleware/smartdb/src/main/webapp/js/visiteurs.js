document.addEventListener('DOMContentLoaded', async function () {
    const visiteursTableBody = document.getElementById('visiteurs-table-body');

    // Step 1: Retrieve access token from local storage
    const accessToken = localStorage.getItem('Token');

    // If access token is not present, redirect to login page
    if (!accessToken) {
        console.error('Access token not found. Redirecting to login page.');
        window.location.href = '../pages/profile.html';
        return;
    }

    try {
        // Step 2: Make a request to fetch data from the resource
        const response = await fetch('http://localhost:8080/api/sensor/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        data.forEach(visiteur => {
            const row = document.createElement('tr');
    
            // Step 1: Create an HTML img element
            const img = document.createElement('img');
            img.src = `data:image/jpeg;base64,${visiteur.image}`;
            img.alt = 'Visiteur Image';

            // Step 2: Resize the image to 220x220
            const resizedImg = resizeImage(img, 220, 220);
    
            const formattedDate = new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false,
            }).format(new Date(visiteur.date));

            row.innerHTML = `
                <td>${visiteur.id}</td>
                <td>${resizedImg.outerHTML}</td>
                <td>${visiteur.resultat}</td>
                <td>${formattedDate}</td>
            `;
            visiteursTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching visiteurs:', error);
        // Handle error, e.g., show an error message on the page
    }
});

function resizeImage(img, newWidth, newHeight) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    const resizedImg = new Image();
    resizedImg.src = canvas.toDataURL('image/jpeg');
    return resizedImg;
}
