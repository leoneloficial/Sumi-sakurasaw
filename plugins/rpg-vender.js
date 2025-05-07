import fs from 'fs';
import path from 'path';

const haremFilePath = path.resolve('./src/database/harem.json');
const pendingTransactions = new Map();

function loadHarem() {
  try {
    const data = fs.readFileSync(haremFilePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
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
  const harem = loadHarem();

  if (command === 'vender') {
    const name = args[0];
    const price = parseInt(args[1]);

    if (!name || !price) return m.reply('⚠️ Debes especificar el nombre y el precio del personaje.');

    const characterToSell = harem.find(c => c.name === name && c.owner === m.sender);

    if (!characterToSell) return m.reply('⚠️ No tienes ese personaje.');

    characterToSell.forSale = true;
    characterToSell.price = price;
    characterToSell.seller = m.sender;

    saveHarem(harem);

    m.reply(`✅ Has puesto a la venta a ${name} por ${price} exp.`);
  }

  if (command === 'comprar') {
    const name = args[0];

    if (!name) return m.reply('⚠️ Debes especificar el nombre del personaje.');

    const characterToBuy = harem.find(c => c.name === name && c.forSale);

    if (!characterToBuy) return m.reply('⚠️ Ese personaje no está en venta.');

    if (characterToBuy.price > global.db.data.users[m.sender].exp) return m.reply('⚠️ No tienes suficiente experiencia para comprar ese personaje.');

    global.db.data.users[m.sender].exp -= characterToBuy.price;
    characterToBuy.owner = m.sender;
    characterToBuy.forSale = false;
    characterToBuy.buyer = m.sender;

    saveHarem(harem);

    conn.sendMessage(characterToBuy.seller, { text: `✅ @${m.sender.split('@')[0]} ha comprado a ${name} por ${characterToBuy.price} exp.`, mentions: [m.sender] });
    m.reply(`✅ Has comprado a ${name} por ${characterToBuy.price} exp.`);
  }

  if (command === 'personajes') {
    const charactersForSale = harem.filter(c => c.forSale);

    if (charactersForSale.length === 0) return m.reply('⚠️ No hay personajes en venta.');

    let message = 'Personajes en venta:\n';
    charactersForSale.forEach(c => {
      message += `${c.name} - ${c.price} exp. (Vendido por @${c.seller.split('@')[0]})\n`;
    });

    m.reply(message, null, { mentions: charactersForSale.map(c => c.seller) });
  }
};

handler.command = ['vender', 'comprar', 'personajes'];
handler.help = ['vender', 'comprar', 'personajes'];
handler.tags = ['harem'];

export default handler;