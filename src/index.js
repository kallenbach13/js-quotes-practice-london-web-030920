document.addEventListener("DOMContentLoaded", function() {
// api
const apiHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

const get = (url) => {
    return fetch(url).then(resp => resp.json())
}

const post = (url, data) => {
    return fetch(url, {
      method: "POST",
      headers: apiHeaders,
      body: JSON.stringify(data),
    }).then((resp) => resp.json());
  };

const destroy = (url, id) => {
    debugger
    return fetch(url + id, {
      method: "DELETE",
    }).then((resp) => resp.json());
};

const API = {get, post, destroy}

// constants
const quotesUrl = "http://localhost:3000/quotes?_embed=likes"
const likesUrl = "http://localhost:3000/likes/"

const quoteList = document.querySelector("#quote-list")
const quoteForm = document.querySelector("#new-quote-form")
quoteForm.addEventListener("submit", (e) => {
const newQuote = {quote: e.target[0].value , author: e.target[1].value}
API.post(quotesUrl, newQuote).then(returnedQuote =>
    newQuoteCard(returnedQuote)
  )

}) 


//functions

    const getAllQuotes = () => {
        API.get(quotesUrl).then(quotes => quotes.forEach(innerQuote => newQuoteCard(innerQuote)))
    }

    const newQuoteCard = (innerQuote) => {
        const li = document.createElement("li")
        li.className = "quote-card"

        const blockquote = document.createElement("blockquote")
        blockquote.className = "blockquote"

        const p = document.createElement("p")
        p.className = "mb-0"
        p.innerText = innerQuote.quote

        const footer = document.createElement("footer")
        footer.className = "blockquote-footer"
        footer.innerText = innerQuote.author

        const br = document.createElement("br")

        const likeButton = document.createElement("button")
        likeButton.className = "btn-success"
        likeButton.innerText = "Likes:"

        likeButton.addEventListener("click", () => likeQuote(innerQuote, span))

        const span = document.createElement("span")
        span.innerText = innerQuote.likes.length

        const deleteButton = document.createElement("button")
        deleteButton.className = "btn-danger"
        deleteButton.innerText = "Delete"

        deleteButton.addEventListener("click", () => {
            API.destroy(quotesUrl, innerQuote.id).then(() => {
            li.remove()
             });
        })

        likeButton.append(span)

        blockquote.append(p, footer, br, likeButton, deleteButton)

        li.append(blockquote)

        quoteList.append(li)
    }

    const likeQuote = (innerQuote, span) => {
        API.post(likesUrl, {quoteId: innerQuote.id}).then(() => {
            ++ span.innerText
     })
      }

    getAllQuotes()

});