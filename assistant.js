/* Sea2Sky Traders - shopping assistant (English, Arabic, Japanese).
   Answers questions about products, prices, shipping, payment, returns and bulk orders
   from the store's own information (catalog.json), and hands anything else to WhatsApp.

   AI_ENDPOINT: when a server with an AI model is set up later, put its address here.
   The assistant then sends each question there ({question, lang}) and shows the
   "answer" it returns. While it is empty, everything works inside the browser. */
(function () {
  var AI_ENDPOINT = "";
  var WA = "923008697543";

  var LANG = (document.documentElement.lang || "en").slice(0, 2);
  if (["en", "ar", "ja"].indexOf(LANG) === -1) { LANG = "en"; }
  var SCRIPT = document.currentScript && document.currentScript.src;
  var BASE = SCRIPT ? SCRIPT.replace(/assistant\.js.*$/, "") : "/";
  var PAGE_BASE = LANG === "en" ? BASE : BASE + LANG + "/";

  /* ---------- Words ---------- */
  var T = {
    en: {
      btn: "Ask Sea2Sky", tag: "Instant answers, 24/7", title: "Sea2Sky Assistant", sub: "Products, prices, shipping and payment, answered instantly",
      hello: "Hello! I can help you find products, check prices and explain shipping, payment and bulk orders. What are you looking for?",
      placeholder: "Type your question...", send: "Send", close: "Close",
      chips: ["Shipping to UAE", "Basmati rice prices", "Payment methods", "Bulk / wholesale order", "Gift boxes", "Returns"],
      found: "Here is what I found:", onRequest: "Price on request", view: "View in shop", add: "Add to cart", added: "Added",
      cats: { "dry-fruits": "Dry fruits", "pink-salt": "Himalayan pink salt", "rice": "Basmati rice", "fresh-fruits": "Fresh fruits" },
      catIntro: "Our {c} range:",
      shipAll: "We ship worldwide from Lahore. Estimated delivery times:\n• Pakistan: 2–4 business days\n• UAE & Saudi Arabia: 4–8 business days\n• UK: 7–12 business days\n• Europe: 7–14 business days\n• USA & Canada: 8–14 business days\n• Japan: 8–14 business days\n• Rest of world: 10–18 business days\nOrders are packed within 1–2 business days. The exact shipping cost is confirmed on WhatsApp.",
      shipOne: "Delivery to {r}: about {d} business days after dispatch. Orders are packed within 1–2 business days, and the shipping cost is confirmed on WhatsApp before you pay.",
      regions: { pk: "Pakistan", gulf: "the UAE and Saudi Arabia", jp: "Japan", uk: "the UK", us: "the USA and Canada", eu: "Europe" },
      pay: "You can pay by:\n• PayPal\n• Visa / Mastercard (secure payment link)\n• Bank transfer\n• JazzCash / Easypaisa\n• Cash on delivery (Pakistan only)\nChoose your method in the cart. We confirm your order and shipping cost first, then send the payment details.",
      returns: "If an item arrives damaged or wrong, message us on WhatsApp within 3 days of delivery with a photo. We arrange a replacement, exchange or refund. For food safety, food items are only returned if they arrive damaged or spoiled.",
      bulk: "Yes, we supply bulk and wholesale orders, from retail packs up to 25kg bags and export cartons. Send us the product, quantity and destination on WhatsApp and we reply with a quote and preparation time.",
      track: "Once your order is dispatched, we send the tracking number on WhatsApp.",
      contact: "WhatsApp / call: +92 300 8697543\nEmail: sales@sea2skytraders.com\nOffice: 100, Sodhran Block, Bahria Orchard Phase 1, Lahore, Pakistan\nHours: Open 24 hours, 7 days a week",
      currency: "Use the currency menu at the top of the page to see prices in USD, AED, SAR, GBP, EUR or JPY. Orders are charged in US dollars; other currencies are approximate.",
      quality: "Our products are natural, carefully selected and packed with care. For certificates or detailed specifications, ask our team on WhatsApp.",
      storage: "Keep dry fruits in an airtight container in a cool, dark place, and in the fridge for longer storage. Our journal has full storage guides.",
      greet: "Hello! How can I help you today?",
      thanks: "You're welcome! Anything else I can help with?",
      fallback: "I don't have a sure answer for that. Our team can answer on WhatsApp right away.",
      waBtn: "Ask on WhatsApp", waMsg: "Hi, I have a question: ",
      orderHint: "Ready to order? Add items to your cart and send your order on WhatsApp in one tap."
    },
    ar: {
      btn: "اسأل مساعد Sea2Sky", tag: "إجابات فورية على مدار الساعة", title: "مساعد Sea2Sky", sub: "المنتجات والأسعار والشحن والدفع، إجابات فورية",
      hello: "مرحباً! يمكنني مساعدتك في العثور على المنتجات ومعرفة الأسعار وشرح الشحن والدفع وطلبات الجملة. عمّ تبحث؟",
      placeholder: "اكتب سؤالك...", send: "إرسال", close: "إغلاق",
      chips: ["الشحن إلى الإمارات", "أسعار أرز البسمتي", "طرق الدفع", "طلب جملة", "علب الهدايا", "الإرجاع"],
      found: "إليك ما وجدته:", onRequest: "السعر عند الطلب", view: "عرض في المتجر", add: "أضف إلى السلة", added: "تمت الإضافة",
      cats: { "dry-fruits": "الفواكه المجففة", "pink-salt": "ملح الهيمالايا الوردي", "rice": "أرز البسمتي", "fresh-fruits": "الفواكه الطازجة" },
      catIntro: "مجموعتنا من {c}:",
      shipAll: "نشحن إلى جميع أنحاء العالم من لاهور. مدة التوصيل المتوقعة:\n• باكستان: 2–4 أيام عمل\n• الإمارات والسعودية: 4–8 أيام عمل\n• بريطانيا: 7–12 يوم عمل\n• أوروبا: 7–14 يوم عمل\n• أمريكا وكندا: 8–14 يوم عمل\n• اليابان: 8–14 يوم عمل\n• باقي الدول: 10–18 يوم عمل\nتتم تعبئة الطلبات خلال 1–2 يوم عمل، ونؤكد تكلفة الشحن عبر واتساب.",
      shipOne: "التوصيل إلى {r}: حوالي {d} أيام عمل بعد الشحن. تتم تعبئة الطلب خلال 1–2 يوم عمل، ونؤكد تكلفة الشحن عبر واتساب قبل الدفع.",
      regions: { pk: "باكستان", gulf: "الإمارات والسعودية", jp: "اليابان", uk: "بريطانيا", us: "أمريكا وكندا", eu: "أوروبا" },
      pay: "طرق الدفع المتاحة:\n• PayPal\n• Visa / Mastercard (رابط دفع آمن)\n• تحويل بنكي\n• JazzCash / Easypaisa\n• الدفع عند الاستلام (داخل باكستان فقط)\nاختر الطريقة في السلة. نؤكد طلبك وتكلفة الشحن أولاً ثم نرسل تفاصيل الدفع.",
      returns: "إذا وصل منتج تالفاً أو غير صحيح، راسلنا عبر واتساب خلال 3 أيام من الاستلام مع صورة، وسنرتب الاستبدال أو الاسترداد. حفاظاً على سلامة الغذاء، لا تُقبل إعادة المواد الغذائية إلا إذا وصلت تالفة.",
      bulk: "نعم، نوفر طلبات الجملة والكميات الكبيرة، من عبوات التجزئة حتى أكياس 25 كغ وكراتين التصدير. أرسل لنا المنتج والكمية والوجهة عبر واتساب وسنرد بعرض سعر ومدة التجهيز.",
      track: "بعد شحن طلبك نرسل لك رقم التتبع عبر واتساب.",
      contact: "واتساب / اتصال: ‎+92 300 8697543\nالبريد: sales@sea2skytraders.com\nالمكتب: 100، سودران بلوك، بحرية أوركارد المرحلة 1، لاهور، باكستان\nساعات العمل: مفتوح 24 ساعة طوال أيام الأسبوع",
      currency: "استخدم قائمة العملة أعلى الصفحة لعرض الأسعار بالدولار أو الدرهم أو الريال أو الجنيه أو اليورو أو الين. يتم احتساب الطلبات بالدولار الأمريكي، والعملات الأخرى تقريبية.",
      quality: "منتجاتنا طبيعية ومختارة بعناية ومعبأة باهتمام. للشهادات أو المواصفات التفصيلية، اسأل فريقنا عبر واتساب.",
      storage: "احفظ الفواكه المجففة في وعاء محكم الإغلاق في مكان بارد ومظلم، وفي الثلاجة للتخزين الأطول. تجد أدلة الحفظ الكاملة في مدونتنا.",
      greet: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
      thanks: "على الرحب والسعة! هل هناك شيء آخر يمكنني مساعدتك فيه؟",
      fallback: "ليس لدي إجابة مؤكدة على ذلك. يمكن لفريقنا الرد عليك فوراً عبر واتساب.",
      waBtn: "اسأل عبر واتساب", waMsg: "مرحباً، لدي سؤال: ",
      orderHint: "جاهز للطلب؟ أضف المنتجات إلى السلة وأرسل طلبك عبر واتساب بضغطة واحدة."
    },
    ja: {
      btn: "Sea2Skyに質問", tag: "24時間すぐに回答", title: "Sea2Sky アシスタント", sub: "商品・価格・配送・お支払いにすぐお答えします",
      hello: "こんにちは!商品探し、価格の確認、配送・お支払い・まとめ買いについてご案内します。何をお探しですか?",
      placeholder: "ご質問を入力...", send: "送信", close: "閉じる",
      chips: ["日本への配送", "バスマティ米の価格", "お支払い方法", "まとめ買い・卸売", "ギフトボックス", "返品について"],
      found: "見つかった商品:", onRequest: "価格はお問い合わせください", view: "ショップで見る", add: "カートに入れる", added: "追加しました",
      cats: { "dry-fruits": "ドライフルーツ", "pink-salt": "ヒマラヤピンクソルト", "rice": "バスマティ米", "fresh-fruits": "フレッシュフルーツ" },
      catIntro: "{c}の商品一覧:",
      shipAll: "ラホールから世界中へ発送しています。お届け目安:\n• パキスタン:2〜4営業日\n• UAE・サウジアラビア:4〜8営業日\n• 英国:7〜12営業日\n• ヨーロッパ:7〜14営業日\n• 米国・カナダ:8〜14営業日\n• 日本:8〜14営業日\n• その他の国:10〜18営業日\nご注文は1〜2営業日以内に梱包し、送料はWhatsAppでご案内します。",
      shipOne: "{r}へのお届け:発送後およそ{d}営業日です。ご注文は1〜2営業日以内に梱包し、お支払い前にWhatsAppで送料をご案内します。",
      regions: { pk: "パキスタン", gulf: "UAE・サウジアラビア", jp: "日本", uk: "英国", us: "米国・カナダ", eu: "ヨーロッパ" },
      pay: "お支払い方法:\n• PayPal\n• Visa / Mastercard(安全な決済リンク)\n• 銀行振込\n• JazzCash / Easypaisa\n• 代金引換(パキスタン国内のみ)\nカートでお選びください。ご注文と送料を確認後、お支払い情報をお送りします。",
      returns: "商品が破損・誤配送で届いた場合は、到着から3日以内に写真を添えてWhatsAppでご連絡ください。交換または返金で対応します。食品の安全のため、食品の返品は破損・傷みがあった場合のみ承ります。",
      bulk: "はい、小売パックから25kg袋・輸出用カートンまで、まとめ買い・卸売に対応しています。商品・数量・配送先をWhatsAppでお送りいただければ、お見積もりと準備期間をご連絡します。",
      track: "発送後、WhatsAppで追跡番号をお送りします。",
      contact: "WhatsApp / 電話:+92 300 8697543\nメール:sales@sea2skytraders.com\nオフィス:パキスタン、ラホール、バーリア・オーチャード フェーズ1、ソードラン・ブロック 100\n営業時間:24時間・年中無休",
      currency: "ページ上部の通貨メニューで、USD・AED・SAR・GBP・EUR・JPYの価格を表示できます。ご請求は米ドル建てで、その他の通貨は目安です。",
      quality: "当店の商品は天然素材を厳選し、丁寧に梱包しています。証明書や詳しい仕様はWhatsAppでお問い合わせください。",
      storage: "ドライフルーツは密閉容器に入れて涼しく暗い場所で保存し、長期保存は冷蔵庫へ。詳しい保存方法はジャーナルをご覧ください。",
      greet: "こんにちは!ご用件をお聞かせください。",
      thanks: "どういたしまして!他にお手伝いできることはありますか?",
      fallback: "その質問には確実にお答えできません。WhatsAppでスタッフがすぐにお答えします。",
      waBtn: "WhatsAppで質問", waMsg: "こんにちは。質問があります:",
      orderHint: "ご注文の準備はできましたか?カートに商品を入れて、ワンタップでWhatsAppから注文できます。"
    }
  }[LANG];

  /* ---------- Understanding the question ---------- */
  var KW = {
    greet: ["hi", "hello", "hey", "salam", "assalam", "aoa", "مرحبا", "السلام", "اهلا", "أهلا", "こんにちは", "こんばんは", "はじめまして"],
    thanks: ["thank", "thanks", "shukriya", "شكرا", "شكراً", "ありがとう"],
    ship: ["ship", "shipping", "deliver", "delivery", "how long", "days", "arrive", "courier", "شحن", "الشحن", "توصيل", "التوصيل", "يصل", "配送", "送料", "届", "発送", "何日"],
    pay: ["pay", "payment", "paypal", "card", "visa", "master", "bank", "transfer", "cod", "cash", "jazzcash", "easypaisa", "دفع", "الدفع", "بطاقة", "تحويل", "支払", "カード", "振込", "代引", "決済"],
    returns: ["return", "refund", "damage", "damaged", "broken", "wrong", "exchange", "replace", "إرجاع", "ارجاع", "استرداد", "تالف", "استبدال", "返品", "返金", "破損", "交換"],
    bulk: ["bulk", "wholesale", "export", "container", "distributor", "importer", "quote", "large order", "25kg", "جملة", "الجملة", "تصدير", "كميات", "موزع", "卸", "まとめ", "輸出", "業務用", "大量", "見積"],
    track: ["track", "tracking", "where is my order", "تتبع", "追跡"],
    contact: ["contact", "phone", "number", "whatsapp", "email", "call", "address", "office", "location", "hours", "تواصل", "هاتف", "رقم", "واتساب", "بريد", "عنوان", "مكتب", "連絡", "電話", "メール", "住所", "営業時間"],
    currency: ["currency", "aed", "sar", "dirham", "riyal", "yen", "euro", "pound", "gbp", "eur", "jpy", "عملة", "درهم", "ريال", "ين", "通貨", "円", "ドル"],
    quality: ["halal", "organic", "natural", "quality", "certificate", "fresh", "pure", "حلال", "عضوي", "طبيعي", "جودة", "شهادة", "ハラール", "オーガニック", "天然", "品質", "証明"],
    storage: ["store", "storage", "keep fresh", "shelf life", "حفظ", "تخزين", "保存", "賞味"]
  };
  var REGION = {
    gulf: ["uae", "dubai", "abu dhabi", "sharjah", "emirates", "saudi", "ksa", "riyadh", "jeddah", "dammam", "qatar", "kuwait", "oman", "bahrain", "gulf", "الإمارات", "الامارات", "دبي", "أبوظبي", "السعودية", "الرياض", "جدة", "الخليج", "قطر", "الكويت", "عمان", "البحرين", "アラブ", "ドバイ", "サウジ"],
    jp: ["japan", "tokyo", "osaka", "اليابان", "日本", "東京", "大阪"],
    uk: ["uk", "united kingdom", "england", "london", "britain", "بريطانيا", "لندن", "英国", "イギリス", "ロンドン"],
    us: ["usa", "united states", "america", "new york", "canada", "toronto", "أمريكا", "امريكا", "كندا", "米国", "アメリカ", "カナダ"],
    eu: ["europe", "germany", "france", "italy", "spain", "netherlands", "أوروبا", "اوروبا", "ألمانيا", "فرنسا", "ヨーロッパ", "欧州", "ドイツ", "フランス"],
    pk: ["pakistan", "lahore", "karachi", "islamabad", "باكستان", "لاهور", "كراتشي", "パキスタン"]
  };
  var DAYS = { pk: "2–4", gulf: "4–8", jp: "8–14", uk: "7–12", us: "8–14", eu: "7–14" };
  var CATW = {
    "rice": ["rice", "basmati", "chawal", "sella", "kernel", "1121", "1509", "irri", "أرز", "ارز", "بسمتي", "米", "ライス", "バスマティ"],
    "pink-salt": ["salt", "pink salt", "himalayan", "namak", "lamp", "ملح", "الملح", "塩", "ソルト", "岩塩"],
    "dry-fruits": ["dry fruit", "dry fruits", "dried", "nuts", "nut", "mewa", "فواكه مجففة", "مكسرات", "ドライフルーツ", "ナッツ"],
    "fresh-fruits": ["fresh fruit", "fresh fruits", "fruit basket", "mango", "kinnow", "فواكه طازجة", "مانجو", "フルーツ", "果物", "マンゴー"]
  };
  var SYN = {
    badam: "almond", pista: "pistachio", kaju: "cashew", akhrot: "walnut", khajoor: "date", khajur: "date", kishmish: "raisin",
    khubani: "apricot", aam: "mango", chawal: "rice", namak: "salt", gift: "gift", hadiya: "gift",
    "لوز": "almond", "فستق": "pistachio", "كاجو": "cashew", "جوز": "walnut", "تمر": "date", "زبيب": "raisin", "مشمش": "apricot",
    "مانجو": "mango", "هدية": "gift", "هدايا": "gift", "تفاح": "apple", "موز": "banana", "عنب": "grape",
    "アーモンド": "almond", "ピスタチオ": "pistachio", "カシュー": "cashew", "クルミ": "walnut", "デーツ": "date", "レーズン": "raisin",
    "アプリコット": "apricot", "マンゴー": "mango", "ギフト": "gift", "リンゴ": "apple", "りんご": "apple", "バナナ": "banana", "ブドウ": "grape", "ぶどう": "grape"
  };

  function norm(s) { return (" " + String(s).toLowerCase().replace(/[!?.,،؟。、!?:;()"']/g, " ").replace(/\s+/g, " ") + " "); }
  function has(q, list) {
    for (var i = 0; i < list.length; i++) {
      var w = list[i].toLowerCase();
      if (/^[a-z0-9 ]+$/.test(w) ? q.indexOf(" " + w) !== -1 : q.indexOf(w) !== -1) { return true; }
    }
    return false;
  }

  /* ---------- Catalog ---------- */
  var catalog = null;
  function loadCatalog() {
    if (catalog) { return Promise.resolve(catalog); }
    return fetch(BASE + "catalog.json").then(function (r) { return r.json(); }).then(function (d) { catalog = d; return d; })
      .catch(function () { catalog = []; return catalog; });
  }
  function pname(p) { return LANG === "en" ? p.name : (p[LANG] && p[LANG].name) || p.name; }
  function findProducts(q) {
    var en = q;
    Object.keys(SYN).forEach(function (k) { if (q.indexOf(k) !== -1) { en += " " + SYN[k] + " "; } });
    var scored = [];
    (catalog || []).forEach(function (p) {
      var hay = norm(p.name + " " + p.sub + " " + pname(p));
      var words = norm(en).trim().split(" ");
      var s = 0;
      words.forEach(function (w) {
        if (w.length < 3 && !/[^\x00-\x7f]/.test(w)) { return; }
        var stem = w.replace(/(es|s)$/, "");
        if (stem.length >= 3 && hay.indexOf(stem) !== -1) { s += 2; }
      });
      if (/[^\x00-\x7f]/.test(q) && pname(p) !== p.name && q.indexOf(pname(p).toLowerCase().slice(0, 3)) !== -1) { s += 1; }
      if (s > 0) { scored.push({ p: p, s: s }); }
    });
    scored.sort(function (a, b) { return b.s - a.s; });
    var top = scored.length ? scored[0].s : 0;
    return scored.filter(function (x) { return x.s >= top; }).map(function (x) { return x.p; }).slice(0, 6);
  }
  function categoryOf(q) {
    var found = null;
    Object.keys(CATW).forEach(function (c) { if (!found && has(q, CATW[c])) { found = c; } });
    return found;
  }

  /* ---------- Answer ---------- */
  function answer(raw) {
    var q = norm(raw);
    var region = null;
    Object.keys(REGION).forEach(function (r) { if (!region && has(q, REGION[r])) { region = r; } });
    var replies = [];

    if (has(q, KW.ship) || (region && !categoryOf(q))) {
      replies.push({ text: region ? T.shipOne.replace("{r}", T.regions[region]).replace("{d}", LANG === "ja" ? DAYS[region].replace("–", "〜") : DAYS[region]) : T.shipAll });
    }
    if (has(q, KW.pay)) { replies.push({ text: T.pay }); }
    if (has(q, KW.returns)) { replies.push({ text: T.returns }); }
    if (has(q, KW.bulk)) { replies.push({ text: T.bulk, wa: true }); }
    if (has(q, KW.track)) { replies.push({ text: T.track }); }
    if (has(q, KW.currency)) { replies.push({ text: T.currency }); }
    if (has(q, KW.quality)) { replies.push({ text: T.quality }); }
    if (has(q, KW.storage)) { replies.push({ text: T.storage, link: { href: PAGE_BASE + "blog.html#storing-dry-fruits", label: "→" } }); }
    if (has(q, KW.contact)) { replies.push({ text: T.contact, wa: true }); }

    var prods = findProducts(q);
    var cat = categoryOf(q);
    if (prods.length) {
      replies.push({ text: T.found, products: prods });
    } else if (cat) {
      replies.push({ text: T.catIntro.replace("{c}", T.cats[cat]), products: (catalog || []).filter(function (p) { return p.cat === cat; }).slice(0, 9) });
    }
    if (!replies.length && has(q, KW.thanks)) { replies.push({ text: T.thanks }); }
    if (!replies.length && has(q, KW.greet)) { replies.push({ text: T.greet }); }
    if (!replies.length) { replies.push({ text: T.fallback, wa: true, ask: raw }); }
    return replies;
  }

  /* ---------- Cart ---------- */
  function addToCart(name) {
    try {
      var c = JSON.parse(localStorage.getItem("s2sCart") || "[]");
      if (!Array.isArray(c)) { c = []; }
      c.push(name);
      localStorage.setItem("s2sCart", JSON.stringify(c));
      var el = document.getElementById("cartCount");
      if (el) { el.textContent = c.length; }
      return true;
    } catch (e) { return false; }
  }
  function money(usd) { return window.S2S && window.S2S.fmt ? window.S2S.fmt(usd) : "$" + usd; }

  /* ---------- Interface ---------- */
  var css = "" +
    ".s2s-ai-btn{position:fixed;left:20px;bottom:20px;z-index:9997;display:inline-flex;align-items:center;gap:10px;padding:8px 18px 8px 8px;border:1px solid rgba(227,201,143,.55);border-radius:999px;cursor:pointer;" +
    "background:linear-gradient(135deg,#0b2163,#1f4bb5);color:#fff;font:600 .88rem/1 var(--sans,'Figtree',system-ui,sans-serif);letter-spacing:.01em;box-shadow:0 18px 36px -14px rgba(11,33,99,.7);transition:transform .25s,box-shadow .25s}" +
    ".s2s-ai-btn:hover{transform:translateY(-2px);box-shadow:0 22px 40px -14px rgba(11,33,99,.8)}" +
    ".s2s-ai-btn .ic{position:relative;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#e3c98f,#b8904a);color:#0b2163;font-size:.95rem}" +
    ".s2s-ai-btn .dot{position:absolute;right:-1px;top:-1px;width:10px;height:10px;border-radius:50%;background:#1fbf6a;border:2px solid #0b2163}" +
    ".s2s-ai-btn small{display:block;font-size:.66rem;font-weight:500;color:#c9d6f5;margin-top:3px;letter-spacing:.04em}" +
    ".s2s-ai{position:fixed;left:20px;bottom:20px;z-index:9999;width:390px;max-width:calc(100vw - 24px);height:min(620px,calc(100vh - 120px));display:flex;flex-direction:column;" +
    "background:#fbf8f2;border:1px solid rgba(184,144,74,.35);border-radius:18px;overflow:hidden;box-shadow:0 40px 80px -30px rgba(11,33,99,.6);opacity:0;visibility:hidden;transform:translateY(16px);transition:opacity .25s,transform .25s,visibility .25s}" +
    ".s2s-ai.open{opacity:1;visibility:visible;transform:none}" +
    ".s2s-ai-head{display:flex;align-items:center;gap:12px;padding:16px 16px 14px;background:linear-gradient(135deg,#0b2163,#183f9e);color:#fff}" +
    ".s2s-ai-head .av{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#e3c98f,#b8904a);color:#0b2163;font-size:1.1rem;flex-shrink:0}" +
    ".s2s-ai-head b{display:block;font:700 1.02rem/1.2 var(--sans,system-ui)}.s2s-ai-head small{display:block;font-size:.74rem;color:#c9d3e6;line-height:1.35;margin-top:2px}" +
    ".s2s-ai-head button{margin-inline-start:auto;width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;cursor:pointer;font-size:1rem;flex-shrink:0}" +
    ".s2s-ai-log{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px}" +
    ".s2s-ai-msg{max-width:88%;padding:10px 13px;border-radius:14px;font-size:.9rem;line-height:1.55;white-space:pre-line;word-wrap:break-word}" +
    ".s2s-ai-msg.bot{background:#fff;border:1px solid #ece4d3;color:#141c2b;align-self:flex-start;border-end-start-radius:4px}" +
    ".s2s-ai-msg.me{background:#13358c;color:#fff;align-self:flex-end;border-end-end-radius:4px}" +
    ".s2s-ai-prods{display:grid;gap:8px;margin-top:8px}" +
    ".s2s-ai-p{display:grid;grid-template-columns:52px 1fr;gap:10px;align-items:center;padding:7px;border:1px solid #ece4d3;border-radius:10px;background:#fbf8f2}" +
    ".s2s-ai-p img{width:52px;height:52px;object-fit:cover;border-radius:8px;background:#f3eee4}" +
    ".s2s-ai-p b{display:block;font-size:.84rem;line-height:1.3;color:#13358c}.s2s-ai-p span{font-size:.8rem;color:#8a6a2c;font-weight:700}" +
    ".s2s-ai-p .acts{display:flex;gap:6px;margin-top:5px;flex-wrap:wrap}" +
    ".s2s-ai-p .acts a,.s2s-ai-p .acts button{font:600 .72rem/1 var(--sans,system-ui);padding:6px 9px;border-radius:999px;border:1px solid #13358c;color:#13358c;background:#fff;cursor:pointer;text-decoration:none}" +
    ".s2s-ai-p .acts button{background:#13358c;color:#fff}" +
    ".s2s-ai-wa{display:inline-flex;align-items:center;gap:7px;margin-top:8px;padding:8px 13px;border-radius:999px;background:#25d366;color:#fff!important;font-weight:700;font-size:.8rem;text-decoration:none}" +
    ".s2s-ai-chips{display:flex;gap:6px;overflow-x:auto;padding:0 14px 10px;scrollbar-width:none}.s2s-ai-chips::-webkit-scrollbar{display:none}" +
    ".s2s-ai-chips button{flex-shrink:0;padding:7px 12px;border-radius:999px;border:1px solid rgba(184,144,74,.5);background:#fff;color:#13358c;font:600 .76rem/1.2 var(--sans,system-ui);cursor:pointer}" +
    ".s2s-ai-form{display:flex;gap:8px;padding:12px;border-top:1px solid #ece4d3;background:#fff}" +
    ".s2s-ai-form input{flex:1;min-width:0;padding:11px 14px;border:1px solid #ddd3bf;border-radius:999px;font:400 .92rem var(--sans,system-ui);background:#fbf8f2;color:#141c2b}" +
    ".s2s-ai-form input:focus{outline:2px solid #b8904a;outline-offset:1px}" +
    ".s2s-ai-form button{width:44px;height:44px;border-radius:50%;border:0;background:linear-gradient(135deg,#e3c98f,#b8904a);color:#0b2163;cursor:pointer;font-size:1rem;flex-shrink:0}" +
    "html[dir=rtl] .s2s-ai-form button i{transform:scaleX(-1)}" +
    ".s2s-ai-typing{align-self:flex-start;padding:10px 14px;background:#fff;border:1px solid #ece4d3;border-radius:14px;display:flex;gap:4px}" +
    ".s2s-ai-typing i{width:6px;height:6px;border-radius:50%;background:#b8904a;animation:s2sdot 1s infinite}.s2s-ai-typing i:nth-child(2){animation-delay:.15s}.s2s-ai-typing i:nth-child(3){animation-delay:.3s}" +
    "@keyframes s2sdot{0%,80%,100%{opacity:.3}40%{opacity:1}}" +
    "@media (max-width:640px){.s2s-ai-btn{left:14px;bottom:14px;padding:6px 14px 6px 6px;font-size:.82rem}.s2s-ai-btn .ic{width:30px;height:30px}.s2s-ai-btn small{display:none}" +
    ".s2s-ai{right:0;left:0;bottom:0;width:100%;max-width:none;height:min(86vh,680px);border-radius:18px 18px 0 0}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var btn = document.createElement("button");
  btn.type = "button"; btn.className = "s2s-ai-btn";
  btn.setAttribute("aria-haspopup", "dialog"); btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = '<span class="ic" aria-hidden="true"><i class="fas fa-wand-magic-sparkles"></i><span class="dot"></span></span><span>' + T.btn + "<small>" + T.tag + "</small></span>";

  var box = document.createElement("section");
  box.className = "s2s-ai"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", T.title);
  box.innerHTML =
    '<div class="s2s-ai-head"><span class="av"><i class="fas fa-wand-magic-sparkles"></i></span><div><b>' + T.title + "</b><small>" + T.sub + '</small></div>' +
    '<button type="button" class="s2s-ai-x" aria-label="' + T.close + '"><i class="fas fa-xmark"></i></button></div>' +
    '<div class="s2s-ai-log" aria-live="polite"></div>' +
    '<div class="s2s-ai-chips"></div>' +
    '<form class="s2s-ai-form"><input type="text" maxlength="300" autocomplete="off" placeholder="' + T.placeholder + '" aria-label="' + T.placeholder + '">' +
    '<button type="submit" aria-label="' + T.send + '"><i class="fas fa-paper-plane"></i></button></form>';
  document.body.appendChild(btn);
  document.body.appendChild(box);

  var log = box.querySelector(".s2s-ai-log");
  var input = box.querySelector("input");
  var chips = box.querySelector(".s2s-ai-chips");
  T.chips.forEach(function (c) {
    var b = document.createElement("button"); b.type = "button"; b.textContent = c;
    b.addEventListener("click", function () { ask(c); });
    chips.appendChild(b);
  });

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function scroll() { log.scrollTop = log.scrollHeight; }
  function say(text, who) {
    var m = document.createElement("div"); m.className = "s2s-ai-msg " + who; m.textContent = text;
    log.appendChild(m); scroll(); return m;
  }
  function waLink(question) {
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(T.waMsg + (question || ""));
  }
  function render(r, question) {
    var m = say(r.text, "bot");
    if (r.products && r.products.length) {
      var wrap = document.createElement("div"); wrap.className = "s2s-ai-prods";
      r.products.forEach(function (p) {
        var img = /^https?:/.test(p.img) ? p.img : BASE + p.img;
        var d = document.createElement("div"); d.className = "s2s-ai-p";
        d.innerHTML = '<img src="' + esc(img) + '" alt="" loading="lazy"><div><b>' + esc(pname(p)) + "</b><span>" +
          (p.price ? esc(money(p.price)) + " " + esc(p.unit) : esc(T.onRequest)) + '</span><div class="acts">' +
          '<a href="' + PAGE_BASE + (p.url || ("shop.html?cat=" + p.cat)) + '">' + esc(T.view) + "</a>" +
          (p.addable ? '<button type="button">' + esc(T.add) + "</button>" : "") + "</div></div>";
        var add = d.querySelector("button");
        if (add) {
          add.addEventListener("click", function () {
            if (addToCart(p.name)) { add.textContent = T.added; add.disabled = true; }
          });
        }
        wrap.appendChild(d);
      });
      m.appendChild(wrap);
    }
    if (r.wa) {
      var a = document.createElement("a"); a.className = "s2s-ai-wa"; a.target = "_blank"; a.rel = "noopener";
      a.href = waLink(r.ask || question); a.innerHTML = '<i class="fab fa-whatsapp"></i>' + esc(T.waBtn);
      m.appendChild(a);
    }
    if (r.link) {
      var l = document.createElement("a"); l.href = r.link.href; l.textContent = " " + r.link.label; l.style.color = "#8a6a2c";
      m.appendChild(l);
    }
    scroll();
  }
  function typing() {
    var t = document.createElement("div"); t.className = "s2s-ai-typing"; t.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(t); scroll(); return t;
  }
  function ask(question) {
    question = String(question || "").trim();
    if (!question) { return; }
    say(question, "me");
    var t = typing();
    var local = function () {
      return loadCatalog().then(function () { return answer(question); });
    };
    var work = AI_ENDPOINT
      ? fetch(AI_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: question, lang: LANG }) })
          .then(function (r) { return r.json(); })
          .then(function (d) { return d && d.answer ? [{ text: d.answer }] : local(); })
          .catch(local)
      : local();
    work.then(function (replies) {
      setTimeout(function () {
        t.remove();
        var first = log.children.length;
        replies.forEach(function (r) { render(r, question); });
        var start = log.children[first - 1] || log.children[first];
        if (start) { log.scrollTop = Math.max(0, start.offsetTop - 12); }
      }, 350);
    });
  }

  var greeted = false;
  function setOpen(open) {
    box.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.style.visibility = open ? "hidden" : "";
    if (open) {
      loadCatalog();
      if (!greeted) { greeted = true; say(T.hello, "bot"); }
      setTimeout(function () { input.focus(); }, 200);
    }
  }
  btn.addEventListener("click", function (e) { e.stopPropagation(); setOpen(true); });
  box.querySelector(".s2s-ai-x").addEventListener("click", function () { setOpen(false); btn.focus(); });
  box.addEventListener("click", function (e) { e.stopPropagation(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && box.classList.contains("open")) { setOpen(false); } });
  box.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value; input.value = ""; ask(v);
  });
  window.S2SAssistant = { open: function () { setOpen(true); }, ask: function (q) { setOpen(true); ask(q); }, answer: answer, load: loadCatalog };
})();
