import fs from 'fs';
import path from 'path';

const waifuFilePath = path.resolve('./database/waifu.json');
const pendingTransactions = new Map();

function loadWaifu() {
  try {
    const data = fs.readFileSync(waifuFilePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
  }
}

function saveWaifu(waifu) {
  try {
    fs.writeFileSync(waifuFilePath, JSON.stringify(waifu, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al guardar waifu:', error);
  }
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const waifu = loadWaifu();

  if (command === 'vender') {
    const name = args[0];
    const price = parseInt(args[1]);

    if (!name || !price) return m.reply('⚠️ Debes especificar el nombre y el precio del personaje.');

    const waifuToSell = waifu.find(w => w.name === name && w.owner === m.sender);

    if (!waifuToSell) return m.reply('⚠️ No tienes ese personaje.');

    waifuToSell.forSale = true;
    waifuToSell.price = price;
    waifuToSell.seller = m.sender;

    saveWaifu(waifu);

    m.reply(`✅ Has puesto a la venta a ${name} por ${price} exp.`);
  }

  if (command === 'comprar') {
    const name = args[0];

    if (!name) return m.reply('⚠️ Debes especificar el nombre del personaje.');

    const waifuToBuy = waifu.find(w => w.name === name && w.forSale);

    if (!waifuToBuy) return m.reply('⚠️ Ese personaje no está en venta.');

    if (waifuToBuy.price > global.db.data.users[m.sender].exp) return m.reply('⚠️ No tienes suficiente experiencia para comprar ese personaje.');

    global.db.data.users[m.sender].exp -= waifuToBuy.price;
    waifuToBuy.owner = m.sender;
    waifuToBuy.forSale = false;
    waifuToBuy.buyer = m.sender;

    saveWaifu(waifu);

    conn.sendMessage(waifuToBuy.seller, { text: `✅ @${m.sender.split('@')[0]} ha comprado a ${name} por ${waifuToBuy.price} exp.`, mentions: [m.sender] });
    m.reply(`✅ Has comprado a ${name} por ${waifuToBuy.price} exp.`);
  }

  if (command === 'personajes') {
    const waifuForSale = waifu.filter(w => w.forSale);

    if (waifuForSale.length === 0) return m.reply('⚠️ No hay personajes en venta.');

    let message = 'Personajes en venta:\n';
    waifuForSale.forEach(w => {
      message += `${w.name} - ${w.price} exp. (Vendido por @${w.seller.split('@')[0]})\n`;
    });

    m.reply(message, null, { mentions: waifuForSale.map(w => w.seller) });
  }
};

handler.command = ['vender', 'comprar', 'personajes'];
handler.help = ['vender', 'comprar', 'personajes'];
handler.tags = ['waifu'];

export default handler;