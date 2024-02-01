const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const closeModalButton = document.getElementById('close-modal')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {

    return `
        <li class="pokemon ${pokemon.type}" data="${pokemon.number}" 
            onClick="modalDetailPokemon(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
        .catch(error => console.log(error))
}

function openModal() {
    document.querySelector('.pokemon-modal').style.display = "flex";
    document.querySelector('.pokemon-modal').style.opacity = "0";
    setTimeout(() => document.querySelector('.pokemon-modal').style.opacity = "1", 200)
}

function closeModal() {
    setTimeout(() => document.querySelector('.pokemon-modal').style.opacity = "0", 200)
    setTimeout(() => document.querySelector('.pokemon-modal').style.display = "none", 400)
}

function transitionStatusbar() {
    document.querySelectorAll('.status-bar').forEach(item => {
        const value = item.style.width
        item.style.width = "0%"
        setTimeout(() => item.style.width = value, 200)
    })
}

function statsPokemonToLI(stat) {
    return `<li>
                <span>${stat.stat.name}: ${stat.base_stat}</span> 
                <div class="status-bar ${stat.stat.name}" 
                    style="width: ${stat.base_stat < 100 ? stat.base_stat : 100}%;"></div>
            </li>`
}

function statPokemonList(pokemon) {
    const statsLi = pokemon.stats.map(stat => statsPokemonToLI(stat)).join('')
    document.querySelector('.text-model,.stats').innerHTML = statsLi
}

function abilitiesPokemonList(pokemon) {
    const abilitiesLI = pokemon.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')
    document.querySelector('.text-model,.abilities').innerHTML = abilitiesLI
}

function modalDetailPokemon(pokemonNumber) {
    
    openModal()
    
    pokeApi.getPokemon(pokemonNumber)
        .then(pokemon => {
            
            const classList = document.querySelector('.pokemon-modal .content-modal').classList
            classList.remove(...classList)
            classList.add('content-modal', pokemon.types[0].type.name)

            document.querySelector('.pokemon-modal h3').innerHTML = pokemon.name

            document.querySelector('.body-modal .image-modal img')
                .setAttribute('src', pokemon.sprites.other.home.front_default)
            document.querySelector('.body-modal .image-modal img')
                .setAttribute('src', pokemon.sprites.other.home.front_default)

            abilitiesPokemonList(pokemon)
            statPokemonList(pokemon)
            transitionStatusbar()
        })

}
loadPokemonItens(offset, limit)


loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
closeModalButton.addEventListener('click', () => closeModal())