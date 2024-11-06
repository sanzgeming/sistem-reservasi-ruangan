class Room {
    constructor(number, capacity) {
        this.number = number;
        this.capacity = capacity;
        this.reservations = [];
    }

    isAvailable(date, startTime, duration) {
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

        for (const reservation of this.reservations) {
            const resStart = new Date(`${reservation.date}T${reservation.startTime}`);
            const resEnd = new Date(resStart.getTime() + reservation.duration * 60 * 60 * 1000);

            if ((start >= resStart && start < resEnd) || (end > resStart && end <= resEnd)) {
                return false;
            }
        }
        return true;
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }
}

class Reservation {
    constructor(name, roomNumber, date, startTime, duration) {
        this.name = name;
        this.roomNumber = roomNumber;
        this.date = date;
        this.startTime = startTime;
        this.duration = duration;
    }
}

const rooms = [
    new Room(1, 20),
    new Room(2, 25),
    new Room(3, 30),
    new Room(4, 0),
    new Room(5, 5),
];

function displayRoomList() {
    const roomList = document.querySelector("#room-list");
    roomList.innerHTML = "";

    rooms.forEach(room => {
        const row = document.createElement("tr");
        let status = "Tersedia";

        if (room.capacity === 0) {
            status = "Tidak Tersedia";
        } else if (room.reservations.length > 0) {
            status = "Sudah Dipesan";
        }

        row.innerHTML = `
        <td class="px-4 py-2">${room.number}</td>
        <td class="px-4 py-2">${room.capacity}</td>
        <td class="px-4 py-2">${status}</td>
      `;
        roomList.appendChild(row);
    });
}

function addReservation(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const roomNumber = parseInt(document.getElementById("roomNumber").value);
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("startTime").value;
    const duration = parseInt(document.getElementById("duration").value);
    const errorMessage = document.getElementById("error-message");

    const room = rooms.find(room => room.number === roomNumber);

    // Tambahkan pengecekan kapasitas di sini
    if (room && room.capacity === 0) {
        errorMessage.textContent = "Ruangan ini tidak tersedia untuk reservasi karena kapasitasnya 0.";
        return; // Keluar dari fungsi jika kapasitas 0
    }

    if (room && room.isAvailable(date, startTime, duration)) {
        const reservation = new Reservation(name, roomNumber, date, startTime, duration);
        room.addReservation(reservation);
        displayReservationList();
        displayRoomList();
        errorMessage.textContent = "";
        document.getElementById("reservation-form").reset();
    } else {
        errorMessage.textContent = "Ruangan tidak tersedia pada waktu yang dipilih.";
    }
}

function displayReservationList() {
    const reservationList = document.querySelector("#reservation-list");
    reservationList.innerHTML = "";

    rooms.forEach(room => {
        room.reservations.forEach((reservation, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
          <td class="px-4 py-2">${reservation.name}</td>
          <td class="px-4 py-2">${reservation.roomNumber}</td>
          <td class="px-4 py-2">${reservation.date}</td>
          <td class="px-4 py-2">${reservation.startTime}</td>
          <td class="px-4 py-2">${reservation.duration}</td>
          <td class="px-4 py-2"><button onclick="cancelReservation(${room.number}, ${index})" class="bg-red-600 hover:bg-red-700 px-2 py-1 rounded">Batalkan</button></td>
        `;
            reservationList.appendChild(row);
        });
    });
}

function cancelReservation(roomNumber, reservationIndex) {
    const room = rooms.find(room => room.number === roomNumber);
    if (room) {
        room.reservations.splice(reservationIndex, 1);
        displayReservationList();
        displayRoomList();
    }
}

document.getElementById("reservation-form").addEventListener("submit", addReservation);
displayRoomList();
displayReservationList();