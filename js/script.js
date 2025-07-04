const map = L.map("map").setView([10.42086, -75.54615], 16); // Coordenadas de Getsemaní, Cartagena

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data from <a href="https://www.openstreetmap.org/copyright" target="_blank" >OpenStreetMap</a> &copy;',
}).addTo(map);

const COLOR_CAPA = {
  Comercio: "rgb(251, 255, 0)",
  Vivienda: "rgb(255, 0, 0)",
  Ambiente: "rgb(0, 255, 0)",
  Patrimonio: "rgb(43, 81, 248)",
  default: "rgb(124, 124, 124)",
};

const LORDICON_HTML = {
  Comercio: `<lord-icon
            src="https://cdn.lordicon.com/kkdnopsh.json"
            trigger="in"
            delay="50"
            state="in-reveal"
            style="width:40px;height:40px">
        </lord-icon>`,

  Vivienda: `<lord-icon
            src="https://cdn.lordicon.com/pgirtdfe.json"
            trigger="in"
            delay="50"
            state="in-reveal"
            style="width:40px;height:40px">
        </lord-icon>`,

  Ambiente: `<lord-icon
            src="https://cdn.lordicon.com/wmelwzdo.json"
            trigger="in"
            delay="50"
            state="in-reveal"
            style="width:40px;height:40px">
        </lord-icon>`,

  Patrimonio: `<lord-icon
            src="https://cdn.lordicon.com/ylscktzo.json"
            trigger="in"
            delay="50"
            state="in-reveal"
            style="width:40px;height:40px">
        </lord-icon>`,

  default: `<lord-icon
            src="https://cdn.lordicon.com/tdrtiskw.json"
            trigger="in"
            delay="50"
            state="in-reveal"
            style="width:40px;height:40px">
        </lord-icon>`,
};

function crearPopup(lugar) {
  const color = COLOR_CAPA[lugar.capa] || COLOR_CAPA.default;
  return `
    <div class="popup-content">
    <h3>${lugar.nombre}</h3>
     <span style="
          background-color: ${color};
          color: black;
          padding: 1px 6px;
          border-radius: 5px;
          font-size: 0.9em;
        ">
          ${lugar.capa}
        </span>
    <p>${lugar.direccion}</p>
    <p>Latitud: ${lugar.lat} Longitud: ${lugar.lng}</p>
    <img src="${lugar.imagen}" alt="${lugar.nombre}">
    </div>
`;
}

// Cargar el archivo JSON con los lugares
fetch("lugares.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    return response.json();
  })
  .then((data) => {
    data.forEach((lugar) => {
      const color = COLOR_CAPA[lugar.capa] || COLOR_CAPA.default;
      const lordiconHTML = LORDICON_HTML[lugar.capa] || LORDICON_HTML.default;

      const lugar_icon = L.divIcon({
        html: lordiconHTML,
        className: "icono-lord",
        iconSize: [10, 10],
        popupAnchor: [0, -25],
      });

      L.marker([lugar.lat, lugar.lng], { icon: lugar_icon })
        .addTo(map)
        .bindPopup(crearPopup(lugar));
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
