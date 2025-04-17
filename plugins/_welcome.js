import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://files.catbox.moe/2bso68.jpg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  let txt = '❀⃝⵿ᩙ ✿ꨩ꯭੭៹ New Member ៹◞ゲ'
  let txt1 = '❀⃝⵿ᩙ ✿ꨩ꯭੭៹ Bye Member ៹◞ゲ'
  let groupSize = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `❀ *Bienvenido* a ${groupMetadata.subject}\n✰ @${m.messageStubParameters[0].split`@`[0]}\n${global.welcom1}\n✦ Ahora somos ${groupSize} Miembros.\n•(=^●ω●^=)• Disfruta tu estadía en el grupo!\n> ✐ Puedes usar *#help* para ver la lista de comandos.
> 🜸 https://bit.ly/sumioficial.`    
    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak)
  }
  
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `❀ *Adiós* de ${groupMetadata.subject}\n✰ @${m.messageStubParameters[0].split`@`[0]}\n${global.welcom2}\n✦ Ahora somos ${groupSize} Miembros.\n•(=^●ω●^=)• Te esperamos pronto!\n> ✐ Puedes usar *#help* para ver la lista de comandos.
> 🜸 https://bit.ly/sumioficial.`
    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, fkontak)
  }}
