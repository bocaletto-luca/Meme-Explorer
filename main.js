  /*************************************************************************************
     * EN: Meme Explorer App
     * IT: Meme Explorer App
     * ------------------------------------------------------------------------------
     * EN: This app fetches trending meme images using a free Meme API.
     *     (Endpoint used: https://meme-api.com/gimme).
     *     The app displays each meme in a social-feed style interface with a Bootstrap
     *     card that shows the meme image, title, subreddit information, a "like" button,
     *     and a "share" button to open Twitter's share window. A "Load More Memes" button
     *     fetches additional memes.
     *
     * IT: Questa app scarica immagini di meme utilizzando un'API gratuita.
     *     (Endpoint usato: https://meme-api.com/gimme).
     *     L'app visualizza ogni meme in un'interfaccia in stile feed social, con una card Bootstrap
     *     che mostra l'immagine del meme, il titolo, il nome del subreddit (se disponibile), un pulsante
     *     "mi piace" e un pulsante "condividi" per aprire la finestra di Twitter. Un pulsante "Carica altri meme"
     *     serve per scaricare ulteriori meme.
     *************************************************************************************/
  
    // EN: Select DOM elements // IT: Seleziona gli elementi DOM
    const memeContainer = document.getElementById("memeContainer");
    const loadMoreBtn = document.getElementById("loadMoreBtn");

    // EN: Function to fetch a random meme from the API using the updated endpoint
    // IT: Funzione per scaricare un meme casuale dall'API (endpoint aggiornato)
    async function fetchMeme() {
      const apiUrl = "https://meme-api.com/gimme";
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response not OK: " + response.status);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching meme:", error);
        return null;
      }
    }
    
    // EN: Function to create and display a meme card
    // IT: Funzione per creare e visualizzare una card per il meme
    async function addMemeCard() {
      const memeData = await fetchMeme();
      if (!memeData) {
        // EN: If no meme is fetched, display an error message card
        // IT: Se il meme non viene scaricato, mostra una card di errore
        const errorCol = document.createElement("div");
        errorCol.className = "col-12";
        errorCol.innerHTML = "<p class='text-center text-danger'>Unable to fetch meme. Please try again later. / Impossibile scaricare il meme, riprova più tardi.</p>";
        memeContainer.appendChild(errorCol);
        return;
      }
      
      // EN: Create a column div for responsiveness
      // IT: Crea un div colonna per la responsività
      const colDiv = document.createElement("div");
      colDiv.className = "col-12 col-md-6 col-lg-4";
      
      // EN: Create a Bootstrap card for the meme
      // IT: Crea una card Bootstrap per il meme
      const card = document.createElement("div");
      card.className = "card meme-card h-100";
      
      // EN: Add the meme image if the URL exists
      // IT: Aggiungi l'immagine del meme se l'URL esiste
      if (memeData.url) {
        const img = document.createElement("img");
        img.src = memeData.url;
        img.alt = memeData.title || "Meme Image";
        img.className = "card-img-top img-fluid";
        card.appendChild(img);
      }
      
      // EN: Create the card body
      // IT: Crea il corpo della card
      const cardBody = document.createElement("div");
      cardBody.className = "card-body d-flex flex-column";
  
      // EN: Meme title (or "Untitled" if missing)
      // IT: Titolo del meme (oppure "Untitled" se mancante)
      const title = document.createElement("h5");
      title.className = "card-title";
      title.textContent = memeData.title ? memeData.title : "Untitled";
      cardBody.appendChild(title);
      
      // EN: Subreddit information if available
      // IT: Informazioni sul subreddit se disponibili
      if (memeData.subreddit) {
        const subreddit = document.createElement("p");
        subreddit.className = "card-text text-muted";
        subreddit.textContent = "r/" + memeData.subreddit;
        cardBody.appendChild(subreddit);
      }
      
      // EN: Create a "like" button and counter
      // IT: Crea un pulsante "mi piace" e un contatore
      const likeDiv = document.createElement("div");
      likeDiv.className = "d-flex align-items-center mt-auto";
      const likeBtn = document.createElement("button");
      likeBtn.className = "btn btn-sm btn-outline-primary like-btn me-2";
      likeBtn.textContent = "Like";
      const likeCount = document.createElement("span");
      likeCount.textContent = " 0 likes";
      likeBtn.addEventListener("click", () => {
        let count = parseInt(likeCount.textContent);
        count++;
        likeCount.textContent = " " + count + " likes";
      });
      likeDiv.appendChild(likeBtn);
      likeDiv.appendChild(likeCount);
      cardBody.appendChild(likeDiv);
      
      // EN: Create a "Share on Twitter" button
      // IT: Crea un pulsante "Condividi su Twitter"
      const shareBtn = document.createElement("button");
      shareBtn.className = "btn btn-sm btn-info mt-2";
      shareBtn.textContent = "Share on Twitter";
      shareBtn.addEventListener("click", () => {
        // EN: Use memeData.postLink (if available) or memeData.url as the share URL
        // IT: Usa memeData.postLink (se disponibile) oppure memeData.url come URL per la condivisione
        const shareLink = memeData.postLink || memeData.url;
        const tweetText = encodeURIComponent(`"${memeData.title}"\nCheck out this meme: ${shareLink}`);
        const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
        window.open(tweetUrl, "_blank");
      });
      cardBody.appendChild(shareBtn);
      
      card.appendChild(cardBody);
      colDiv.appendChild(card);
      memeContainer.appendChild(colDiv);
    }
    
    // EN: Event listener for "Load More Memes" button
    // IT: Gestore dell'evento per il pulsante "Carica altri meme"
    loadMoreBtn.addEventListener("click", addMemeCard);
    
    // EN: Load initial memes (6 memes) on page load
    // IT: Carica un set iniziale di meme (6 meme) al caricamento della pagina
    async function loadInitialMemes() {
      memeContainer.innerHTML = "";
      for (let i = 0; i < 6; i++) {
        await addMemeCard();
      }
    }
    loadInitialMemes();
