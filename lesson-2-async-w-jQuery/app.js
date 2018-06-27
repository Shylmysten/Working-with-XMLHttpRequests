/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    function addImage(images) {

        if (images && images.results && images.results[0]) {
            const firstImage = images.results[0];

            responseContainer.insertAdjacentHTML('afterbegin', `<figure>
            <img src="${firstImage.urls.small}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`
            );
        }
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
        if (part === 'image') {
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning error-images>part</p>`);
        } else {
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning error-articles>part</p>`);
        }

    }


    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // images request
        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: 'Client-ID ce2c5da956bfbaae9c061570f5291bb458285dad45eb862aa796727af35cbf70'
            }
        }).done(addImage).fail(function (err) {
            console.log(err);
            requestError(err, 'image');
        });

        // articles request
        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=7286bc40910d4f64bba8bdbb7041b789`
        }).done(addArticles)
        .fail(function (err) {
            requestError(err, 'articles');
        });

    });
})();
