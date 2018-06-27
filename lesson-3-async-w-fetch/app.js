(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');


    function addImage(images) {
        let htmlContent = '';
        if (images && images.results && images.results[0]) {
            const firstImage = images.results[0];

            // template to display the retrieved data in
            htmlContent = `<figure>
                <a href="${firstImage.urls.full}" target="blank"><img src="${firstImage.urls.regular}" alt="${searchedForText}"></a>
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = `<div class="error-no-image">No images available</div>`;
        }

        // place this the filled template into the DOM
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }


    function addArticles(data) {
        let htmlContent = '<ul></ul>';

        if (data.response && data.response.docs && data.response.docs.length > 1) {

            htmlContent =
            '<ul>' + data.response.docs.map(article => `<li class="article">
                    <h2>${article.headline.main}</h2>
                    <p>${article.snippet}</p>
                    <p><a href="${article.web_url}">read more...</a><p>
                </li>`
            ).join('') + '</ul>';
        } else {
            htmlContent = '<div class="error-no-articles">No Articles Available</div>';
        }

        responseContainer.insertAdjacentHTML('beforeend', htmlContent);

    }

    function requestError(e, part) {
        console.log(e);
        console.log(part);
        let location = 'beforeend';
        if (part === 'image') {
            location = 'afterbegin';
        }
        responseContainer.insertAdjacentHTML(location, `<p>Oh no! There was a <strong class="network-warning">${e}</strong>, when making a request for the <em>${part}</em>.</p>`);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // images request
        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID ce2c5da956bfbaae9c061570f5291bb458285dad45eb862aa796727af35cbf70'
            }
        })
        // the object is returned in the body {...} and must be parsed first before it can be used
        .then(response => response.json())
        // after returning the new JSON parsed object above we are then able pass it to addImage to start doing work with the object to retrieve the image
        .then(addImage)
        .catch(e => requestError(e, 'image'));


        // articles request
        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=7286bc40910d4f64bba8bdbb7041b789`)
        .then(response => response.json())
        // as with above, after returning the new JSON parsed object above, we are then able to pass it to addArticles to start doing work with the object to retrieve the articles
        .then(addArticles)
        .catch(e => requestError(e, 'articles'));
    });
})();
