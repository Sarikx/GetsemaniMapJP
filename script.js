const map = L.map("map").setView([10.42086, -75.54615], 15); // Coordenadas de Getsemaní, Cartagena

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data from <a href="https://www.openstreetmap.org/copyright" target="_blank" >OpenStreetMap</a> &copy;',
}).addTo(map);

const COLOR_CAPA = {
  Comercio: "rgb(251, 255, 0)",
  Vivienda: "rgb(255, 0, 0)",
  Ambiente: "rgb(0, 255, 0)",
  Patrimonio: "rgb(43, 81, 248)",
  Todos: "rgb(214, 214, 214)",
  Ninguno: "rgb(214, 214, 214)",
  Info: "rgb(214, 214, 214)",
};

document.querySelectorAll(".filter-button").forEach((button) => {
  const capa = button.dataset.capa;
  const color = COLOR_CAPA[capa];
  button.style.backgroundColor = color;

  button.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-button")
      .forEach((b) => b.classList.remove("activo"));
    button.classList.add("activo");

    if (capa === "Todos") {
      mostrarTodosLosMarcadores();
    } else if (capa === "Ninguno") {
      ocultarTodosLosMarcadores();
    } else if (capa === "Info") {
      mostrarInfoProyecto();
    } else {
      mostrarMarcadoresDeCapa(capa);
    }
  });
});

// Cargar los iconos de Lordicon para cada capa
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
      <div style="display: flex; align-items: center; gap: 8px;">
        <h3 style="margin: 0;">${lugar.nombre}</h3>
        <span style="
          background-color: ${color};
          color: black;
          padding: 1px 6px;
          border-radius: 5px;
          font-size: 0.9em;
        ">
          ${lugar.capa}
        </span>
      </div>
      <p>${lugar.direccion}</p>
      <p>Latitud: ${lugar.lat} &nbsp; &nbsp; Longitud: ${lugar.lng}</p>
      <img src="${lugar.imagen}" alt="${lugar.nombre}">
    </div>
  `;
}

const marcadoresPorCapa = {
  Comercio: [],
  Vivienda: [],
  Ambiente: [],
  Patrimonio: [],
};

// Cargar el archivo JSON con los lugares
fetch("lugares.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    return response.json();
  })
  .then((lugares) => {
    lugares.forEach((lugar) => {
      const lordiconHTML = LORDICON_HTML[lugar.capa] || LORDICON_HTML.default;

      const lugar_icon = L.divIcon({
        html: lordiconHTML,
        className: "icono-lord",
        iconSize: [10, 10],
        popupAnchor: [0, -25],
      });

      const marker = L.marker([lugar.lat, lugar.lng], { icon: lugar_icon })
        .bindPopup(crearPopup(lugar))
        .addTo(map);

      // Guardar el marcador en su categoría
      if (marcadoresPorCapa[lugar.capa]) {
        marcadoresPorCapa[lugar.capa].push(marker);
      }
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function ocultarTodosLosMarcadores() {
  for (const capa in marcadoresPorCapa) {
    marcadoresPorCapa[capa].forEach((marker) => map.removeLayer(marker));
  }
}

function mostrarMarcadoresDeCapa(capaSeleccionada) {
  ocultarTodosLosMarcadores();
  if (marcadoresPorCapa[capaSeleccionada]) {
    marcadoresPorCapa[capaSeleccionada].forEach((marker) => marker.addTo(map));
  }
}

function mostrarTodosLosMarcadores() {
  for (const capa in marcadoresPorCapa) {
    marcadoresPorCapa[capa].forEach((marker) => marker.addTo(map));
  }
}

// Manejo del modal que muestra la información del proyecto
document.addEventListener("DOMContentLoaded", () => {
  const infoToggle = document.getElementById("infoToggle");
  const cerrarModal = document.getElementById("cerrarModal");
  const modalInfo = document.getElementById("modalInfo");

  if (infoToggle && modalInfo) {
    infoToggle.addEventListener("click", () => {
      modalInfo.style.display = "block";
    });
  }

  if (cerrarModal && modalInfo) {
    cerrarModal.addEventListener("click", () => {
      modalInfo.style.display = "none";
    });
  }
});

function mostrarInfoProyecto() {
  const modalInfo = document.getElementById("modalInfo");
  if (modalInfo) {
    modalInfo.style.display = "block";
  }
}
