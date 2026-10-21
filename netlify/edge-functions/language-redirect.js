export default async (request, context) => {
    const url = new URL(request.url);
    if (url.pathname !== "/") {
          return;
    }

    const userAgent = request.headers.get("user-agent") || ""; const isBot = /bot|crawl|spider|slurp|facebookexternalhit|embedly|slackbot|whatsapp|telegrambot|discordbot|applebot/i.test(userAgent); if (isBot) { return context.next(); } const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/hrb_lang=(es|en)/);

    let lang;
    if (match) {
          lang = match[1];
    } else {
          const country = context.geo?.country?.code;
          const latam = ["AR","MX","CO","CL","PE","VE","EC","GT","CU","BO","DO","HN","PY","SV","NI","CR","PA","UY"];
          lang = (country && !latam.includes(country)) ? "en" : "es";
    }

    if (lang === "en") {
          return new Response(null, {
                  status: 302,
                  headers: {
                            "Location": new URL("/hrbaires_home_en.html", url).toString(),
                            "Set-Cookie": "hrb_lang=en; Max-Age=31536000; Path=/"
                  }
          });
    }

    const res = await context.next();
    res.headers.append("Set-Cookie", "hrb_lang=es; Max-Age=31536000; Path=/");
    return res;
};

export const config = { path: "/" };
