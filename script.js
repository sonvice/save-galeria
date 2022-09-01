const grid = document.getElementById('grid');
const btnFotos = document.getElementById('fotos');
const btnFavoritas = document.getElementById('favoritos');
const counter = document.getElementById('counter');
const loader = document.getElementById('loader');
const title = document.getElementById('title-text');
const select = document.getElementById('select');
//Star fill gold
let iconStart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="star"><path fill="gold" d="M0 0h24v24H0z"/><path d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"/></svg>`;


//Datos url api
let page = 1;
let limit = 30;
let urlGetFotos = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`

let arrFotos = [];
let favoritos = {};
let classFill;

function imgLoad() {
    loader.style.display = 'none';
}

function createElementDom(resultadoEvent) {
    const fullArr = resultadoEvent === 'resultado' ? arrFotos : Object.values(favoritos);
    fullArr.forEach((element) => {
        // console.log(element)
        //Card
        const card = document.createElement('div');
        card.classList.add('card');
        //imag
        const boxImg = document.createElement('a');
        boxImg.href = element.download_url;
        boxImg.target = '_blank';
        boxImg.classList.add('img-box');
        const img = document.createElement('img');
        img.width = 363;
        img.height = 240;
        img.loading = 'lazy';
        img.style.backgroundColor = 'hsl(34, 100%, 71%)';
        img.src = `https://picsum.photos/id/${element.id}/${363 * 2}/${240 * 2}.jpg`;
        img.addEventListener('load', () => {
            ready = true
        });
        //Footer card
        const footerCard = document.createElement('div');
        footerCard.classList.add('footer-card', 'd-flex');
        //Name content
        const nameContent = document.createElement('div');
        nameContent.classList.add('name', 'd-flex');
        //Avatar
        const avatar = document.createElement('span');
        avatar.classList.add('avatar', 'd-flex');
        avatar.textContent = element.author.charAt(0);
        const nameAuthor = document.createElement('span');
        nameAuthor.classList.add('name');
        nameAuthor.textContent = element.author;
        //Star
        const star = document.createElement('span');
        star.classList.add('star-favorite');
        star.setAttribute('onclick', `guardarFavoritos('${element.id}')`);
        let iconStart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" id=${element.id}><path fill="none" d="M0 0h24v24H0z"/><path d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"/></svg>`;
        //Icon Delete
        let iconDelete = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="#ff9f1a" d="M7 4V2h10v2h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5zM6 6v14h12V6H6zm3 3h2v8H9V9zm4 0h2v8h-2V9z"/></svg>`
        //Condición
        if (resultadoEvent === 'resultado') {
            title.textContent = 'Todas las fotos';
            star.innerHTML = iconStart;
            document.querySelector('.list__item-fotos').classList.add('active');
            document.querySelector('.list__item-favoritos').classList.remove('active');
            select.style.display = 'block';

        } else {
            title.textContent = 'Favoritos';
            star.setAttribute('onclick', `quitarFavoritos('${element.id}')`);
            star.innerHTML = iconDelete;
            document.querySelector('.list__item-favoritos').classList.add('active');
            document.querySelector('.list__item-fotos').classList.remove('active');
            select.style.display = 'none';
        }
        //Download icon
        const downloadIcon = document.createElement('a');
        downloadIcon.classList.add('download');
        downloadIcon.href = element.url;
        downloadIcon.setAttribute('download', 'img');
        downloadIcon.target = '_blank';

        let icoStart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z"/></svg>`
        downloadIcon.innerHTML = icoStart;
        //Append
        boxImg.append(img)
        nameContent.append(avatar, nameAuthor);
        footerCard.append(nameContent, star)
        card.append(boxImg, footerCard, downloadIcon);
        grid.appendChild(card);


    })

}


//Actualizar con los favoritos del LocalStorage
function fotosFavoritasLocal(resultadoEvent) {

    if (localStorage.getItem("imgFavorita")) {
        favoritos = JSON.parse(localStorage.getItem('imgFavorita'));

    }

    grid.textContent = '';
    createElementDom(resultadoEvent);
    loader.style.display = 'none';
    //Actulizar color icono star
    addClassStar()
}


//Fetch de imagenes
async function getFotos() {

    loader.style.display = 'flex';
    try {
        const response = await fetch(urlGetFotos);
        arrFotos = await response.json();
        //Pintar card
        fotosFavoritasLocal('resultado');
    } catch (err) {
        console.log(err)
    }
}

function selectPage() {

    select.addEventListener('change', (e) => {
        page = e.target.value
        urlGetFotos = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
        getFotos()
        window.scrollTo(0, 0);
    })
    loader.style.display = 'flex';
}
selectPage()



//Guardar favoritos en localStorage
function guardarFavoritos(idStar) {
    arrFotos.forEach((imgFavorita) => {

        if (imgFavorita.id == idStar && !favoritos[idStar]) {
            favoritos[idStar] = imgFavorita;
            // let classFavourite = 'colorFill'
            localStorage.setItem('imgFavorita', JSON.stringify(favoritos));
            let start = document.getElementById(idStar)
            start.classList.add('colorFill');
            start.parentNode.parentNode.style.backgroundColor = 'var(--secondary-dark)';

        }
        getCounterLocal();
    })
}

//Quitar favoritos
function quitarFavoritos(idStar) {
    if (favoritos[idStar]) {
        delete favoritos[idStar];
        localStorage.setItem('imgFavorita', JSON.stringify(favoritos));
        fotosFavoritasLocal('favoritos');
    }
    getCounterLocal();
}

//Counter
function getCounterLocal() {

    if (localStorage.getItem('imgFavorita')) {
        counter.textContent = Object.values(JSON.parse(localStorage.getItem('imgFavorita'))).length
    }
}

//Añadiendo clase a icon star
function addClassStar() {
    if (localStorage.getItem('imgFavorita')) {
        let fav = Object.values(JSON.parse(localStorage.getItem('imgFavorita')));
        fav.forEach(el => {
            if (document.getElementById(el.id)) {

                document.getElementById(el.id).classList.add('colorFill')
                document.getElementById(el.id).parentNode.parentNode.style.backgroundColor = 'var(--secondary-dark)';
            }
        })
    }
}


getCounterLocal()
getFotos()




