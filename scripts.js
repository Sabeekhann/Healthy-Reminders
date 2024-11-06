// Helper functions for caching
function saveDailyQuote(type, text, reference) {
    const quoteData = { text, reference, date: new Date().toDateString() };
    localStorage.setItem(type, JSON.stringify(quoteData));
}

function loadDailyQuote(type) {
    const savedQuote = JSON.parse(localStorage.getItem(type));
    const today = new Date().toDateString();

    if (savedQuote && savedQuote.date === today) {
        return savedQuote;
    }
    return null;
}

// Fetch Quranic Ayat from Al-Quran Cloud API
async function fetchQuranAyat() {
    const ayat = loadDailyQuote("ayat");
    if (ayat) {
        displayAyat(ayat.text, ayat.reference);
        return;
    }

    try {
        const surahNumber = Math.floor(Math.random() * 114) + 1;
        const ayahNumber = Math.floor(Math.random() * 7) + 1;

        const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/en.asad`);
        const data = await response.json();

        if (data.status === "OK") {
            const ayatText = data.data.text;
            const ayatReference = `${data.data.surah.englishName} (${data.data.surah.number}:${data.data.numberInSurah})`;
            saveDailyQuote("ayat", ayatText, ayatReference);
            displayAyat(ayatText, ayatReference);
        } else {
            displayAyat("Could not load Ayat for today.");
        }
    } catch (error) {
        console.error("Error fetching Ayat:", error);
        displayAyat("Could not load Ayat for today.");
    }
}

// Display Quranic Ayat
function displayAyat(text, reference = "") {
    document.getElementById("ayat").innerText = text;
    document.getElementById("ayat-reference").innerText = reference;
}

// Fetch Random Hadith from Al-Quran Cloud API
async function fetchHadith() {
    const hadith = loadDailyQuote("hadith");
    if (hadith) {
        displayHadith(hadith.text, hadith.reference);
        return;
    }

    try {
        const response = await fetch("https://api.alquran.cloud/v1/hadith/random/en");
        const data = await response.json();

        if (data.status === "OK") {
            const hadithText = data.data.hadith[0].text; // English text of Hadith
            const hadithReference = `${data.data.collection} - Hadith ${data.data.hadith[0].number}`;
            saveDailyQuote("hadith", hadithText, hadithReference);
            displayHadith(hadithText, hadithReference);
        } else {
            displayHadith("Could not load Hadith for today.");
        }

    } catch (error) {
        console.error("Error fetching Hadith:", error);
        displayHadith("Could not load Hadith for today.");
    }
}

// Display Hadith
function displayHadith(text, reference = "") {
    document.getElementById("hadith").innerText = text;
    document.getElementById("hadith-reference").innerText = reference;
}

// Refresh both quotes
function refreshQuotes() {
    localStorage.clear();
    fetchQuranAyat();
    fetchHadith();
}

// Initial fetch on page load
fetchQuranAyat();
fetchHadith();
