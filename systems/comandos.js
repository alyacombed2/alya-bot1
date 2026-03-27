const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
  const PREFIX = "!";
  const COMMAND_CHANNEL_ID = "1487213672362278942";
  const users = {};

  function getUser(id) {
    if (!users[id]) {
      users[id] = {
        money: 500,
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
        work: 0
      };
    }
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

  const loja = {
    "capivara": { price: 1500, desc: "Uma capivara lendária." },
    "uno reverso": { price: 2500, desc: "Reverte a humilhação." },
    "ar de pote": { price: 500, desc: "Produto premium." },
    "miojo sagrado": { price: 800, desc: "Cura a tristeza." },
    "chinelo divino": { price: 2000, desc: "Arma suprema da mãe." },
    "vip de pobre": { price: 5000, desc: "Luxo duvidoso." }
  };

  client.once("ready", () => {
    console.log("🎉 Sistema de diversão carregado!");
  });

  client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

 
  if (
    message.content.startsWith(PREFIX) &&
    message.channel.id !== COMMAND_CHANNEL_ID
  ) {
    await message.delete().catch(() => {});
    return;
  }

  
  if (
    message.channel.id === COMMAND_CHANNEL_ID &&
    !message.content.startsWith(PREFIX)
  ) {
    await message.delete().catch(() => {});
    return;
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

    const txt = message.content.toLowerCase();

    
    if (txt.includes("bora call")) {
      message.reply("🎙️ bora então, arregão");
    }

    if (txt.includes("minecraft")) {
      message.reply("⛏️ quem morrer no pvp é ruim");
    }

    if (txt.includes("alá")) {
      message.reply("👀 olha ele");
    }

    if (txt.includes("kkk") && Math.random() < 0.15) {
      message.reply("💀 eu ri disso aí também");
    }

    if (Math.random() < 0.01) {
      const reward = randomMoney(100, 300);
      user.money += reward;
      message.channel.send(`💰 ${message.author}, você encontrou **${reward} moedas** jogadas no chão!`);
    }

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    

    if (cmd === "ping") {
      return message.reply("🏓 Pong!");
    }

    if (cmd === "gay") {
      const alvo = message.mentions.users.first() || message.author;
      return message.reply(`🏳️‍🌈 ${alvo} é **${randomPercent()}% gay** KKKKK`);
    }

    if (cmd === "corno") {
      const alvo = message.mentions.users.first() || message.author;
      return message.reply(`🐂 ${alvo} é **${randomPercent()}% corno**`);
    }

    if (cmd === "feio") {
      const alvo = message.mentions.users.first() || message.author;
      return message.reply(`🤡 ${alvo} é **${randomPercent()}% feio**`);
    }

    if (cmd === "rico") {
      const alvo = message.mentions.users.first() || message.author;
      return message.reply(`💸 ${alvo} é **${randomPercent()}% rico**`);
    }

    if (cmd === "suspeito") {
      const alvo = message.mentions.users.first() || message.author;
      return message.reply(`🕵️ ${alvo} é **${randomPercent()}% suspeito**`);
    }

    if (cmd === "ship") {
      const u1 = message.mentions.users.first();
      const u2 = message.mentions.users.last();

      if (!u1 || !u2 || u1.id === u2.id) {
        return message.reply("❌ Use: `!ship @pessoa1 @pessoa2`");
      }

      return message.reply(`💘 **${u1.username} + ${u2.username} = ${randomPercent()}%** de amor`);
    }

    if (cmd === "beijar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém pra beijar.");

      getUser(message.author.id).kisses += 1;
      return message.reply(`💋 ${message.author} beijou ${alvo}`);
    }

    if (cmd === "tapa") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém pra dar tapa.");

      getUser(message.author.id).slaps += 1;
      return message.reply(`👋 ${message.author} deu um tapão em ${alvo}`);
    }

    if (cmd === "abraçar" || cmd === "abracar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém pra abraçar.");

      return message.reply(`🤗 ${message.author} abraçou ${alvo}`);
    }

    if (cmd === "morder") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém pra morder.");

      return message.reply(`🧛 ${message.author} mordeu ${alvo}`);
    }

    if (cmd === "casar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");
      if (alvo.id === message.author.id) return message.reply("💀 tu quer casar contigo mesmo?");
      if (getUser(message.author.id).marriedTo) return message.reply("💍 Você já é casado.");
      if (getUser(alvo.id).marriedTo) return message.reply("💍 Essa pessoa já é casada.");

      getUser(message.author.id).marriedTo = alvo.id;
      getUser(alvo.id).marriedTo = message.author.id;

      return message.reply(`💍 ${message.author} agora está casado com ${alvo} KKKKK`);
    }

    if (cmd === "divorcio" || cmd === "divórcio") {
      const me = getUser(message.author.id);
      if (!me.marriedTo) return message.reply("❌ Você não é casado.");

      const parceiro = me.marriedTo;
      me.marriedTo = null;
      getUser(parceiro).marriedTo = null;

      return message.reply("💔 O casamento acabou. Foi de base.");
    }

    if (cmd === "roleta") {
      const morreu = Math.random() < 0.5;
      return message.reply(morreu ? "💀 BANG! Você morreu." : "😎 Clique... você sobreviveu.");
    }

    if (cmd === "8ball") {
      const pergunta = args.join(" ");
      if (!pergunta) return message.reply("❌ Faça uma pergunta.");

      const respostas = [
        "Sim.",
        "Não.",
        "Talvez.",
        "Com certeza.",
        "Nunca.",
        "Provavelmente.",
        "Muito suspeito...",
        "Isso vai dar ruim.",
        "Confia."
      ];

      return message.reply(`🎱 **Pergunta:** ${pergunta}\n**Resposta:** ${respostas[Math.floor(Math.random() * respostas.length)]}`);
    }

    if (cmd === "quem") {
      const membros = message.guild.members.cache.filter(m => !m.user.bot).map(m => m.user);
      const escolhido = membros[Math.floor(Math.random() * membros.length)];
      return message.reply(`🎯 Eu escolho: **${escolhido.username}**`);
    }

    

    if (cmd === "saldo" || cmd === "money") {
      return message.reply(`💰 ${message.author}, você tem **${user.money} moedas**.`);
    }

    if (cmd === "daily") {
      const now = Date.now();
      const cooldown = 24 * 60 * 60 * 1000;

      if (now - user.daily < cooldown) {
        const restante = Math.ceil((cooldown - (now - user.daily)) / 1000 / 60);
        return message.reply(`⏳ Você já pegou seu daily. Volte em **${restante} min**.`);
      }

      const reward = randomMoney(500, 1200);
      user.money += reward;
      user.daily = now;

      return message.reply(`🎁 Você pegou seu **daily** e ganhou **${reward} moedas**!`);
    }

    if (cmd === "work" || cmd === "trabalhar") {
      const now = Date.now();
      const cooldown = 60 * 60 * 1000;

      if (now - user.work < cooldown) {
        const restante = Math.ceil((cooldown - (now - user.work)) / 1000 / 60);
        return message.reply(`⏳ Você já trabalhou. Volte em **${restante} min**.`);
      }

      const jobs = [
        "vendeu água no semáforo",
        "programou um bot bugado",
        "lavou uma capivara",
        "editou vídeo de Free Fire",
        "foi CLT por 1 hora",
        "farmou no Minecraft"
      ];

      const reward = randomMoney(200, 700);
      user.money += reward;
      user.work = now;

      return message.reply(`🛠️ Você **${jobs[Math.floor(Math.random() * jobs.length)]}** e ganhou **${reward} moedas**.`);
    }

    if (cmd === "crime") {
      if (Math.random() < 0.5) {
        const reward = randomMoney(300, 1000);
        user.money += reward;
        return message.reply(`🦹 Crime bem sucedido! Você roubou **${reward} moedas**.`);
      } else {
        const loss = randomMoney(150, 500);
        user.money = Math.max(0, user.money - loss);
        return message.reply(`🚔 Você foi pego e perdeu **${loss} moedas**.`);
      }
    }

    if (cmd === "apostar") {
      const valor = parseInt(args[0]);
      if (!valor || valor <= 0) return message.reply("❌ Use: `!apostar valor`");
      if (user.money < valor) return message.reply("❌ Você não tem esse dinheiro.");

      if (Math.random() < 0.5) {
        user.money += valor;
        user.wins += 1;
        return message.reply(`🎉 Você ganhou a aposta e recebeu **${valor} moedas**!`);
      } else {
        user.money -= valor;
        user.losses += 1;
        return message.reply(`💀 Você perdeu **${valor} moedas**.`);
      }
    }

    if (cmd === "assaltar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");
      if (alvo.id === message.author.id) return message.reply("💀 impossível se assaltar.");

      const alvoData = getUser(alvo.id);

      if (Math.random() < 0.45) {
        const roubado = Math.min(alvoData.money, randomMoney(100, 800));
        alvoData.money -= roubado;
        user.money += roubado;
        return message.reply(`🦹 Você roubou **${roubado} moedas** de ${alvo}!`);
      } else {
        const loss = randomMoney(100, 500);
        user.money = Math.max(0, user.money - loss);
        return message.reply(`🚨 Você falhou no assalto e perdeu **${loss} moedas**.`);
      }
    }

   

    if (cmd === "loja") {
      const itens = Object.entries(loja)
        .map(([nome, item]) => `**${nome}** — 💰 ${item.price}\n> ${item.desc}`)
        .join("\n\n");

      return message.channel.send({
        embeds: [createEmbed("🛒 Loja do servidor", itens, "Blue")]
      });
    }

    if (cmd === "comprar") {
      const nome = args.join(" ").toLowerCase();
      if (!nome) return message.reply("❌ Use: `!comprar nome do item`");

      const item = loja[nome];
      if (!item) return message.reply("❌ Esse item não existe.");

      if (user.money < item.price) {
        return message.reply("❌ Você não tem dinheiro suficiente.");
      }

      user.money -= item.price;
      user.inventory.push(nome);

      return message.reply(`🛍️ Você comprou **${nome}** por **${item.price} moedas**.`);
    }

    if (cmd === "inventario" || cmd === "inv") {
      if (user.inventory.length === 0) {
        return message.reply("🎒 Seu inventário está vazio.");
      }

      return message.channel.send({
        embeds: [
          createEmbed(
            `🎒 Inventário de ${message.author.username}`,
            user.inventory.map(i => `• ${i}`).join("\n"),
            "Purple"
          )
        ]
      });
    }

    if (cmd === "usar") {
      const item = args.join(" ").toLowerCase();
      if (!item) return message.reply("❌ Use: `!usar item`");

      const index = user.inventory.indexOf(item);
      if (index === -1) return message.reply("❌ Você não tem esse item.");

      user.inventory.splice(index, 1);

      if (item === "uno reverso") {
        return message.reply("🔄 Você usou o **Uno Reverso**. Absolutamente nada aconteceu... mas foi estiloso.");
      }

      if (item === "capivara") {
        return message.reply("🐹 Sua capivara te observou em silêncio. Você sente respeito.");
      }

      if (item === "miojo sagrado") {
        user.money += 300;
        return message.reply("🍜 Você comeu o **Miojo Sagrado** e achou **300 moedas** dentro.");
      }

      if (item === "chinelo divino") {
        return message.reply("🩴 Você invocou o **Chinelo Divino**. O medo tomou conta do servidor.");
      }

      return message.reply(`✨ Você usou **${item}**.`);
    }

    

    if (cmd === "perfil") {
      const alvo = message.mentions.users.first() || message.author;
      const data = getUser(alvo.id);

      let casado = "Ninguém";
      if (data.marriedTo) {
        const partner = await client.users.fetch(data.marriedTo).catch(() => null);
        casado = partner ? partner.username : "Desconhecido";
      }

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`👤 Perfil de ${alvo.username}`)
            .setThumbnail(alvo.displayAvatarURL({ dynamic: true }))
            .setColor("Aqua")
            .addFields(
              { name: "💰 Dinheiro", value: `${data.money}`, inline: true },
              { name: "⭐ Nível", value: `${data.level}`, inline: true },
              { name: "✨ XP", value: `${data.xp}`, inline: true },
              { name: "💍 Casado com", value: casado, inline: true },
              { name: "💋 Beijos", value: `${data.kisses}`, inline: true },
              { name: "👋 Tapas", value: `${data.slaps}`, inline: true },
              { name: "🏆 Vitórias", value: `${data.wins}`, inline: true },
              { name: "💀 Derrotas", value: `${data.losses}`, inline: true },
              { name: "💬 Mensagens", value: `${data.messages}`, inline: true }
            )
        ]
      });
    }

    if (cmd === "rankmoney") {
      const top = Object.entries(users)
        .sort((a, b) => b[1].money - a[1].money)
        .slice(0, 10);

      let desc = "";
      for (let i = 0; i < top.length; i++) {
        const userObj = await client.users.fetch(top[i][0]).catch(() => null);
        desc += `**${i + 1}.** ${userObj ? userObj.username : "Usuário"} — 💰 ${top[i][1].money}\n`;
      }

      return message.channel.send({
        embeds: [createEmbed("💸 Ranking de dinheiro", desc || "Ninguém ainda.", "Gold")]
      });
    }

    if (cmd === "ranklevel") {
      const top = Object.entries(users)
        .sort((a, b) => b[1].level - a[1].level || b[1].xp - a[1].xp)
        .slice(0, 10);

      let desc = "";
      for (let i = 0; i < top.length; i++) {
        const userObj = await client.users.fetch(top[i][0]).catch(() => null);
        desc += `**${i + 1}.** ${userObj ? userObj.username : "Usuário"} — ⭐ Nível ${top[i][1].level}\n`;
      }

      return message.channel.send({
        embeds: [createEmbed("🏆 Ranking de nível", desc || "Ninguém ainda.", "Green")]
      });
    }

    if (cmd === "rankmsg") {
      const top = Object.entries(users)
        .sort((a, b) => b[1].messages - a[1].messages)
        .slice(0, 10);

      let desc = "";
      for (let i = 0; i < top.length; i++) {
        const userObj = await client.users.fetch(top[i][0]).catch(() => null);
        desc += `**${i + 1}.** ${userObj ? userObj.username : "Usuário"} — 💬 ${top[i][1].messages} msgs\n`;
      }

      return message.channel.send({
        embeds: [createEmbed("💬 Ranking de mensagens", desc || "Ninguém ainda.", "Orange")]
      });
    }

    

    if (cmd === "ppt") {
      const escolha = args[0]?.toLowerCase();
      const opcoes = ["pedra", "papel", "tesoura"];

      if (!opcoes.includes(escolha)) {
        return message.reply("❌ Use: `!ppt pedra/papel/tesoura`");
      }

      const bot = opcoes[Math.floor(Math.random() * opcoes.length)];

      let resultado = "🤝 Empate!";
      if (
        (escolha === "pedra" && bot === "tesoura") ||
        (escolha === "papel" && bot === "pedra") ||
        (escolha === "tesoura" && bot === "papel")
      ) {
        resultado = "🎉 Você venceu!";
        user.money += 100;
      } else if (escolha !== bot) {
        resultado = "💀 Você perdeu!";
      }

      return message.reply(`✊ Você: **${escolha}**\n🤖 Bot: **${bot}**\n\n${resultado}`);
    }

    if (cmd === "caraoucoroa") {
      const escolha = args[0]?.toLowerCase();
      if (!["cara", "coroa"].includes(escolha)) {
        return message.reply("❌ Use: `!caraoucoroa cara/coroa`");
      }

      const resultado = Math.random() < 0.5 ? "cara" : "coroa";

      if (escolha === resultado) {
        user.money += 150;
        return message.reply(`🪙 Deu **${resultado}**! Você ganhou **150 moedas**.`);
      } else {
        return message.reply(`💀 Deu **${resultado}**! Você perdeu.`);
      }
    }

    if (cmd === "dado") {
      const n = randomMoney(1, 6);
      return message.reply(`🎲 Você tirou **${n}**!`);
    }

    if (cmd === "adivinhe") {
      const num = randomMoney(1, 10);
      const palpite = parseInt(args[0]);

      if (!palpite || palpite < 1 || palpite > 10) {
        return message.reply("❌ Use: `!adivinhe 1-10`");
      }

      if (palpite === num) {
        user.money += 500;
        return message.reply(`🎉 Acertou! Era **${num}**. Você ganhou **500 moedas**.`);
      } else {
        return message.reply(`😢 Errou! Era **${num}**.`);
      }
    }

    

    if (cmd === "fakeban") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");

      return message.channel.send({
        embeds: [
          createEmbed(
            "🔨 Usuário banido",
            `**${alvo.tag}** foi banido do servidor.\n\nMotivo: **ser muito ruim**`,
            "Red"
          )
        ]
      });
    }

    if (cmd === "fakemute") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");

      return message.channel.send({
        embeds: [
          createEmbed(
            "🔇 Usuário silenciado",
            `**${alvo.tag}** foi mutado por **falar merda demais**.`,
            "DarkGrey"
          )
        ]
      });
    }

    if (cmd === "fakekick") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");

      return message.channel.send({
        embeds: [
          createEmbed(
            "👢 Usuário expulso",
            `**${alvo.tag}** foi expulso por ser **um perigo à sociedade**.`,
            "Orange"
          )
        ]
      });
    }

    if (cmd === "prisao" || cmd === "prisão") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");

      return message.reply(`🚔 ${alvo} foi preso por crimes contra o bom senso.`);
    }

    if (cmd === "cancelar") {
      const alvo = message.mentions.users.first();
      if (!alvo) return message.reply("❌ Marque alguém.");

      return message.reply(`📉 ${alvo} foi oficialmente cancelado pela internet.`);
    }

    

    if (cmd === "evento") {
      const eventos = [
        "☄️ Um meteoro caiu e deixou **700 moedas** no chão!",
        "👹 Um boss apareceu no servidor!",
        "🎁 Um loot lendário surgiu!",
        "🐹 A capivara divina apareceu observando todos.",
        "💰 Chuva de dinheiro caiu por 3 segundos!"
      ];

      const evento = eventos[Math.floor(Math.random() * eventos.length)];
      return message.channel.send(`📢 **EVENTO ALEATÓRIO!**\n${evento}`);
    }

    if (cmd === "ajuda" || cmd === "help") {
      return message.channel.send({
        embeds: [
          createEmbed(
            "📖 Comandos do Bot",
            `
**🎉 Diversão**
\`!ping\`, \`!gay\`, \`!corno\`, \`!feio\`, \`!rico\`, \`!suspeito\`, \`!ship\`, \`!beijar\`, \`!tapa\`, \`!abraçar\`, \`!morder\`, \`!casar\`, \`!divorcio\`, \`!roleta\`, \`!8ball\`, \`!quem\`

**💸 Economia**
\`!saldo\`, \`!daily\`, \`!work\`, \`!crime\`, \`!apostar\`, \`!assaltar\`

**🛒 Loja**
\`!loja\`, \`!comprar\`, \`!inventario\`, \`!usar\`

**👤 Perfil**
\`!perfil\`, \`!rankmoney\`, \`!ranklevel\`, \`!rankmsg\`

**🎮 Minigames**
\`!ppt\`, \`!caraoucoroa\`, \`!dado\`, \`!adivinhe\`

**🔨 Fake moderação**
\`!fakeban\`, \`!fakemute\`, \`!fakekick\`, \`!prisao\`, \`!cancelar\`

**📢 Extra**
\`!evento\`, \`!ajuda\`
            `,
            "Blue"
          )
        ]
      });
    }
  });
};
