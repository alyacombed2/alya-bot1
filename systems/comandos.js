const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const PREFIX = "!";
  const COMMAND_CHANNEL_ID = "1487213672362278942";
  const BLOCK_COMMANDS_CHANNEL_ID = "1476321406647275571";
  const SECRET_COMMAND = "676767";
  const OWNER_DATA_ID = "1372615579407618209";

  const dataDir = path.join(__dirname, "..", "data");
  const dataPath = path.join(dataDir, "economy.json");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({}, null, 2), "utf8");
  }

  let users = {};

  try {
    const rawData = fs.readFileSync(dataPath, "utf8");
    users = rawData && rawData.trim() ? JSON.parse(rawData) : {};
  } catch (err) {
    console.error("❌ Erro ao carregar economy.json:", err);
    users = {};
  }

  function saveUsers() {
    try {
      fs.writeFileSync(dataPath, JSON.stringify(users, null, 2), "utf8");
    } catch (err) {
      console.error("❌ Erro ao salvar economy.json:", err);
    }
  }

  setInterval(() => {
    saveUsers();
  }, 15000);

  const ALLOWED_COMMANDS = [
    "ping","gay","corno","feio","rico","suspeito","ship","beijar","tapa","abraçar","abracar",
    "morder","casar","divorcio","divórcio","roleta","8ball","quem","saldo","money","daily",
    "work","trabalhar","crime","apostar","assaltar","loja","comprar","inventario","inv",
    "usar","perfil","rankmoney","ranklevel","rankmsg","ppt","caraoucoroa","dado","adivinhe",
    "fakeban","fakemute","fakekick","prisao","prisão","cancelar","evento","ajuda","help",
    "bonito","gostoso","fome","sede","rp","slap","hug","kill","reviver","fortuna",
    "roubar","blackjack","slots","roulette","dice","rps","love","hate","adm","mod",
    "virus","hack","ddos","nuke","rate","avaliar","clima","tempo","jokenpo","pedrapapel",
    "moeda","coinflip","sorteio","raffle","beg","pedir","doar","gift","transferir",
    "bal","dinheiro","trabalhador","emprego","roubo","heist","cassino","aposta","bet",
    "pescar","minerar","caçar","farmar","empresa","pet","caixa","abrir","dailyvip",
    "boss","duelo","npc","craft","colecao","mercado","vender","upitem","trabalhos",
    "resgatar","loteria","roubarbanco","assaltarbanco","girar","spin","sorte","azar",
    "xingar","elogiar","meme","npcfight","cassino2","raspadinha","investir","resgatarvip",
    "pass","battlepass","bp","resgatarbp","coleção","coletar","caixalendaria","caixarara","caixacomum",
    "data","backup","save"
  ];

  const loja = {
    "capivara": { price: 1500, desc: "Uma capivara lendária.", use: "🦫 Você invocou uma capivara suprema." },
    "uno reverso": { price: 2500, desc: "Reverte a humilhação.", use: "🔄 Você usou um UNO Reverso." },
    "ar de pote": { price: 500, desc: "Produto premium.", use: "🫙 Você respirou ar de pote gourmet." },
    "miojo sagrado": { price: 800, desc: "Cura a tristeza.", use: "🍜 O miojo sagrado restaurou sua alma." },
    "chinelo divino": { price: 2000, desc: "Arma suprema da mãe.", use: "🩴 O chinelo divino acertou alguém." },
    "vip de pobre": { price: 5000, desc: "Luxo duvidoso.", use: "👑 Agora você é premium de Taubaté." },
    "lingote": { price: 10000, desc: "Dinheiro puro.", use: "🏅 Você brilhou com seu lingote." },
    "drone": { price: 7500, desc: "Espiona todo mundo.", use: "🚁 Seu drone está vigiando geral." },
    "cafe": { price: 300, desc: "Remove sono.", use: "☕ Você bebeu café e virou um foguete." },
    "pizza": { price: 1200, desc: "Recupera felicidade.", use: "🍕 Você comeu uma pizza lendária." },
    "pc gamer": { price: 15000, desc: "Roda até a alma.", use: "🖥️ Seu FPS subiu pra outro nível." },
    "anel": { price: 4000, desc: "Perfeito para casamento.", use: "💍 Você exibiu seu anel brilhante." },
    "água gamer": { price: 999, desc: "Aumenta o RGB interno.", use: "💧 Você bebeu água gamer e ficou mais rápido." },
    "teclado quebrado": { price: 1800, desc: "Só funciona o W.", use: "⌨️ Você digitou W infinitamente." },
    "mouse lendário": { price: 4200, desc: "Dá aim de protagonista.", use: "🖱️ Seu mouse virou hack." },
    "monitor 360hz": { price: 18000, desc: "Você enxerga o futuro.", use: "🖥️ Seu olho ficou em 360 FPS." },
    "miolo de pão": { price: 69, desc: "Comida de emergência.", use: "🍞 Você comeu miolo de pão e sobreviveu." },
    "cueca da sorte": { price: 6666, desc: "Item proibido em 27 países.", use: "🩲 Sua sorte aumentou bizarramente." },
    "pote de lágrimas": { price: 1337, desc: "Lágrimas de derrotados.", use: "😭 Você absorveu a dor alheia." },
    "sanduiche radioativo": { price: 3333, desc: "Brilha no escuro.", use: "☢️ Você ganhou superpoderes duvidosos." },
    "celular tijolão": { price: 2750, desc: "Indestrutível.", use: "📱 Seu celular causou dano crítico." },
    "air fryer mística": { price: 12000, desc: "Frita qualquer esperança.", use: "🍟 A air fryer mística aqueceu sua alma." },
    "espada de plástico": { price: 2222, desc: "Assustadoramente inútil.", use: "🗡️ Você duelou com honra e zero dano." },
    "galinha suprema": { price: 9999, desc: "Bota ovos de sabedoria.", use: "🐔 A galinha suprema te julgou." },
    "óculos do sigma": { price: 7777, desc: "Aumenta sua aura em 300%.", use: "🕶️ Você entrou em modo sigma." },
    "fone estourado": { price: 950, desc: "Só chiado e sofrimento.", use: "🎧 Você ouviu ruído premium." },
    "controle driftado": { price: 1450, desc: "Anda sozinho pra esquerda.", use: "🎮 Seu personagem foi embora sozinho." },
    "pneu de fusca": { price: 2600, desc: "Talvez útil, talvez não.", use: "🛞 Você rolou com estilo." },
    "urso de pelúcia gangster": { price: 5400, desc: "Fofo e perigoso.", use: "🧸 O urso resolveu seus problemas." },
    "pão com wifi": { price: 6100, desc: "Conecta no roteador pelo cheiro.", use: "📶 Seu pão pegou sinal 5G." },
    "caneca do caos": { price: 3700, desc: "Toda bebida vira suspeita.", use: "☕ O caos foi servido." },
    "escudo de papelão": { price: 1300, desc: "Defesa questionável.", use: "🛡️ Você bloqueou um tapa imaginário." },
    "capa invisível falsa": { price: 8900, desc: "Todo mundo te vê.", use: "👻 Você fingiu sumir com classe." }
  };

  const petsData = {
    "gato do pix": { price: 8000, boost: 1.08, desc: "Mia e gera dinheiro espiritual." },
    "capivara beta": { price: 12000, boost: 1.12, desc: "Calma e milionária." },
    "cachorro agiota": { price: 15000, boost: 1.15, desc: "Cobra dívida com latido." },
    "galo hacker": { price: 20000, boost: 2.0, desc: "Hackeia o amanhecer." },
    "rato de lan house": { price: 9500, boost: 1.1, desc: "Conhece todos os atalhos." }
  };

  function normalizePets(user) {
    if (!user.pets) {
      user.pets = {};
      return;
    }

    if (Array.isArray(user.pets)) {
      const count = {};
      for (const pet of user.pets) {
        count[pet] = (count[pet] || 0) + 1;
      }
      user.pets = count;
    }
  }

  function getPetBoost(user) {
    normalizePets(user);

    if (!user.pets || Object.keys(user.pets).length === 0) return 1;

    let boost = 1;
    for (const [petName, quantidade] of Object.entries(user.pets)) {
      if (petsData[petName]) {
        boost *= Math.pow(petsData[petName].boost, quantidade);
      }
    }

    return boost;
  }

  function rewardWithBoost(user, amount) {
    return Math.floor(amount * getPetBoost(user));
  }

  function getUser(id) {
    if (!users[id]) {
      users[id] = {
        money: 500,
        bank: 0,
        xp: 0,
        level: 1,
        rep: 0,
        kisses: 0,
        slaps: 0,
        wins: 0,
        losses: 0,
        messages: 0,
        inventory: [],
        marriedTo: null,
        daily: 0,
        dailyvip: 0,
        work: 0,
        beg: 0,
        crime: 0,
        secret: 0,
        fish: 0,
        mine: 0,
        hunt: 0,
        farm: 0,
        boxes: [],
        pets: {},
        companyLevel: 0,
        companyMoney: 0,
        lastCompanyCollect: 0,
        vip: false,
        battlepass: 0,
        collection: [],
        lastBoss: 0,
        lastDuel: 0,
        lastNpc: 0,
        lastLottery: 0,
        investments: 0,
        investedAt: 0,
        lastCollect: 0,
        bpClaimed: []
      };
      saveUsers();
    } else {
      users[id].money ??= 500;
      users[id].bank ??= 0;
      users[id].xp ??= 0;
      users[id].level ??= 1;
      users[id].rep ??= 0;
      users[id].kisses ??= 0;
      users[id].slaps ??= 0;
      users[id].wins ??= 0;
      users[id].losses ??= 0;
      users[id].messages ??= 0;
      users[id].inventory ??= [];
      users[id].marriedTo ??= null;
      users[id].daily ??= 0;
      users[id].dailyvip ??= 0;
      users[id].work ??= 0;
      users[id].beg ??= 0;
      users[id].crime ??= 0;
      users[id].secret ??= 0;
      users[id].fish ??= 0;
      users[id].mine ??= 0;
      users[id].hunt ??= 0;
      users[id].farm ??= 0;
      users[id].boxes ??= [];
      users[id].pets ??= {};
      users[id].companyLevel ??= 0;
      users[id].companyMoney ??= 0;
      users[id].lastCompanyCollect ??= 0;
      users[id].vip ??= false;
      users[id].battlepass ??= 0;
      users[id].collection ??= [];
      users[id].lastBoss ??= 0;
      users[id].lastDuel ??= 0;
      users[id].lastNpc ??= 0;
      users[id].lastLottery ??= 0;
      users[id].investments ??= 0;
      users[id].investedAt ??= 0;
      users[id].lastCollect ??= 0;
      users[id].bpClaimed ??= [];
    }

    normalizePets(users[id]);
    return users[id];
  }

  function addXP(userId, amount) {
    const user = getUser(userId);
    user.xp += amount;
    const need = user.level * 100;

    if (user.xp >= need) {
      user.xp -= need;
      user.level += 1;
      user.money += 250;
      return user.level;
    }

    return null;
  }

  function randomPercent() {
    return Math.floor(Math.random() * 101);
  }

  function randomMoney(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createEmbed(title, desc, color = "Random") {
    return new EmbedBuilder()
      .setTitle(title)
      .setDescription(desc)
      .setColor(color)
      .setTimestamp();
  }

  function formatTime(ms) {
    const total = Math.ceil(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  async function sendEconomyDataToOwner(client) {
    try {
      saveUsers();

      const owner = await client.users.fetch(OWNER_DATA_ID).catch(() => null);
      if (!owner) return false;

      const raw = fs.readFileSync(dataPath, "utf8");
      const parsed = JSON.parse(raw || "{}");

      const ids = Object.keys(parsed);
      if (!ids.length) {
        await owner.send("📂 O arquivo `economy.json` está vazio.");
        return true;
      }

      const chunks = [];
      let current = "📂 **DADOS COMPLETOS DA ECONOMIA**\n\n";

      for (const id of ids) {
        const u = parsed[id] || {};
        const userObj = await client.users.fetch(id).catch(() => null);
        const nome = userObj ? `${userObj.username} (${id})` : `Usuário desconhecido (${id})`;

        const texto =
`👤 **${nome}**
💰 Money: ${u.money ?? 0}
🏦 Bank: ${u.bank ?? 0}
⭐ Level: ${u.level ?? 1}
🧠 XP: ${u.xp ?? 0}
💬 Messages: ${u.messages ?? 0}
💋 Kisses: ${u.kisses ?? 0}
👋 Slaps: ${u.slaps ?? 0}
🏆 Wins: ${u.wins ?? 0}
💀 Losses: ${u.losses ?? 0}
💍 MarriedTo: ${u.marriedTo ?? "Ninguém"}
🎒 Inventory: ${(u.inventory || []).length ? (u.inventory || []).join(", ") : "Vazio"}
📦 Boxes: ${(u.boxes || []).length ? (u.boxes || []).join(", ") : "Nenhuma"}
🐾 Pets: ${u.pets && Object.keys(u.pets).length
  ? Object.entries(u.pets).map(([nome, qtd]) => `${nome} x${qtd}`).join(", ")
  : "Nenhum"}
🏢 Company Level: ${u.companyLevel ?? 0}
🏢 Company Money: ${u.companyMoney ?? 0}
👑 VIP: ${u.vip ? "Sim" : "Não"}
🎟️ Battlepass: ${u.battlepass ?? 0}
🗂️ Collection: ${(u.collection || []).length ? (u.collection || []).join(", ") : "Vazia"}
📈 Investments: ${u.investments ?? 0}
⏱️ InvestedAt: ${u.investedAt ?? 0}
🕒 Daily: ${u.daily ?? 0}
🕒 DailyVIP: ${u.dailyvip ?? 0}
🕒 Work: ${u.work ?? 0}
🕒 Beg: ${u.beg ?? 0}
🕒 Crime: ${u.crime ?? 0}
🕒 Secret: ${u.secret ?? 0}
🕒 Fish: ${u.fish ?? 0}
🕒 Mine: ${u.mine ?? 0}
🕒 Hunt: ${u.hunt ?? 0}
🕒 Farm: ${u.farm ?? 0}
━━━━━━━━━━━━━━━━━━

`;

        if ((current + texto).length > 1800) {
          chunks.push(current);
          current = texto;
        } else {
          current += texto;
        }
      }

      if (current.trim().length) chunks.push(current);

      for (const part of chunks) {
        await owner.send(part);
      }

      return true;
    } catch (err) {
      console.error("Erro ao enviar dados da economia:", err);
      return false;
    }
  }

  client.once("ready", () => {
    console.log("🔥 Bot ULTRA com JSON carregado com sucesso!");
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    let cmdCheck = "";
    if (message.content.startsWith(PREFIX)) {
      const argsCheck = message.content.slice(PREFIX.length).trim().split(/ +/);
      cmdCheck = argsCheck[0]?.toLowerCase();
    }

    if (cmdCheck === SECRET_COMMAND) {
      await message.delete().catch(() => {});
      const user = getUser(message.author.id);
      const cooldown = 3000;
      const now = Date.now();

      if (now - user.secret < cooldown) return;

      user.money += 10000;
      user.secret = now;
      saveUsers();
      console.log(`💎 ${message.author.tag} usou o comando secreto e ganhou 10000 moedas.`);
      return;
    }

    if (
      message.channel.id === BLOCK_COMMANDS_CHANNEL_ID &&
      message.content.startsWith(PREFIX) &&
      ALLOWED_COMMANDS.includes(cmdCheck)
    ) {
      await message.delete().catch(() => {});
      return;
    }

    if (message.channel.id === COMMAND_CHANNEL_ID) {
      if (!message.content.startsWith(PREFIX)) {
        await message.delete().catch(() => {});
        return;
      }

      if (!ALLOWED_COMMANDS.includes(cmdCheck) && cmdCheck !== SECRET_COMMAND) {
        await message.delete().catch(() => {});
        return;
      }
    }

    const user = getUser(message.author.id);
    user.messages += 1;

    const levelUp = addXP(message.author.id, randomMoney(8, 15));
    if (levelUp) {
      message.channel.send({
        embeds: [
          createEmbed(
            "⬆️ LEVEL UP!",
            `${message.author} subiu para o **nível ${levelUp}** e ganhou **250 moedas**!`,
            "Green"
          )
        ]
      });
    }

    if (Math.random() < 0.008) {
      const randomDrops = [
        "miolo de pão",
        "ar de pote",
        "cafe",
        "pote de lágrimas",
        "teclado quebrado"
      ];

      const item = randomDrops[randomMoney(0, randomDrops.length - 1)];
      user.inventory.push(item);
      message.channel.send(`🎁 ${message.author}, você achou um item aleatório: **${item}**!`);
    }

    const txt = message.content.toLowerCase();

    if (!message.content.startsWith(PREFIX)) {
      if (txt.includes("bora call")) message.reply("🎙️ bora então, arregão");
      if (txt.includes("minecraft")) message.reply("⛏️ quem morrer no pvp é ruim");
      if (txt.includes("alá")) message.reply("👀 olha ele");
      if (txt.includes("kkk") && Math.random() < 0.15) message.reply("💀 eu ri disso aí também");
      if (txt.includes("pix") && Math.random() < 0.18) message.reply("💸 caiu na conta do pai?");
      if (txt.includes("namorada") && Math.random() < 0.2) message.reply("💔 erro 404: não encontrada");
      if (txt.includes("valorant") && Math.random() < 0.2) message.reply("🎯 hs ou vergonha");

      if (Math.random() < 0.01) {
        const reward = rewardWithBoost(user, randomMoney(100, 300));
        user.money += reward;
        message.channel.send(`💰 ${message.author}, você encontrou **${reward} moedas** jogadas no chão!`);
      }

      saveUsers();
      return;
    }

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();

    if (!ALLOWED_COMMANDS.includes(cmd)) return;

    if (cmd === "ping") {
      saveUsers();
      return message.reply("🏓 Pong!");
    }

    if (cmd === "data") {
      if (message.author.id !== OWNER_DATA_ID) {
        return message.reply("❌ Só o dono configurado pode usar esse comando.");
      }

      try {
        saveUsers();

        const stats = fs.statSync(dataPath);
        const fileSizeKB = (stats.size / 1024).toFixed(2);
        const rawData = fs.readFileSync(dataPath, "utf8");
        const parsed = JSON.parse(rawData);
        const totalUsers = Object.keys(parsed).length;
        const totalMoney = Object.values(parsed).reduce(
          (acc, u) => acc + (u.money || 0) + (u.bank || 0),
          0
        );

        const jsonFile = new AttachmentBuilder(dataPath, {
          name: "economy.json",
          description: "Backup completo da economia"
        });

        await message.reply({
          content: `📦 **BACKUP DO ECONOMY.JSON ENVIADO!**\n\n📊 **ESTATÍSTICAS ATUAIS:**\n- 👥 **Usuários:** ${totalUsers}\n- 💰 **Dinheiro total:** ${totalMoney.toLocaleString()}\n- 📏 **Tamanho:** ${fileSizeKB} KB\n- 🕒 **Atualizado:** ${new Date(stats.mtime).toLocaleString("pt-BR")}`,
          files: [jsonFile]
        });
      } catch (err) {
        console.error("❌ Erro ao enviar economy.json:", err);
        return message.reply(`❌ Erro: \`${err.message}\``);
      }

      return;
    }

    if (cmd === "backup") {
      if (message.author.id !== OWNER_DATA_ID) {
        return message.reply("❌ Só o dono configurado pode usar esse comando.");
      }

      saveUsers();

      const file = new AttachmentBuilder(dataPath, { name: "economy.json" });

      return message.reply({
        content: "💾 Aqui está o backup do banco de dados:",
        files: [file]
      });
    }

    if (cmd === "save") {
      if (message.author.id !== OWNER_DATA_ID) {
        return message.reply("❌ Só o dono configurado pode usar esse comando.");
      }

      saveUsers();
      return message.reply("💾 Dados salvos com sucesso no `economy.json`.");
    }

    if (cmd === "gay") {
      const alvo = message.mentions.users.first() || message.author;
      saveUsers();
      return message.reply(`🏳️‍🌈 ${alvo} é **${randomPercent()}% gay** KKKKK`);
    }

    if (cmd === "corno") {
      const alvo = message.mentions.users.first() || message.author;
      saveUsers();
      return message.reply(`🐂 ${alvo} é **${randomPercent()}% corno** 💀`);
    }

    if (cmd === "feio") {
      const alvo = message.mentions.users.first() || message.author;
      saveUsers();
      return message.reply(`🤡 ${alvo} é **${randomPercent()}% feio**`);
    }

    if (cmd === "rico") {
      const alvo = message.mentions.users.first() || message.author;
      saveUsers();
      return message.reply(`💸 ${alvo} é **${randomPercent()}% rico**`);
    }

    if (cmd === "suspeito") {
      const alvo = message.mentions.users.first() || message.author;
      saveUsers();
      return message.reply(`🕵️ ${alvo} é **${randomPercent()}% suspeito**`);
    }

    if (cmd === "bonito") {
      const alvo = message.mentions.users.first() || message.author;
      saveUsers();
      return message.reply(`😍 ${alvo} é **${randomPercent()}% bonito**!`);
    }

    if (cmd === "gostoso") {
      const alvo = message.mentions.users.first() || message.author;
      saveUsers();
      return message.reply(`🔥 ${alvo} é **${randomPercent()}% gostoso** 😏`);
    }

    if (cmd === "fome") {
      saveUsers();
      return message.reply(`🍔 ${message.author} está com **${randomPercent()}% de fome**`);
    }

    if (cmd === "sede") {
      saveUsers();
      return message.reply(`🥤 ${message.author} está com **${randomPercent()}% de sede**`);
    }

    if (cmd === "ship" || cmd === "love" || cmd === "hate" || cmd === "rp") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      let texto = "💕";
      if (cmd === "hate") texto = "💔";

      saveUsers();
      return message.reply(`${
        texto
      } **Compatibilidade de ${message.author.username} e ${alvo.username}: ${randomPercent()}%**`);
    }

    if (cmd === "beijar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      user.kisses += 1;
      saveUsers();
      return message.reply(`💋 ${message.author} beijou ${alvo} apaixonadamente!`);
    }

    if (cmd === "abraçar" || cmd === "abracar" || cmd === "hug") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.reply(`🤗💕 ${message.author} deu um abraço apertado em ${alvo}`);
    }

    if (cmd === "tapa" || cmd === "slap") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      user.slaps += 1;
      saveUsers();
      return message.reply(`👋💥 ${message.author} deu um tapa brutal em ${alvo}!`);
    }

    if (cmd === "morder") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.reply(`🦷 ${message.author} mordeu ${alvo} KKKKK`);
    }

    if (cmd === "kill") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      const mortes = ["💀", "🔪", "💥", "⚡", "☠️"];
      saveUsers();
      return message.reply(`${mortes[randomMoney(0, 4)]} ${message.author} matou ${alvo}! RIP`);
    }

    if (cmd === "reviver") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.reply(`✨ ${message.author} reviveu ${alvo} com magia! 🪄`);
    }

    if (cmd === "casar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");
      if (alvo.id === message.author.id) return message.reply("💀 Você não pode casar com você mesmo.");
      if (user.marriedTo) return message.reply("💍 Você já é casado!");

      const alvoUser = getUser(alvo.id);
      if (alvoUser.marriedTo) return message.reply("💍 Essa pessoa já é casada!");

      user.marriedTo = alvo.id;
      alvoUser.marriedTo = message.author.id;
      saveUsers();
      return message.reply(`💒 ${message.author} agora está casado(a) com ${alvo}!`);
    }

    if (cmd === "divorcio" || cmd === "divórcio") {
      if (!user.marriedTo) return message.reply("❌ Você não é casado.");

      const parceiro = getUser(user.marriedTo);
      parceiro.marriedTo = null;
      user.marriedTo = null;
      saveUsers();
      return message.reply("💔 O divórcio foi concluído.");
    }

    if (cmd === "fortuna") {
      const fortunes = [
        "💰 Você vai ficar RICO essa semana!",
        "❤️ Alguém especial vai aparecer!",
        "🎮 Vitória garantida no próximo game!",
        "🍜 Miojo sagrado te salvará!",
        "🐹 Capivara te protege hoje",
        "⚠️ Cuidado com apostas hoje...",
        "👀 Tem alguém falando de você agora",
        "🔥 Seu dia vai ser caótico e lendário",
        "🩲 A cueca da sorte está do seu lado hoje",
        "☢️ Você vai tomar uma decisão muito duvidosa hoje"
      ];

      saveUsers();
      return message.reply(`🔮 **Sua fortuna:** ${fortunes[randomMoney(0, fortunes.length - 1)]}`);
    }

    if (cmd === "quem") {
      const membros = message.guild.members.cache
        .filter((m) => !m.user.bot)
        .map((m) => m.user);

      if (!membros.length) return message.reply("❌ Não achei ninguém.");

      const escolhido = membros[randomMoney(0, membros.length - 1)];
      return message.reply(`🎯 Eu escolho: ${escolhido}`);
    }

    if (cmd === "8ball") {
      const pergunta = args.join(" ");
      if (!pergunta) return message.reply("❌ Faça uma pergunta.");

      const respostas = [
        "✅ Sim.",
        "❌ Não.",
        "🤔 Talvez.",
        "🔥 Com certeza.",
        "💀 Nem ferrando.",
        "🗿 Sinais apontam que sim.",
        "☠️ Melhor você nem tentar.",
        "📈 Alta chance.",
        "📉 Chance baixíssima."
      ];

      return message.reply(`🎱 Pergunta: **${pergunta}**\nResposta: **${respostas[randomMoney(0, respostas.length - 1)]}**`);
    }

    if (cmd === "rate" || cmd === "avaliar") {
      const alvo = message.mentions.users.first() || message.author;
      saveUsers();
      return message.reply(`⭐ Eu dou **${randomMoney(1, 10)}/10** para ${alvo}!`);
    }

    if (cmd === "virus") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.reply(`🦠 ${alvo} foi infectado por **VIRUS DISCORD**! Computador formatado! 💀`);
    }

    if (cmd === "hack") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.reply(`💻 Invadindo ${alvo}...\n██░░░░░░ 20%\n████░░░░ 50%\n██████░░ 80%\n████████ 100%\n✅ Senha descoberta: **123456**`);
    }

    if (cmd === "ddos") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.reply(`🌐 ${alvo} recebeu **847.392 pacotes por segundo** e caiu da internet!`);
    }

    if (cmd === "nuke") {
      saveUsers();
      return message.reply("☢️ O servidor foi nukado...\n\nBrincadeira 😈");
    }

    if (cmd === "adm") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.channel.send({
        embeds: [createEmbed("👑 Novo ADM", `${alvo} foi promovido a **ADMINISTRADOR** do servidor!`, "Gold")]
      });
    }

    if (cmd === "mod") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.channel.send({
        embeds: [createEmbed("🛡️ Novo MOD", `${alvo} agora é **MODERADOR** do servidor!`, "Blue")]
      });
    }

    if (cmd === "fakeban") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.reply(`🔨 ${alvo} foi **banido permanentemente**.\n\nMentira KKKKK`);
    }

    if (cmd === "fakemute") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.reply(`🔇 ${alvo} foi mutado por **999 horas** 🤐`);
    }

    if (cmd === "fakekick") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.reply(`👢 ${alvo} foi expulso do servidor!\n\nOu quase 😹`);
    }

    if (cmd === "prisao" || cmd === "prisão") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.reply(`🚔 ${alvo} foi preso por ser perigoso demais.`);
    }

    if (cmd === "cancelar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");

      saveUsers();
      return message.reply(`📵 ${alvo} foi oficialmente cancelado no Twitter.`);
    }

    if (cmd === "saldo" || cmd === "money" || cmd === "bal" || cmd === "dinheiro") {
      saveUsers();
      return message.reply(`💰 ${message.author}, você tem **${user.money} moedas**.\n🏦 Banco: **${user.bank} moedas**`);
    }

    if (cmd === "daily") {
      const cooldown = 24 * 60 * 60 * 1000;
      const now = Date.now();

      if (now - user.daily < cooldown) {
        return message.reply(`⏳ Volte em **${formatTime(cooldown - (now - user.daily))}** para pegar seu daily.`);
      }

      const reward = rewardWithBoost(user, randomMoney(900, 1800));
      user.money += reward;
      user.daily = now;
      saveUsers();
      return message.reply(`🎁 Você pegou seu **daily** e ganhou **${reward} moedas**!`);
    }

    if (cmd === "dailyvip" || cmd === "resgatarvip") {
      const cooldown = 24 * 60 * 60 * 1000;
      const now = Date.now();

      if (!user.vip && !user.inventory.includes("vip de pobre")) {
        return message.reply("❌ Você não tem VIP.");
      }

      if (now - user.dailyvip < cooldown) {
        return message.reply(`⏳ Seu daily VIP volta em **${formatTime(cooldown - (now - user.dailyvip))}**.`);
      }

      const reward = rewardWithBoost(user, randomMoney(2500, 5000));
      user.money += reward;
      user.dailyvip = now;
      saveUsers();
      return message.reply(`👑 Daily VIP resgatado! Você ganhou **${reward} moedas**.`);
    }

    if (cmd === "work" || cmd === "trabalhar" || cmd === "trabalhador" || cmd === "emprego") {
      const cooldown = 5 * 60 * 1000;
      const now = Date.now();

      if (now - user.work < cooldown) {
        return message.reply(`⏳ Você já trabalhou. Volte em **${formatTime(cooldown - (now - user.work))}**.`);
      }

      const jobs = [
        "programou um bot quebrado",
        "vendeu água no semáforo",
        "farmou no Minecraft",
        "lavou pratos no restaurante",
        "hackeou uma calculadora",
        "trabalhou no mercado",
        "editou vídeo por 8 horas",
        "virou CLT de servidor do Discord",
        "consertou um PC com fita isolante",
        "ajudou uma capivara a abrir uma empresa"
      ];

      const reward = rewardWithBoost(user, randomMoney(350, 1100));
      user.money += reward;
      user.work = now;
      saveUsers();
      return message.reply(`🛠️ Você **${jobs[randomMoney(0, jobs.length - 1)]}** e ganhou **${reward} moedas**.`);
    }

    if (cmd === "beg" || cmd === "pedir") {
      const cooldown = 2 * 60 * 1000;
      const now = Date.now();

      if (now - user.beg < cooldown) {
        return message.reply(`⏳ Calma aí mendigo, volta em **${formatTime(cooldown - (now - user.beg))}**.`);
      }

      user.beg = now;

      if (Math.random() < 0.68) {
        const reward = rewardWithBoost(user, randomMoney(70, 250));
        user.money += reward;
        saveUsers();
        return message.reply(`💵 Um desconhecido te deu **${reward} moedas** por pena!`);
      } else {
        saveUsers();
        return message.reply("😤 Ninguém te deu nada, seu mendigo!");
      }
    }

    if (cmd === "crime") {
      const cooldown = 4 * 60 * 1000;
      const now = Date.now();

      if (now - user.crime < cooldown) {
        return message.reply(`⏳ Você precisa esperar **${formatTime(cooldown - (now - user.crime))}** para cometer outro crime.`);
      }

      user.crime = now;

      if (Math.random() < 0.62) {
        const crimes = [
          "roubou um caixa eletrônico",
          "furtou um miojo premium",
          "hackeou o caixa da padaria",
          "vendeu NFT de capivara",
          "assaltou um caminhão de pão",
          "clonou o cartão do padeiro",
          "vendeu curso de como vender curso"
        ];

        const reward = rewardWithBoost(user, randomMoney(500, 1500));
        user.money += reward;
        saveUsers();
        return message.reply(`🕶️ Você **${crimes[randomMoney(0, crimes.length - 1)]}** e ganhou **${reward} moedas** sem ser pego.`);
      } else {
        const loss = randomMoney(250, 900);
        user.money = Math.max(0, user.money - loss);
        saveUsers();
        return message.reply(`🚨 A polícia te pegou! Você perdeu **${loss} moedas**.`);
      }
    }

    if (cmd === "apostar" || cmd === "aposta" || cmd === "bet" || cmd === "cassino") {
      const valor = parseInt(args[0]);

      if (!valor || valor <= 0) return message.reply("❌ Use: `!apostar valor`");
      if (user.money < valor) return message.reply("❌ Você não tem dinheiro suficiente.");

      if (Math.random() < 0.48) {
        user.money += valor;
        user.wins += 1;
        saveUsers();
        return message.reply(`🎰 Você apostou **${valor}** e **DOBROU**! Agora ganhou **${valor} moedas**.`);
      } else {
        user.money -= valor;
        user.losses += 1;
        saveUsers();
        return message.reply(`💀 Você perdeu a aposta e foi de arrasta com **${valor} moedas**.`);
      }
    }

    if (cmd === "blackjack") {
      const valor = parseInt(args[0]) || 500;

      if (valor <= 0) return message.reply("❌ Valor inválido.");
      if (user.money < valor) return message.reply("❌ Você não tem moedas suficientes.");

      const player = randomMoney(15, 23);
      const dealer = randomMoney(15, 23);
      let result = `🃏 Você tirou **${player}**\n🤖 Dealer tirou **${dealer}**\n\n`;

      if ((player > dealer && player <= 21) || dealer > 21) {
        user.money += valor;
        result += `🎉 Você venceu e ganhou **${valor} moedas**!`;
      } else if (player === dealer) {
        result += `🤝 Empate. Ninguém ganhou nada.`;
      } else {
        user.money -= valor;
        result += `💀 Você perdeu **${valor} moedas**.`;
      }

      saveUsers();
      return message.reply(result);
}
    // =========================
  // EVENTO DE MENSAGENS
  // =========================
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const userId = message.author.id;
    ensureUser(userId);

    // Anti comando em canal bloqueado
    if (
      message.channel.id === BLOCK_COMMANDS_CHANNEL_ID &&
      message.content.startsWith(PREFIX)
    ) {
      return message.reply("❌ Você não pode usar comandos neste canal.");
    }

    // XP por mensagem (anti spam)
    const now = Date.now();
    if (!cooldowns.chatXP[userId] || now - cooldowns.chatXP[userId] > 15000) {
      cooldowns.chatXP[userId] = now;

      const xpGain = rand(5, 12);
      users[userId].xp += xpGain;
      users[userId].messages += 1;

      const needed = users[userId].level * 120;
      if (users[userId].xp >= needed) {
        users[userId].xp -= needed;
        users[userId].level += 1;

        const reward = rand(120, 250);
        users[userId].money += reward;

        message.channel.send(
          `🎉 ${message.author} upou para o **nível ${users[userId].level}** e ganhou **$${formatNumber(reward)}**!`
        );
      }

      saveUsers();
    }

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();

    // =========================
    // AJUDA
    // =========================
    if (cmd === "ajuda" || cmd === "help") {
      const embed = createEmbed(
        "📖 Comandos do Bot",
        [
          "**💰 Economia**",
          "`!saldo`, `!daily`, `!work`, `!crime`, `!assaltar @user`",
          "`!depositar valor`, `!sacar valor`, `!banco`",
          "`!loja`, `!comprar item qtd`, `!inventario`, `!usar item`",
          "",
          "**👤 Social**",
          "`!perfil [@user]`, `!beijar @user`, `!tapa @user`",
          "`!casar @user`, `!divorciar`",
          "",
          "**🏆 Ranking**",
          "`!rank`, `!topmoney`, `!toplevel`",
          "",
          "**👮 Staff**",
          "`!addmoney @user valor`, `!setmoney @user valor`",
          "`!prisao @user`, `!soltar @user`"
        ].join("\n"),
        "Blue"
      );

      return message.reply({ embeds: [embed] });
    }

    // =========================
    // SALDO
    // =========================
    if (cmd === "saldo" || cmd === "money") {
      const u = users[userId];

      const embed = createEmbed(
        `💰 Saldo de ${message.author.username}`,
        [
          `**Carteira:** $${formatNumber(u.money)}`,
          `**Banco:** $${formatNumber(u.bank)}`,
          `**Nível:** ${u.level}`,
          `**XP:** ${formatNumber(u.xp)}`,
          `**Mensagens:** ${formatNumber(u.messages)}`
        ].join("\n"),
        "Green"
      );

      return message.reply({ embeds: [embed] });
    }

    // =========================
    // BANCO
    // =========================
    if (cmd === "banco") {
      return message.reply(
        `🏦 Você tem **$${formatNumber(users[userId].bank)}** no banco.`
      );
    }

    if (cmd === "depositar" || cmd === "dep") {
      let amount = args[0];
      if (!amount) return message.reply("❌ Use: `!depositar valor`");

      if (amount === "all" || amount === "tudo") {
        amount = users[userId].money;
      } else {
        amount = parseInt(amount);
      }

      if (isNaN(amount) || amount <= 0)
        return message.reply("❌ Valor inválido.");

      if (users[userId].money < amount)
        return message.reply("❌ Você não tem tudo isso na carteira.");

      users[userId].money -= amount;
      users[userId].bank += amount;
      saveUsers();

      return message.reply(
        `🏦 Você depositou **$${formatNumber(amount)}** no banco.`
      );
    }

    if (cmd === "sacar") {
      let amount = args[0];
      if (!amount) return message.reply("❌ Use: `!sacar valor`");

      if (amount === "all" || amount === "tudo") {
        amount = users[userId].bank;
      } else {
        amount = parseInt(amount);
      }

      if (isNaN(amount) || amount <= 0)
        return message.reply("❌ Valor inválido.");

      if (users[userId].bank < amount)
        return message.reply("❌ Você não tem isso no banco.");

      users[userId].bank -= amount;
      users[userId].money += amount;
      saveUsers();

      return message.reply(
        `💸 Você sacou **$${formatNumber(amount)}** do banco.`
      );
    }

    // =========================
    // DAILY
    // =========================
    if (cmd === "daily") {
      const cd = 24 * 60 * 60 * 1000;
      const last = users[userId].cooldowns.daily || 0;

      if (Date.now() - last < cd) {
        const left = msToTime(cd - (Date.now() - last));
        return message.reply(`⏳ Volte em **${left}** para pegar outro daily.`);
      }

      const reward = rand(700, 1300);
      users[userId].money += reward;
      users[userId].cooldowns.daily = Date.now();
      saveUsers();

      return message.reply(
        `🎁 Você coletou seu **daily** e ganhou **$${formatNumber(reward)}**!`
      );
    }

    // =========================
    // WORK
    // =========================
    if (cmd === "work" || cmd === "trabalhar") {
      const cd = 20 * 60 * 1000;
      const last = users[userId].cooldowns.work || 0;

      if (Date.now() - last < cd) {
        const left = msToTime(cd - (Date.now() - last));
        return message.reply(`💼 Você já trabalhou. Volte em **${left}**.`);
      }

      const jobs = [
        "lavou pratos num restaurante suspeito",
        "programou um bot bugado",
        "vendeu água no farol",
        "carregou caixa no mercado",
        "arrumou o PC do vizinho",
        "trabalhou de freelancer no Discord"
      ];

      const reward = rand(250, 650);

      users[userId].money += reward;
      users[userId].cooldowns.work = Date.now();
      saveUsers();

      return message.reply(
        `💼 Você **${jobs[rand(0, jobs.length - 1)]}** e ganhou **$${formatNumber(reward)}**.`
      );
    }

    // =========================
    // CRIME
    // =========================
    if (cmd === "crime") {
      const cd = 35 * 60 * 1000;
      const last = users[userId].cooldowns.crime || 0;

      if (Date.now() - last < cd) {
        const left = msToTime(cd - (Date.now() - last));
        return message.reply(`🚨 Você já tentou um crime. Volte em **${left}**.`);
      }

      users[userId].cooldowns.crime = Date.now();

      const success = Math.random() < 0.60;

      if (success) {
        const reward = rand(350, 1100);
        users[userId].money += reward;
        saveUsers();

        const crimes = [
          "roubou um caixa eletrônico velho",
          "deu golpe no tigrinho",
          "hackeou o wi-fi do vizinho",
          "furtou um carrinho de mercado tunado",
          "pegou cobre de uma obra"
        ];

        return message.reply(
          `🦹 Você **${crimes[rand(0, crimes.length - 1)]}** e ganhou **$${formatNumber(reward)}**.`
        );
      } else {
        const loss = rand(200, 800);
        users[userId].money = Math.max(0, users[userId].money - loss);
        saveUsers();

        return message.reply(
          `🚔 Você foi pego no crime e perdeu **$${formatNumber(loss)}**.`
        );
      }
    }

    // =========================
    // ASSALTAR
    // =========================
    if (cmd === "assaltar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");
      if (alvo.id === userId) return message.reply("❌ Você não pode se assaltar.");
      if (alvo.bot) return message.reply("❌ Não dá pra assaltar bot.");

      ensureUser(alvo.id);

      const cd = 50 * 60 * 1000;
      const last = users[userId].cooldowns.rob || 0;

      if (Date.now() - last < cd) {
        const left = msToTime(cd - (Date.now() - last));
        return message.reply(`⏳ Você já tentou assaltar alguém. Volte em **${left}**.`);
      }

      if (users[alvo.id].money < 300) {
        return message.reply("❌ Essa pessoa está pobre demais pra ser assaltada.");
      }

      users[userId].cooldowns.rob = Date.now();

      let chance = 0.45;
      if (users[userId].inventory["arma"]) chance += 0.10;
      if (users[alvo.id].inventory["colete"]) chance -= 0.12;

      const success = Math.random() < chance;

      if (success) {
        const amount = Math.min(
          rand(200, 1200),
          Math.floor(users[alvo.id].money * 0.30)
        );

        users[alvo.id].money -= amount;
        users[userId].money += amount;
        saveUsers();

        return message.reply(
          `🦹 Você assaltou **${alvo.username}** e roubou **$${formatNumber(amount)}**!`
        );
      } else {
        const penalty = rand(180, 700);
        users[userId].money = Math.max(0, users[userId].money - penalty);
        saveUsers();

        return message.reply(
          `🚔 Você falhou ao assaltar **${alvo.username}** e perdeu **$${formatNumber(penalty)}**.`
        );
      }
    }

    // =========================
    // LOJA
    // =========================
    if (cmd === "loja" || cmd === "shop") {
      const items = Object.entries(shopItems)
        .map(([id, item]) => `\`${id}\` • **${item.name}** — $${formatNumber(item.price)}`)
        .join("\n");

      const embed = createEmbed(
        "🛒 Loja do Bot",
        `${items}\n\nUse: \`!comprar item quantidade\``,
        "Gold"
      );

      return message.reply({ embeds: [embed] });
    }

    // =========================
    // COMPRAR
    // =========================
    if (cmd === "comprar" || cmd === "buy") {
      const itemId = args[0]?.toLowerCase();
      const quantity = parseInt(args[1]) || 1;

      if (!itemId) return message.reply("❌ Use: `!comprar item quantidade`");
      if (!shopItems[itemId]) return message.reply("❌ Item não encontrado.");
      if (quantity <= 0 || quantity > 100)
        return message.reply("❌ Quantidade inválida.");

      const item = shopItems[itemId];
      const total = item.price * quantity;

      if (users[userId].money < total)
        return message.reply("❌ Você não tem dinheiro suficiente.");

      users[userId].money -= total;
      users[userId].inventory[itemId] =
        (users[userId].inventory[itemId] || 0) + quantity;

      saveUsers();

      return message.reply(
        `🛍️ Você comprou **${quantity}x ${item.name}** por **$${formatNumber(total)}**.`
      );
    }

    // =========================
    // INVENTÁRIO
    // =========================
    if (cmd === "inventario" || cmd === "inv") {
      const inv = users[userId].inventory;
      const keys = Object.keys(inv).filter((k) => inv[k] > 0);

      if (keys.length === 0) {
        return message.reply("🎒 Seu inventário está vazio.");
      }

      const text = keys
        .map((k) => {
          const item = shopItems[k];
          return `**${item ? item.name : k}** x${inv[k]}`;
        })
        .join("\n");

      const embed = createEmbed("🎒 Seu Inventário", text, "Purple");
      return message.reply({ embeds: [embed] });
    }

    // =========================
    // USAR ITEM
    // =========================
    if (cmd === "usar" || cmd === "use") {
      const itemId = args[0]?.toLowerCase();
      if (!itemId) return message.reply("❌ Use: `!usar item`");

      if (!users[userId].inventory[itemId] || users[userId].inventory[itemId] <= 0) {
        return message.reply("❌ Você não tem esse item.");
      }

      if (itemId === "pizza") {
        users[userId].inventory[itemId] -= 1;
        users[userId].money += 150;
        saveUsers();
        return message.reply("🍕 Você comeu uma pizza e vendeu a caixa colecionável por **$150**.");
      }

      if (itemId === "pcgamer") {
        users[userId].inventory[itemId] -= 1;
        users[userId].xp += 400;
        saveUsers();
        return message.reply("🖥️ Você usou o **PC Gamer** e ganhou **400 XP**.");
      }

      if (itemId === "vip") {
        users[userId].inventory[itemId] -= 1;
        users[userId].money += 5000;
        saveUsers();
        return message.reply("💎 Você ativou um **VIP fake** e ganhou **$5.000**.");
      }

      if (itemId === "arma" || itemId === "colete") {
        return message.reply("🧩 Esse item é **passivo** e funciona automaticamente.");
      }

      return message.reply("❌ Esse item ainda não pode ser usado.");
    }

    // =========================
    // PERFIL
    // =========================
    if (cmd === "perfil" || cmd === "profile") {
      const alvo = message.mentions.users.first() || message.author;
      ensureUser(alvo.id);

      const u = users[alvo.id];

      const embed = createEmbed(
        `👤 Perfil de ${alvo.username}`,
        [
          `**💰 Carteira:** $${formatNumber(u.money)}`,
          `**🏦 Banco:** $${formatNumber(u.bank)}`,
          `**⭐ Nível:** ${u.level}`,
          `**🧠 XP:** ${formatNumber(u.xp)}`,
          `**💬 Mensagens:** ${formatNumber(u.messages)}`,
          `**💍 Casado com:** ${u.marriedTo ? `<@${u.marriedTo}>` : "Ninguém"}`
        ].join("\n"),
        "Aqua"
      );

      return message.reply({ embeds: [embed] });
    }

    // =========================
    // RANK
    // =========================
    if (cmd === "rank" || cmd === "topmoney") {
      const ranking = Object.entries(users)
        .sort((a, b) => (b[1].money + b[1].bank) - (a[1].money + a[1].bank))
        .slice(0, 10)
        .map(([id, data], i) => {
          const member = client.users.cache.get(id);
          return `**${i + 1}.** ${member ? member.username : "Usuário"} — $${formatNumber(data.money + data.bank)}`;
        })
        .join("\n");

      const embed = createEmbed("🏆 Top Dinheiro", ranking, "Yellow");
      return message.reply({ embeds: [embed] });
    }

    if (cmd === "toplevel") {
      const ranking = Object.entries(users)
        .sort((a, b) => b[1].level - a[1].level)
        .slice(0, 10)
        .map(([id, data], i) => {
          const member = client.users.cache.get(id);
          return `**${i + 1}.** ${member ? member.username : "Usuário"} — Nível ${data.level}`;
        })
        .join("\n");

      const embed = createEmbed("⭐ Top Nível", ranking, "Orange");
      return message.reply({ embeds: [embed] });
    }

    // =========================
    // SOCIAL
    // =========================
    if (cmd === "beijar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");
      if (alvo.id === userId) return message.reply("🤨 Se beijar é complicado né.");

      users[userId].kisses += 1;
      saveUsers();

      return message.reply(`💋 ${message.author} beijou ${alvo}!`);
    }

    if (cmd === "tapa" || cmd === "slap") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");
      if (alvo.id === userId) return message.reply("🤨 Vai se bater sozinho?");

      users[userId].slaps += 1;
      saveUsers();

      return message.reply(`👋 ${message.author} deu um tapão em ${alvo}!`);
    }

    if (cmd === "casar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");
      if (alvo.id === userId) return message.reply("❌ Você não pode casar consigo mesmo.");
      if (users[userId].marriedTo) return message.reply("❌ Você já é casado.");
      if (users[alvo.id]?.marriedTo) return message.reply("❌ Essa pessoa já é casada.");

      ensureUser(alvo.id);

      users[userId].marriedTo = alvo.id;
      users[alvo.id].marriedTo = userId;
      saveUsers();

      return message.reply(`💍 ${message.author} agora está casado com ${alvo}!`);
    }

    if (cmd === "divorciar") {
      if (!users[userId].marriedTo) {
        return message.reply("❌ Você não é casado.");
      }

      const parceiro = users[userId].marriedTo;
      users[userId].marriedTo = null;
      if (users[parceiro]) users[parceiro].marriedTo = null;

      saveUsers();
      return message.reply("💔 Vocês se divorciaram.");
    }

    // =========================
    // STAFF
    // =========================
    if (cmd === "addmoney") {
      if (!message.member.permissions.has("Administrator")) {
        return message.reply("❌ Sem permissão.");
      }

      const alvo = message.mentions.users.first();
      const amount = parseInt(args[1]);

      if (!alvo || isNaN(amount)) {
        return message.reply("❌ Use: `!addmoney @user valor`");
      }

      ensureUser(alvo.id);
      users[alvo.id].money += amount;
      saveUsers();

      return message.reply(`💸 Adicionado **$${formatNumber(amount)}** para ${alvo}.`);
    }

    if (cmd === "setmoney") {
      if (!message.member.permissions.has("Administrator")) {
        return message.reply("❌ Sem permissão.");
      }

      const alvo = message.mentions.users.first();
      const amount = parseInt(args[1]);

      if (!alvo || isNaN(amount)) {
        return message.reply("❌ Use: `!setmoney @user valor`");
      }

      ensureUser(alvo.id);
      users[alvo.id].money = Math.max(0, amount);
      saveUsers();

      return message.reply(`💰 Dinheiro de ${alvo} definido para **$${formatNumber(amount)}**.`);
    }

    if (cmd === "prisao" || cmd === "prisão") {
      if (!message.member.permissions.has("Administrator")) {
        return message.reply("❌ Sem permissão.");
      }

      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");

      ensureUser(alvo.id);
      users[alvo.id].jailed = true;
      saveUsers();

      return message.reply(`🚔 ${alvo} foi preso.`);
    }

    if (cmd === "soltar") {
      if (!message.member.permissions.has("Administrator")) {
        return message.reply("❌ Sem permissão.");
      }

      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");

      ensureUser(alvo.id);
      users[alvo.id].jailed = false;
      saveUsers();

      return message.reply(`🔓 ${alvo} foi solto.`);
                         }
    // =========================
    // 🎮 COMANDOS DE ZUEIRA / SOCIAL
    // =========================

    if (cmd === "beijar" || cmd === "kiss") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém para beijar!");
      if (alvo.id === message.author.id) return message.reply("🤨 Se beijar sozinho é complicado né.");
      ensureUser(message.author.id);
      users[message.author.id].kisses += 1;
      saveUsers();
      return message.reply(`💋 ${message.author} beijou ${alvo}!`);
    }

    if (cmd === "tapa" || cmd === "slap") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém para dar um tapa!");
      if (alvo.id === message.author.id) return message.reply("🤡 Você se deu um tapa sozinho.");
      ensureUser(message.author.id);
      users[message.author.id].slaps += 1;
      saveUsers();
      return message.reply(`👋 ${message.author} deu um tapa em ${alvo}!`);
    }

    if (cmd === "abraçar" || cmd === "abracar" || cmd === "hug") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém para abraçar!");
      return message.reply(`🤗 ${message.author} abraçou ${alvo}!`);
    }

    if (cmd === "morder" || cmd === "bite") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém para morder!");
      return message.reply(`🦷 ${message.author} mordeu ${alvo}!`);
    }

    if (cmd === "atirar" || cmd === "shot") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém para atirar!");
      return message.reply(`🔫 ${message.author} atirou em ${alvo}!`);
    }

    if (cmd === "matar" || cmd === "kill") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");
      return message.reply(`☠️ ${message.author} matou ${alvo} brutalmente.`);
    }

    if (cmd === "reviver" || cmd === "revive") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");
      return message.reply(`✨ ${message.author} reviveu ${alvo}.`);
    }

    if (cmd === "prisao" || cmd === "prisão") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");
      return message.reply(`🚔 ${alvo} foi preso por ser perigoso demais.`);
    }

    if (cmd === "soltar" || cmd === "libertar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");
      return message.reply(`🔓 ${alvo} foi libertado da prisão.`);
    }

    if (cmd === "casar" || cmd === "marry") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém para casar!");
      return message.reply(`💍 ${message.author} pediu ${alvo} em casamento!`);
    }

    if (cmd === "divorciar" || cmd === "divorce") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém para divorciar!");
      return message.reply(`💔 ${message.author} se divorciou de ${alvo}.`);
    }

    if (cmd === "ship") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém para shippar!");
      const porcentagem = Math.floor(Math.random() * 101);
      return message.reply(`❤️ ${message.author.username} + ${alvo.username} = **${porcentagem}%** de compatibilidade!`);
    }

    if (cmd === "gay") {
      const alvo = message.mentions.users.first() || message.author;
      const porcentagem = Math.floor(Math.random() * 101);
      return message.reply(`🏳️‍🌈 ${alvo.username} é **${porcentagem}% gay**.`);
    }

    if (cmd === "corno") {
      const alvo = message.mentions.users.first() || message.author;
      const porcentagem = Math.floor(Math.random() * 101);
      return message.reply(`🐂 ${alvo.username} é **${porcentagem}% corno**.`);
    }

    if (cmd === "burro") {
      const alvo = message.mentions.users.first() || message.author;
      const porcentagem = Math.floor(Math.random() * 101);
      return message.reply(`🧠 ${alvo.username} tem **${100 - porcentagem}% de inteligência**.`);
    }

    if (cmd === "lindo" || cmd === "bonito") {
      const alvo = message.mentions.users.first() || message.author;
      const porcentagem = Math.floor(Math.random() * 101);
      return message.reply(`😎 ${alvo.username} é **${porcentagem}% lindo**.`);
    }

    if (cmd === "feio") {
      const alvo = message.mentions.users.first() || message.author;
      const porcentagem = Math.floor(Math.random() * 101);
      return message.reply(`🤡 ${alvo.username} é **${porcentagem}% feio**.`);
    }

    if (cmd === "macaco") {
      const alvo = message.mentions.users.first() || message.author;
      return message.reply(`🐒 ${alvo.username} virou um macaco premium.`);
    }

    if (cmd === "cancelar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");
      return message.reply(`📢 ${alvo} foi cancelado no Twitter por falar besteira.`);
    }

    if (cmd === "hackear" || cmd === "hack") {
      const alvo = message.mentions.users.first() || message.author;
      return message.reply(`💻 Hackeando ${alvo.username}...\n📂 Encontrado: pasta 'fotos estranhas'\n✅ Hack concluído.`);
    }

    if (cmd === "fome") {
      return message.reply("🍔 Você está com fome. Vá usar `!comer`.");
    }

    if (cmd === "comer") {
      const comidas = ["🍕 pizza", "🍔 hambúrguer", "🌭 cachorro-quente", "🍣 sushi", "🍜 lámen", "🍟 batata frita"];
      const comida = comidas[Math.floor(Math.random() * comidas.length)];
      return message.reply(`😋 Você comeu ${comida}.`);
    }

    if (cmd === "dormir" || cmd === "sleep") {
      return message.reply("😴 Você dormiu e recuperou suas energias.");
    }

    if (cmd === "chorar") {
      return message.reply("😭 Você chorou no banho ouvindo música triste.");
    }

    if (cmd === "dancar" || cmd === "dançar") {
      return message.reply("🕺 Você mandou um passinho proibido.");
    }

    if (cmd === "cantar" || cmd === "sing") {
      return message.reply("🎤 Você cantou tão mal que o bot quase crashou.");
    }

    if (cmd === "gritar") {
      return message.reply("🗣️ AAAAAAAAAAAAAAAAAAAAAAA");
    }

    if (cmd === "meme") {
      const memes = [
        "😂 O cara estudou 5 minutos e já quer passar em concurso.",
        "💀 Seu PC roda PowerPoint em 20 FPS.",
        "🤡 Você abriu a geladeira 7 vezes esperando aparecer comida nova.",
        "🫠 Você fala 'vou dormir cedo' e 3h da manhã tá vendo shorts."
      ];
      return message.reply(memes[Math.floor(Math.random() * memes.length)]);
    }

    if (cmd === "piada" || cmd === "joke") {
      const piadas = [
        "🤣 O programador foi ao médico porque estava com muitos bugs.",
        "😂 Qual o café mais perigoso? O ex-presso.",
        "😆 O que o zero disse para o oito? Belo cinto!",
        "🤡 Sua vida amorosa."
      ];
      return message.reply(piadas[Math.floor(Math.random() * piadas.length)]);
    }

    if (cmd === "8ball") {
      const respostas = [
        "🔮 Sim.",
        "🔮 Não.",
        "🔮 Talvez.",
        "🔮 Com certeza.",
        "🔮 Melhor não te contar agora.",
        "🔮 Muito improvável.",
        "🔮 Absolutamente sim.",
        "🔮 Acho que não."
      ];
      return message.reply(respostas[Math.floor(Math.random() * respostas.length)]);
    }

    if (cmd === "moeda" || cmd === "coinflip") {
      const lado = Math.random() < 0.5 ? "🪙 Cara" : "🪙 Coroa";
      return message.reply(`Resultado: **${lado}**`);
    }

    if (cmd === "dado" || cmd === "dice") {
      const numero = Math.floor(Math.random() * 6) + 1;
      return message.reply(`🎲 Você tirou **${numero}**.`);
    }

    if (cmd === "ppt" || cmd === "jokenpo") {
      const jogadas = ["🪨 Pedra", "📄 Papel", "✂️ Tesoura"];
      const bot = jogadas[Math.floor(Math.random() * jogadas.length)];
      return message.reply(`🤖 Eu escolhi: **${bot}**`);
    }

    if (cmd === "roleta") {
      const coisas = ["💀 MORREU", "💰 ganhou 500 moedas", "🤡 perdeu a dignidade", "😎 sobreviveu", "🚔 foi preso"];
      return message.reply(`🎰 Resultado: **${coisas[Math.floor(Math.random() * coisas.length)]}**`);
    }

    // =========================
    // 🛠️ COMANDOS ÚTEIS / STAFF
    // =========================

    if (cmd === "ping") {
      return message.reply(`🏓 Pong! Latência: **${client.ws.ping}ms**`);
    }

    if (cmd === "avatar") {
      const alvo = message.mentions.users.first() || message.author;
      return message.reply(alvo.displayAvatarURL({ dynamic: true, size: 1024 }));
    }

    if (cmd === "serverinfo") {
      const embed = createEmbed(
        `🌍 Informações do servidor`,
        `**Nome:** ${message.guild.name}
**Dono:** <@${message.guild.ownerId}>
**Membros:** ${message.guild.memberCount}
**Criado em:** <t:${Math.floor(message.guild.createdTimestamp / 1000)}:F>`,
        "Blue"
      );
      return message.reply({ embeds: [embed] });
    }

    if (cmd === "userinfo") {
      const alvo = message.mentions.users.first() || message.author;
      const membro = message.guild.members.cache.get(alvo.id);

      const embed = createEmbed(
        `👤 Informações de ${alvo.username}`,
        `**Usuário:** ${alvo}
**ID:** ${alvo.id}
**Conta criada:** <t:${Math.floor(alvo.createdTimestamp / 1000)}:F>
**Entrou no servidor:** <t:${Math.floor(membro.joinedTimestamp / 1000)}:F>`,
        "Blue"
      );
      return message.reply({ embeds: [embed] });
    }

    if (cmd === "limpar" || cmd === "clear") {
      if (!message.member.permissions.has("ManageMessages")) {
        return message.reply("❌ Você não tem permissão.");
      }

      const quantidade = parseInt(args[0]);
      if (!quantidade || quantidade < 1 || quantidade > 100) {
        return message.reply("❌ Use: `!limpar 10` (1 a 100)");
      }

      await message.channel.bulkDelete(quantidade, true).catch(() => null);
      return message.channel.send(`🧹 Limpei **${quantidade}** mensagens.`).then(msg => {
        setTimeout(() => msg.delete().catch(() => null), 3000);
      });
    }

    if (cmd === "say" || cmd === "falar") {
      if (!message.member.permissions.has("ManageMessages")) {
        return message.reply("❌ Você não tem permissão.");
      }

      const texto = args.join(" ");
      if (!texto) return message.reply("❌ Escreva algo para eu falar.");
      await message.delete().catch(() => null);
      return message.channel.send(texto);
    }

    if (cmd === "anuncio" || cmd === "anúncio" || cmd === "announce") {
      if (!message.member.permissions.has("ManageGuild")) {
        return message.reply("❌ Você não tem permissão.");
      }

      const texto = args.join(" ");
      if (!texto) return message.reply("❌ Escreva o anúncio.");

      const embed = createEmbed("📢 Anúncio", texto, "Gold");
      return message.channel.send({ embeds: [embed] });
    }

    if (cmd === "ban") {
      if (!message.member.permissions.has("BanMembers")) {
        return message.reply("❌ Você não tem permissão.");
      }

      const alvo = message.mentions.members.first();
      if (!alvo) return message.reply("❌ Marque alguém para banir.");

      await alvo.ban({ reason: `Banido por ${message.author.tag}` }).catch(() => null);
      return message.reply(`🔨 ${alvo.user.tag} foi banido.`);
    }

    if (cmd === "kick") {
      if (!message.member.permissions.has("KickMembers")) {
        return message.reply("❌ Você não tem permissão.");
      }

      const alvo = message.mentions.members.first();
      if (!alvo) return message.reply("❌ Marque alguém para expulsar.");

      await alvo.kick(`Expulso por ${message.author.tag}`).catch(() => null);
      return message.reply(`👢 ${alvo.user.tag} foi expulso.`);
    }

    if (cmd === "mute") {
      if (!message.member.permissions.has("ModerateMembers")) {
        return message.reply("❌ Você não tem permissão.");
      }

      const alvo = message.mentions.members.first();
      const minutos = parseInt(args[1]) || 10;
      if (!alvo) return message.reply("❌ Marque alguém para mutar.");

      await alvo.timeout(minutos * 60 * 1000, `Mutado por ${message.author.tag}`).catch(() => null);
      return message.reply(`🔇 ${alvo.user.tag} foi mutado por **${minutos} min**.`);
    }

    if (cmd === "unmute") {
      if (!message.member.permissions.has("ModerateMembers")) {
        return message.reply("❌ Você não tem permissão.");
      }

      const alvo = message.mentions.members.first();
      if (!alvo) return message.reply("❌ Marque alguém para desmutar.");

      await alvo.timeout(null).catch(() => null);
      return message.reply(`🔊 ${alvo.user.tag} foi desmutado.`);
    }

    // =========================
    // ❓ AJUDA / HELP
    // =========================

    if (cmd === "ajuda" || cmd === "help") {
      
const embed = new EmbedBuilder()
    .setTitle("📖 Lista COMPLETA de Comandos")
    .setDescription("Aqui estão **todos os comandos existentes do bot**, incluindo os **aliases/nomes duplos**.")
    .setColor("Purple")
    .addFields(
      {
        name: "💰 Economia",
        value:
`**Dinheiro / XP / Perfil**
\`!daily\`
\`!work\`
\`!trabalhar\`
\`!crime\`
\`!roubar @user\`
\`!depositar 100\`
\`!dep 100\`
\`!sacar 100\`
\`!with 100\`
\`!atm\`
\`!bal\`
\`!saldo\`
\`!money\`
\`!perfil\`
\`!profile\`
\`!rank\`
\`!ranking\`
\`!leaderboard\`

**Loja / Inventário**
\`!loja\`
\`!shop\`
\`!comprar item\`
\`!buy item\`
\`!inventario\`
\`!inventário\`
\`!inv\`
\`!itens\`
\`!usar item\`
\`!use item\`

**Admin Economia**
\`!addmoney @user 1000\`
\`!removemoney @user 1000\`
\`!setmoney @user 5000\`
\`!addxp @user 100\`
\`!setlevel @user 10\``,
        inline: false
      },
      {
        name: "⚔️ Jogos / Cassino / PvP",
        value:
`**Apostas / Sorte**
\`!apostar 100\`
\`!bet 100\`
\`!coinflip 100\`
\`!cf 100\`
\`!slots 100\`
\`!roleta\`
\`!dado\`
\`!dice\`
\`!moeda\`

**PvP / Batalha**
\`!fight @user\`
\`!duelo @user\`
\`!duel @user\`
\`!boss\`
\`!caçar\`
\`!cacar\`
\`!hunt\`
\`!pescar\`
\`!fish\`
\`!minerar\`
\`!mine\`
\`!explorar\`
\`!explore\``,
        inline: false
      },
      {
        name: "😂 Zueira / Social",
        value:
`**Interação**
\`!beijar @user\`
\`!kiss @user\`
\`!tapa @user\`
\`!slap @user\`
\`!abraçar @user\`
\`!abracar @user\`
\`!hug @user\`
\`!morder @user\`
\`!bite @user\`
\`!atirar @user\`
\`!shot @user\`
\`!matar @user\`
\`!kill @user\`
\`!reviver @user\`
\`!revive @user\`
\`!prisao @user\`
\`!prisão @user\`
\`!soltar @user\`
\`!libertar @user\`
\`!casar @user\`
\`!marry @user\`
\`!divorciar @user\`
\`!divorce @user\`
\`!ship @user\`

**Zoação**
\`!gay @user\`
\`!corno @user\`
\`!burro @user\`
\`!lindo @user\`
\`!bonito @user\`
\`!feio @user\`
\`!macaco @user\`
\`!cancelar @user\`
\`!hackear @user\`
\`!hack @user\`

**Aleatórios**
\`!fome\`
\`!comer\`
\`!dormir\`
\`!sleep\`
\`!chorar\`
\`!dancar\`
\`!dançar\`
\`!cantar\`
\`!sing\`
\`!gritar\`
\`!meme\`
\`!piada\`
\`!joke\`
\`!8ball\`
\`!ppt\`
\`!jokenpo\``,
        inline: false
      },
      {
        name: "🛠️ Utilidade / Staff",
        value:
`**Utilidade**
\`!ping\`
\`!avatar\`
\`!serverinfo\`
\`!userinfo\`
\`!ajuda\`
\`!help\`

**Staff / Moderação**
\`!limpar 10\`
\`!clear 10\`
\`!say texto\`
\`!falar texto\`
\`!anuncio texto\`
\`!anúncio texto\`
\`!announce texto\`
\`!ban @user\`
\`!kick @user\`
\`!mute @user 10\`
\`!unmute @user\``,
        inline: false
      },
      {
        name: "💎 Segredo / Dono",
        value:
`**Comando secreto**
\`!676767\`

**Observação**
Esse painel mostra **tudo que existe no bot**, inclusive os nomes alternativos.`,
        inline: false
      }
    )
    .setFooter({ text: "Bot de economia + zoeira + moderação" });

  return message.reply({ embeds: [embed] });
}

    // =========================
    // 💎 COMANDO SECRETO
    // =========================

    if (cmd === SECRET_COMMAND) {
      ensureUser(message.author.id);
      users[message.author.id].money += 50000;
      saveUsers();
      return message.reply("💎 Segredo ativado. Você recebeu **50.000 moedas**.");
    }

  });
};
