const {
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const PREFIX = "!";
  const COMMAND_CHANNEL_ID = "1487213672362278942";
  const BLOCK_COMMANDS_CHANNEL_ID = "1476321406647275571";
  const SECRET_COMMAND = "676767";

  const dataPath = path.join(__dirname, "..", "data", "economy.json");

  // =========================
  // DADOS
  // =========================
  let users = {};

  if (fs.existsSync(dataPath)) {
    try {
      users = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    } catch (err) {
      console.error("Erro ao carregar economy.json:", err);
      users = {};
    }
  }

  function saveUsers() {
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
  }

  function ensureUser(userId) {
    if (!users[userId]) {
      users[userId] = {
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
        marriedTo: null,
        jailed: false,
        inventory: {},
        cooldowns: {
          daily: 0,
          work: 0,
          crime: 0,
          rob: 0
        }
      };
    }

    // Corrige JSON quebrado / incompleto
    if (!users[userId].inventory) users[userId].inventory = {};
    if (!users[userId].cooldowns) {
      users[userId].cooldowns = {
        daily: 0,
        work: 0,
        crime: 0,
        rob: 0
      };
    }

    if (typeof users[userId].money !== "number") users[userId].money = 500;
    if (typeof users[userId].bank !== "number") users[userId].bank = 0;
    if (typeof users[userId].xp !== "number") users[userId].xp = 0;
    if (typeof users[userId].level !== "number" || users[userId].level < 1) users[userId].level = 1;
    if (typeof users[userId].rep !== "number") users[userId].rep = 0;
    if (typeof users[userId].kisses !== "number") users[userId].kisses = 0;
    if (typeof users[userId].slaps !== "number") users[userId].slaps = 0;
    if (typeof users[userId].wins !== "number") users[userId].wins = 0;
    if (typeof users[userId].losses !== "number") users[userId].losses = 0;
    if (typeof users[userId].messages !== "number") users[userId].messages = 0;
    if (typeof users[userId].jailed !== "boolean") users[userId].jailed = false;
    if (!("marriedTo" in users[userId])) users[userId].marriedTo = null;
  }

  // =========================
  // UTIL
  // =========================
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function formatNumber(num) {
    return Number(num || 0).toLocaleString("pt-BR");
  }

  function msToTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0) parts.push(`${s}s`);

    return parts.join(" ") || "0s";
  }

  function createEmbed(title, description, color = "Blue") {
    return new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setFooter({ text: "Alya Bot • Economia + Zueira + Moderação" })
      .setTimestamp();
  }

  function isAdmin(member) {
    return member.permissions.has(PermissionFlagsBits.Administrator);
  }

  function isMod(member) {
    return (
      member.permissions.has(PermissionFlagsBits.ManageMessages) ||
      member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
      member.permissions.has(PermissionFlagsBits.KickMembers) ||
      member.permissions.has(PermissionFlagsBits.BanMembers) ||
      member.permissions.has(PermissionFlagsBits.ManageGuild)
    );
  }

  // =========================
  // LOJA
  // =========================
  const shopItems = {
    pizza: {
      name: "Pizza",
      price: 250,
      use: true
    },
    pcgamer: {
      name: "PC Gamer",
      price: 5000,
      use: true
    },
    vip: {
      name: "VIP Fake",
      price: 12000,
      use: true
    },
    arma: {
      name: "Arma",
      price: 3500,
      use: false
    },
    colete: {
      name: "Colete",
      price: 2800,
      use: false
    },
    notebook: {
      name: "Notebook",
      price: 2200,
      use: true
    },
    cafe: {
      name: "Café",
      price: 120,
      use: true
    },
    hamburguer: {
      name: "Hambúrguer",
      price: 180,
      use: true
    },
    celular: {
      name: "Celular",
      price: 3200,
      use: true
    }
  };

  // =========================
  // COOLDOWN DE XP
  // =========================
  const cooldowns = {
    chatXP: {}
  };

  // =========================
  // EVENTO DE MENSAGENS
  // =========================
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const userId = message.author.id;
    ensureUser(userId);

    // Bloqueia comandos em canal proibido
    if (
      message.channel.id === BLOCK_COMMANDS_CHANNEL_ID &&
      message.content.startsWith(PREFIX)
    ) {
      return message.reply("❌ Você não pode usar comandos neste canal.");
    }

    // =========================
    // XP POR MENSAGEM
    // =========================
    const now = Date.now();
    if (!cooldowns.chatXP[userId] || now - cooldowns.chatXP[userId] > 15000) {
      cooldowns.chatXP[userId] = now;

      const xpGain = rand(3, 8); // balanceado
      users[userId].xp += xpGain;
      users[userId].messages += 1;

      const needed = users[userId].level * 100;

      if (users[userId].xp >= needed) {
        users[userId].xp -= needed;
        users[userId].level += 1;

        const reward = rand(80, 180); // menos roubado
        users[userId].money += reward;

        message.channel.send(
          `🎉 ${message.author} subiu para o **nível ${users[userId].level}** e ganhou **$${formatNumber(reward)}**!`
        );
      }

      saveUsers();
    }

    // Se não for comando, para aqui
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();

    // =========================
    // BLOQUEIO DE PRESO
    // =========================
    const allowedWhileJailed = ["perfil", "saldo", "money", "banco", "help", "ajuda"];

    if (users[userId].jailed && !allowedWhileJailed.includes(cmd)) {
      return message.reply("🚔 Você está **preso** e não pode usar esse comando.");
    }

    // =========================
    // AQUI COMEÇA A PARTE 2
    // =========================
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
    if (cmd === "saldo" || cmd === "money" || cmd === "bal") {
      const u = users[userId];

      const embed = createEmbed(
        `💰 Saldo de ${message.author.username}`,
        [
          `**Carteira:** $${formatNumber(u.money)}`,
          `**Banco:** $${formatNumber(u.bank)}`,
          `**Nível:** ${u.level}`,
          `**XP:** ${formatNumber(u.xp)}/${formatNumber(u.level * 100)}`,
          `**Mensagens:** ${formatNumber(u.messages)}`
        ].join("\n"),
        "Green"
      );

      return message.reply({ embeds: [embed] });
    }

    // =========================
    // BANCO
    // =========================
    if (cmd === "banco" || cmd === "atm") {
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

    if (cmd === "sacar" || cmd === "with" || cmd === "withdraw") {
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

      const reward = rand(400, 850); // balanceado
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

      const reward = rand(180, 420);

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

      const success = Math.random() < 0.55;

      if (success) {
        const reward = rand(250, 700);
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
        const loss = rand(150, 450);
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
    if (cmd === "assaltar" || cmd === "roubar") {
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

      if (users[alvo.id].money < 250) {
        return message.reply("❌ Essa pessoa está pobre demais pra ser assaltada.");
      }

      users[userId].cooldowns.rob = Date.now();

      let chance = 0.40;
      if (users[userId].inventory["arma"]) chance += 0.10;
      if (users[alvo.id].inventory["colete"]) chance -= 0.12;

      const success = Math.random() < chance;

      if (success) {
        const amount = Math.min(
          rand(120, 600),
          Math.floor(users[alvo.id].money * 0.25)
        );

        users[alvo.id].money -= amount;
        users[userId].money += amount;
        saveUsers();

        return message.reply(
          `🦹 Você assaltou **${alvo.username}** e roubou **$${formatNumber(amount)}**!`
        );
      } else {
        const penalty = rand(120, 350);
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
        .map(([id, item]) => {
          return `\`${id}\` • **${item.name}** — $${formatNumber(item.price)}${item.use ? " *(usável)*" : " *(passivo)*"}`;
        })
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
    if (cmd === "inventario" || cmd === "inventário" || cmd === "inv" || cmd === "itens") {
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
        users[userId].money += 80;
        saveUsers();
        return message.reply("🍕 Você comeu uma pizza e recuperou suas energias. Ainda vendeu a caixa por **$80**.");
      }

      if (itemId === "pcgamer") {
        users[userId].inventory[itemId] -= 1;
        users[userId].xp += 250;
        saveUsers();
        return message.reply("🖥️ Você usou o **PC Gamer** e ganhou **250 XP**.");
      }

      if (itemId === "vip") {
        users[userId].inventory[itemId] -= 1;
        users[userId].money += 2500;
        saveUsers();
        return message.reply("💎 Você ativou um **VIP fake** e ganhou **$2.500**.");
      }

      if (itemId === "notebook") {
        users[userId].inventory[itemId] -= 1;
        users[userId].xp += 120;
        saveUsers();
        return message.reply("💻 Você estudou no **Notebook** e ganhou **120 XP**.");
      }

      if (itemId === "cafe") {
        users[userId].inventory[itemId] -= 1;
        users[userId].xp += 35;
        saveUsers();
        return message.reply("☕ Você tomou um **Café** e ganhou **35 XP**.");
      }

      if (itemId === "hamburguer") {
        users[userId].inventory[itemId] -= 1;
        users[userId].money += 40;
        saveUsers();
        return message.reply("🍔 Você comeu um **Hambúrguer** e ficou feliz. Achou **$40** no bolso.");
      }

      if (itemId === "celular") {
        users[userId].inventory[itemId] -= 1;
        users[userId].money += 500;
        saveUsers();
        return message.reply("📱 Você revendeu o **Celular** e ganhou **$500**.");
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
          `**🧠 XP:** ${formatNumber(u.xp)}/${formatNumber(u.level * 100)}`,
          `**💬 Mensagens:** ${formatNumber(u.messages)}`,
          `**💋 Beijos:** ${formatNumber(u.kisses)}`,
          `**👋 Tapas:** ${formatNumber(u.slaps)}`,
          `**💍 Casado com:** ${u.marriedTo ? `<@${u.marriedTo}>` : "Ninguém"}`,
          `**🚔 Preso:** ${u.jailed ? "Sim" : "Não"}`
        ].join("\n"),
        "Aqua"
      );

      return message.reply({ embeds: [embed] });
    }

    // =========================
    // RANKING
    // =========================
    if (cmd === "rank" || cmd === "ranking" || cmd === "topmoney" || cmd === "leaderboard") {
      const ranking = Object.entries(users)
        .sort((a, b) => (b[1].money + b[1].bank) - (a[1].money + a[1].bank))
        .slice(0, 10)
        .map(([id, data], i) => {
          const member = client.users.cache.get(id);
          return `**${i + 1}.** ${member ? member.username : "Usuário"} — $${formatNumber(data.money + data.bank)}`;
        })
        .join("\n");

      const embed = createEmbed("🏆 Top Dinheiro", ranking || "Ninguém ainda.", "Yellow");
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

      const embed = createEmbed("⭐ Top Nível", ranking || "Ninguém ainda.", "Orange");
      return message.reply({ embeds: [embed] });
    }

    // =========================
    // AQUI COMEÇA A PARTE 3
    // =========================
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

    if (cmd === "casar" || cmd === "marry") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém para casar!");
      if (alvo.id === message.author.id) return message.reply("🤨 Você não pode casar consigo mesmo.");
      ensureUser(message.author.id);
      ensureUser(alvo.id);

      if (users[message.author.id].marriedTo) return message.reply("❌ Você já é casado.");
      if (users[alvo.id].marriedTo) return message.reply("❌ Essa pessoa já é casada.");

      users[message.author.id].marriedTo = alvo.id;
      users[alvo.id].marriedTo = message.author.id;
      saveUsers();

      return message.reply(`💍 ${message.author} agora está casado com ${alvo}!`);
    }

    if (cmd === "divorciar" || cmd === "divorce") {
      ensureUser(message.author.id);
      if (!users[message.author.id].marriedTo) {
        return message.reply("❌ Você não é casado.");
      }

      const parceiro = users[message.author.id].marriedTo;
      users[message.author.id].marriedTo = null;
      if (users[parceiro]) users[parceiro].marriedTo = null;
      saveUsers();

      return message.reply("💔 Vocês se divorciaram.");
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

    if (cmd === "fofo") {
      const alvo = message.mentions.users.first() || message.author;
      const porcentagem = Math.floor(Math.random() * 101);
      return message.reply(`🐻 ${alvo.username} é **${porcentagem}% fofo**.`);
    }

    if (cmd === "sortudo") {
      const alvo = message.mentions.users.first() || message.author;
      const porcentagem = Math.floor(Math.random() * 101);
      return message.reply(`🍀 ${alvo.username} tem **${porcentagem}% de sorte** hoje.`);
    }

    if (cmd === "azarado") {
      const alvo = message.mentions.users.first() || message.author;
      const porcentagem = Math.floor(Math.random() * 101);
      return message.reply(`💀 ${alvo.username} tem **${porcentagem}% de azar** hoje.`);
    }

    if (cmd === "gado") {
      const alvo = message.mentions.users.first() || message.author;
      const porcentagem = Math.floor(Math.random() * 101);
      return message.reply(`🐂 ${alvo.username} é **${porcentagem}% gado**.`);
    }

    if (cmd === "sigma") {
      const alvo = message.mentions.users.first() || message.author;
      const porcentagem = Math.floor(Math.random() * 101);
      return message.reply(`🗿 ${alvo.username} é **${porcentagem}% sigma**.`);
    }

    if (cmd === "cringe") {
      const alvo = message.mentions.users.first() || message.author;
      const porcentagem = Math.floor(Math.random() * 101);
      return message.reply(`📉 ${alvo.username} é **${porcentagem}% cringe**.`);
    }

    if (cmd === "mito") {
      const alvo = message.mentions.users.first() || message.author;
      return message.reply(`👑 ${alvo.username} é oficialmente um mito.`);
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

    if (cmd === "stalk") {
      const alvo = message.mentions.users.first() || message.author;
      return message.reply(`🕵️ Investigando ${alvo.username}...\n📱 Última atividade: online até demais.`);
    }

    if (cmd === "roubarcalcinha") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém!");
      return message.reply(`🩲 ${message.author} roubou a calcinha de ${alvo} e saiu correndo.`);
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

    if (cmd === "rir") {
      return message.reply("😂 KKKKKKKKKKKKKKKKKKKKKKK");
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

    if (cmd === "escolher" || cmd === "choose") {
      const opcoes = args.join(" ").split("|").map(x => x.trim()).filter(Boolean);
      if (opcoes.length < 2) {
        return message.reply("❌ Use assim: `!escolher pizza | sushi | hambúrguer`");
      }
      const escolha = opcoes[Math.floor(Math.random() * opcoes.length)];
      return message.reply(`🤔 Eu escolho: **${escolha}**`);
    }

    if (cmd === "numero" || cmd === "número") {
      const numero = Math.floor(Math.random() * 100) + 1;
      return message.reply(`🔢 Seu número aleatório é **${numero}**.`);
    }

    if (cmd === "sorte") {
      const frases = [
        "🍀 Hoje é seu dia de sorte.",
        "💀 Melhor nem sair de casa hoje.",
        "😎 Algo bom vem aí.",
        "🤡 Hoje você vai passar vergonha.",
        "💸 Chance alta de ganhar dinheiro."
      ];
      return message.reply(frases[Math.floor(Math.random() * frases.length)]);
    }

    if (cmd === "conselho") {
      const conselhos = [
        "🧠 Pare de procrastinar e vai fazer algo útil.",
        "💧 Bebe água.",
        "😴 Dorme cedo hoje, sem desculpa.",
        "📚 Estuda agora pra não sofrer depois.",
        "💸 Guarda dinheiro, seu eu do futuro agradece."
      ];
      return message.reply(conselhos[Math.floor(Math.random() * conselhos.length)]);
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
        .setDescription("Aqui estão **todos os comandos do bot**.")
        .setColor("Purple")
        .addFields(
          {
            name: "💰 Economia",
            value:
`!saldo
!daily
!work
!crime
!assaltar @user
!depositar valor
!sacar valor
!banco
!loja
!comprar item qtd
!inventario
!usar item
!perfil
!rank
!topmoney
!toplevel`
          },
          {
            name: "😂 Zueira / Social",
            value:
`!beijar @user
!tapa @user
!abraçar @user
!morder @user
!atirar @user
!matar @user
!reviver @user
!casar @user
!divorciar
!ship @user
!gay @user
!corno @user
!burro @user
!lindo @user
!feio @user
!fofo @user
!sortudo @user
!azarado @user
!gado @user
!sigma @user
!cringe @user
!mito @user
!cancelar @user
!hackear @user
!stalk @user
!fome
!comer
!dormir
!chorar
!dancar
!cantar
!gritar
!rir
!meme
!piada
!8ball
!moeda
!dado
!ppt
!roleta
!escolher
!numero
!sorte
!conselho`
          },
          {
            name: "🛠️ Utilidade / Staff",
            value:
`!ping
!avatar
!serverinfo
!userinfo
!limpar
!say
!anuncio
!ban
!kick
!mute
!unmute`
          },
          {
            name: "💎 Secreto",
            value: `!676767`
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
