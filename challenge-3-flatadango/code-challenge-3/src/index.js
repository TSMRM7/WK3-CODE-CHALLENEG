function fetchFilms() {
    fetch('http://localhost:3000/films')
        .then((response) => response.json())
        .then((films) => {
            const filmsList = document.getElementById('films');
            filmsList.innerHTML = '';

            films.forEach((film) => {
                const li = document.createElement('li');
                li.className = 'film item';
                li.innerText = film.title;


                li.onclick = () => loadFilmDetails(film);


                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.className = 'ui red button';
                deleteButton.onclick = (e) => {
                    e.stopPropagation();
                    deleteFilm(film.id, li);
                };
                li.appendChild(deleteButton);

                filmsList.appendChild(li);
            });


            loadFilmDetails(films[0]);
        });
}


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


    const availableTickets = film.capacity - film.tickets_sold;
    ticketNum.innerText = availableTickets;


    if (availableTickets <= 0) {
        buyTicketButton.innerText = 'Sold Out';
        document.querySelector(`li:contains('${film.title}')`).classList.add('sold-out');
        buyTicketButton.onclick = null;
    } else {
        buyTicketButton.innerText = 'Buy Ticket';
        buyTicketButton.onclick = () => buyTicket(film);
    }
}


function buyTicket(film) {
    const availableTickets = film.capacity - film.tickets_sold;

    if (availableTickets > 0) {

        fetch(`http://localhost:3000/films/${film.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tickets_sold: film.tickets_sold + 1 }),
        })
            .then((response) => response.json())
            .then((updatedFilm) => {
                loadFilmDetails(updatedFilm);
                postTicket(updatedFilm.id);
            });
    }
}


function postTicket(filmId) {
    fetch('http://localhost:3000/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ film_id: filmId, number_of_tickets: 1 }),
    });
}


function deleteFilm(id, li) {
    fetch(`http://localhost:3000/films/${id}`, {
        method: 'DELETE',
    }).then(() => {
        li.remove();
        fetchFilms();
    });
}


document.addEventListener('DOMContentLoaded', fetchFilms);
