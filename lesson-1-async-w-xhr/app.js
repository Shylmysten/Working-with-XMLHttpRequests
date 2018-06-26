(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText = '';

    const responseContainer = document.querySelector('#response-container');


    function addImage() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);
        //console.log(data);

        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];

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

    function addArticles() {
        let htmlContent = '<ul></ul>';

        // the .responseText property  holds the text of the async request's response and must be parsed from text to a JSON object
        const data = JSON.parse(this.responseText);

        console.log(data.response.docs[0]);

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

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('I was clicked on!');
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;


        // A. image request

        // 1. Create an XHR object with the XMLHttpRequest constructor function
        const imgRequest = new XMLHttpRequest();
        // 2. use the .open() method to set the HTTP method and the URL of the resource to be fetched
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        // 3. use the .setRequestHeader() method if required, send a header request
        imgRequest.setRequestHeader('Authorization', 'Client-ID ce2c5da956bfbaae9c061570f5291bb458285dad45eb862aa796727af35cbf70');
        // 4. set this to a function that will run upon successful fetch
        imgRequest.onload = addImage;
        // 5. set the .onerror property - set this to a function that will run when an error occurs

        // 6. use the .send() methood to sent the request
        imgRequest.send();

        // article request
        const articleRequest = new XMLHttpRequest();
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=7286bc40910d4f64bba8bdbb7041b789`);
        articleRequest.onload = addArticles;
        articleRequest.send();
    });
})();
