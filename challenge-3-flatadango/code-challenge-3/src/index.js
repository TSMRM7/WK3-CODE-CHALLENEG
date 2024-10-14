// Function to fetch films and populate the list
function fetchFilms() {
    fetch('http://localhost:3000/films')
        .then((response) => response.json())
        .then((films) => {
            const filmsList = document.getElementById('films');
            filmsList.innerHTML = ''; // Clear placeholder

            films.forEach((film) => {
                const li = document.createElement('li');
                li.className = 'film item';
                li.innerText = film.title;

                // Add delete button
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.className = 'ui red button';
                deleteButton.onclick = (event) => {
                    event.stopPropagation(); // Prevent the film from being loaded when clicking delete
                    deleteFilm(film.id, li);
                };
                li.appendChild(deleteButton);

                // Add click event to load film details when clicked
                li.onclick = () => loadFilmDetails(film);

                filmsList.appendChild(li);
            });

            // Load the details of the first film in the list by default
            if (films.length > 0) {
                loadFilmDetails(films[0]);
            }
        });
}

// Function to load film details
function loadFilmDetails(film) {
    const title = document.getElementById('title');
    const runtime = document.getElementById('runtime');
    const filmInfo = document.getElementById('film-info');
    const showtime = document.getElementById('showtime');
    const ticketNum = document.getElementById('ticket-num');
    const poster = document.getElementById('poster');
    const buyTicketButton = document.getElementById('buy-ticket');

    title.innerText = film.title;
    runtime.innerText = `${film.runtime} minutes`;
    filmInfo.innerText = film.description;
    showtime.innerText = film.showtime;
    poster.src = film.poster;

    // Calculate available tickets
    const availableTickets = film.capacity - film.tickets_sold;
    ticketNum.innerText = availableTickets;

    // Update button and list item based on availability
    if (availableTickets <= 0) {
        buyTicketButton.innerText = 'Sold Out';
        buyTicketButton.disabled = true; // Disable button if sold out
        document.querySelector(`li:contains('${film.title}')`).classList.add('sold-out');
    } else {
        buyTicketButton.innerText = 'Buy Ticket';
        buyTicketButton.disabled = false; // Enable button if tickets are available
        buyTicketButton.onclick = () => buyTicket(film);
    }
}

// Function to handle buying a ticket
function buyTicket(film) {
    const availableTickets = film.capacity - film.tickets_sold;

    if (availableTickets > 0) {
        // Update tickets sold on the backend
        fetch(`http://localhost:3000/films/${film.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tickets_sold: film.tickets_sold + 1 }),
        })
            .then((response) => response.json())
            .then((updatedFilm) => {
                loadFilmDetails(updatedFilm); // Reload film details
                postTicket(updatedFilm.id);
            });
    }
}

// Function to post a ticket to the database
function postTicket(filmId) {
    fetch('http://localhost:3000/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ film_id: filmId, number_of_tickets: 1 }),
    });
}

// Function to delete a film
function deleteFilm(id, li) {
    fetch(`http://localhost:3000/films/${id}`, {
        method: 'DELETE',
    }).then(() => {
        li.remove(); // Remove film from the list
        fetchFilms(); // Refresh the list
    });
}

// Fetch films when the page loads
document.addEventListener('DOMContentLoaded', fetchFilms);
