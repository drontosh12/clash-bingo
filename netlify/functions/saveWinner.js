// netlify/functions/saveWinner.js

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Použij POST metodu" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Zatím jen vypíšem co přišlo (místo DB nebo uložiště)
    console.log("Nový výherce:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Výherce zapsán!",
        data,
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Neplatný JSON", details: err.message }),
    };
  }
}
