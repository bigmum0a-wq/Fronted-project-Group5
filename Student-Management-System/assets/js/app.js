const navLinks = document.querySelectorAll('.second-container nav ul li a');
const mainContainer = document.getElementById('pages');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Récupérer l'attribut href ou formater le texte proprement pour correspondre aux fichiers de /pages/
        const href = link.getAttribute('href'); // Ex: "pages/students.html"
        const pageName = href.replace('pages/', '').replace('.html', '');

        fetch(href)
            .then(response => {
                if (!response.ok) throw new Error("Page introuvable");
                return response.text();
            })
            .then(html => {
    mainContainer.innerHTML = html; // Remplace le contenu de la zone de droite

    if (pageName === 'attendance' && window.initAttendancePage) {
        window.initAttendancePage();
    }
})
            .catch(error => {
                mainContainer.innerHTML = `<h2>Chargement de ${pageName} en cours...</h2><p>Le fichier sera bientôt disponible.</p>`;
            });
    });
});