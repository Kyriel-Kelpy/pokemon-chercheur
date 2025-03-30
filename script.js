const typeTranslations = {
    "Normal": "normal",
    "Feu": "fire",
    "Eau": "water",
    "Électrik": "electric",
    "Plante": "grass",
    "Glace": "ice",
    "Combat": "fighting",
    "Poison": "poison",
    "Sol": "ground",
    "Vol": "flying",
    "Psy": "psychic",
    "Insecte": "bug",
    "Roche": "rock",
    "Spectre": "ghost",
    "Dragon": "dragon",
    "Ténèbres": "dark",
    "Acier": "steel",
    "Fée": "fairy"
};

const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC"
};

const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");

const pokemonName = document.querySelector("#pokemon-name");
const pokemonId = document.querySelector("#pokemon-id");
const pokemonWeight = document.querySelector("#weight");
const pokemonHeight = document.querySelector("#height");
const pokemonImg = document.querySelector("#pokemon-img");
const pokemonPokedexEntry = document.querySelector("#pokedex-entry");
const pokemonTypes = document.querySelector("#types");
const pokemonHp = document.querySelector("#hp");
const pokemonAttack = document.querySelector("#attack");
const pokemonDefense = document.querySelector("#defense");
const pokemonSpa = document.querySelector("#special-attack");
const pokemonSpd = document.querySelector("#special-defense");
const pokemonSpeed = document.querySelector("#speed");
const pokemonTag = document.querySelector("#pokemon-tag");

const pokeApiUrl = "https://pokeapi.co/api/v2/pokemon-species/";
let currentPokemonId = null;

async function getPokemonDescriptionAndTag(pokemonId) {
    try {
        const response = await fetch(`${pokeApiUrl}${pokemonId}/`);
        if (!response.ok) {
            throw new Error("Description introuvable");
        }
        const data = await response.json();
        const description = data.flavor_text_entries.find(entry => entry.language.name === "fr").flavor_text;
        const tag = data.genera.find(entry => entry.language.name === "fr").genus;
        return { description, tag };
    } catch (error) {
        console.error(error);
        return { description: "Description non disponible", tag: "Catégorie inconnue" };
    }
}

async function getPokemonData(nameOrId) {
    try {
        const response = await fetch(`https://tyradex.vercel.app/api/v1/pokemon/${String(nameOrId).toLowerCase()}`);
        if (!response.ok) {
            throw new Error("Pokémon introuvable");
        }
        const data = await response.json();
        console.log(data);

        currentPokemonId = data.pokedex_id;
        
        const { description, tag } = await getPokemonDescriptionAndTag(data.pokedex_id);
        displayPokemonData(data, description, tag);
    } catch (error) {
        console.error(error);
        alert("Pokémon introuvable");
    }
}

function displayPokemonData(data, description, tag) {
    pokemonName.textContent = data.name.fr.toUpperCase();
    pokemonId.textContent = `#${data.pokedex_id}`;
    pokemonWeight.textContent = `Poids: ${data.weight}`;
    pokemonHeight.textContent = `Taille: ${data.height}`;

    pokemonImg.innerHTML = "";
    const sprite = document.createElement("img");
    sprite.id = "sprite";
    sprite.src = data.sprites.regular;
    sprite.alt = data.name.fr;
    pokemonImg.appendChild(sprite);

    pokemonPokedexEntry.textContent = description;
    pokemonTag.textContent = tag;
    
    pokemonTypes.innerHTML = "";
    data.types.forEach(type => {
        const typeElement = document.createElement("div");
        typeElement.textContent = type.name.toUpperCase();
        const englishType = typeTranslations[type.name] || "normal";
        typeElement.style.backgroundColor = typeColors[englishType] || "#68A090";
        typeElement.style.color = "#FFF";
        typeElement.style.padding = "5px 10px";
        typeElement.style.margin = "5px";
        typeElement.style.borderRadius = "5px";
        typeElement.style.display = "inline-block";
        pokemonTypes.appendChild(typeElement);
    });

    pokemonHp.textContent = `${data.stats.hp}`;
    pokemonAttack.textContent = `${data.stats.atk}`;
    pokemonDefense.textContent = `${data.stats.def}`;
    pokemonSpa.textContent = `${data.stats.spe_atk}`;
    pokemonSpd.textContent = `${data.stats.spe_def}`;
    pokemonSpeed.textContent = `${data.stats.vit}`;
}

searchButton.addEventListener("click", function() {
    const searchValue = searchInput.value.trim();
    if (searchValue) {
        getPokemonData(searchValue);
    } else {
        alert("Veuillez entrer un nom ou un ID de Pokémon.");
    }
});

prevButton.addEventListener("click", function() {
    if (currentPokemonId === null) {
        alert("Aucune recherche effectuée. Veuillez rechercher un Pokémon d'abord.");
        return;
    }
    if (currentPokemonId > 1) {
        getPokemonData(currentPokemonId - 1);
    } else {
        alert("Ceci est le premier Pokémon de la liste.");
    }
});

nextButton.addEventListener("click", function() {
    if (currentPokemonId === null) {
        alert("Aucune recherche effectuée. Veuillez rechercher un Pokémon d'abord.");
        return;
    }
    if (currentPokemonId < 1025) {
        getPokemonData(currentPokemonId + 1);
    } else {
        alert("Ceci est le dernier Pokémon de la liste.");
    }
});
