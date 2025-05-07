import fs from 'fs';
import path from 'path';

const charactersFilePath = path.resolve('./src/database/characters.json');
const haremFilePath = path.resolve('./src/database/harem.json');

function loadCharacters() {
  try {
    const data = fs.readFileSync(charactersFilePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
  }
}

function loadHarem() {
  try {
    const data = fs.readFileSync(haremFilePath, 'utf-8');
    return JSON.parse(data || '{}');
  } catch (error) {
    return {};
  }
}

function saveHarem(harem) {
  try {
    fs.writeFileSync(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al guardar harem:', error);
  }
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const characters = loadCharacters();
  const harem = loadHarem();

  if (!harem[m.sender]) {
    harem[m.sender] = [];
  }

  if (command === 'vender') {
    const name = args[0];
    const price = parseInt(args[1]);

    if (!name || !price) return m.reply('⚠️ Debes especificar el nombre y el precio del personaje.');

    const character = harem[m.sender].find(c => c.name === name);

    if (!character) return m.reply('⚠️ No tienes ese personaje.');

    character.forSale = true;
    character.price = price;

    saveHarem(harem);

    m.reply(`✅ Has puesto a la venta a ${name} por ${price} exp.`);
  }

  if (command === 'comprar') {
    const name = args[0];

    if (!name) return m.reply('⚠️ Debes especificar el nombre del personaje.');

    for (const user in harem) {
      const character = harem[user].find(c => c.name === name && c.forSale);

      if (character) {
        if (character.price > global.db.data.users[m.sender].exp) return m.reply('⚠️ No tienes suficiente experiencia para comprar ese personaje.');

        global.db.data.users[m.sender].exp -= character.price;
        global.db.data.users[user].exp += character.price;

        const index = harem[user].indexOf(character);
        harem[user].splice(index, 1);
        if (!harem[m.sender]) {
          harem[m.sender] = [];
        }
        harem[m.sender].push(character);

        saveHarem(harem);

        conn.sendMessage(user, { text: `✅ @${m.sender.split('@')[0]} ha comprado a ${name} por ${character.price} exp.`, mentions: [m.sender] });
        m.reply(`✅ Has comprado a ${name} por ${character.price} exp.`);

        return;
      }
    }

    m.reply('⚠️ Ese personaje no está en venta.');
  }

  if (command === 'personajes') {
    const charactersForSale = [];

    for (const user in harem) {
      harem[user].forEach(c => {
        if (c.forSale) {
          charactersForSale.push({ user, character: c });
        }
      });
    }

    if (charactersForSale.length === 0) return m.reply('⚠️ No hay personajes en venta.');

    let message = 'Personajes en venta:\n';
    charactersForSale.forEach(c => {
      message += `${c.character.name} - ${c.character.price} exp. (Vendido por @${c.user.split('@')[0]})\n`;
    });

    m.reply(message, null, { mentions: charactersForSale.map(c => c.user) });
  }

  if (command === 'inventario') {
    if (harem[m.sender].length === 0) return m.reply('⚠️ No tienes personajes.');

    let message = 'Tus personajes:\n';
    harem[m.sender].forEach((c, index) => {
      message += `${index + 1}. ${c.name}\n`;
    });

    m.reply(message);
  }
};

handler.command = ['vender', 'comprar', 'personajes', 'inventario'];
handler.help', handler.tags = ['waifu'];

export default handler;