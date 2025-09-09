export const handler = async (event) => {
  // uložené výsledky si držíme v paměti (Netlify edge funkce resetuje při novém buildu)
  if (!global.winnersStore) {
    global.winnersStore = {};
  }

  const today = new Date().toISOString().slice(0, 10);

  if (event.httpMethod === "POST") {
    const { nick, time, duration, category } = JSON.parse(event.body);

    if (!global.winnersStore[today]) {
      global.winnersStore[today] = [];
    }

    // přidat nový výsledek
    global.winnersStore[today].push({ nick, time, duration, category });

    // převést duration na sekundy pro porovnání
    const parseDuration = (str) => {
      const [m, s] = str.split(":").map(Number);
      return m * 60 + s;
    };

    // seřadit podle času (nejrychlejší nahoru)
    global.winnersStore[today].sort(
      (a, b) => parseDuration(a.duration) - parseDuration(b.duration)
    );

    // uříznout jen top 300 nejrychlejších
    global.winnersStore[today] = global.winnersStore[today].slice(0, 300);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  }

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify(global.winnersStore[today] || []),
    };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
