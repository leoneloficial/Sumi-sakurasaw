import { createHash } from 'crypto'
import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let isAll = false, isUser = false

  if (!args[0] || !args[1]) {
    return conn.reply(m.chat, `Uso incorrecto.\nEjemplo:\n*${usedPrefix}true bienvenida*\n*${usedPrefix}false antilink*`, m)
  }

  const enableArg = args[0].toLowerCase()
  const type = args[1].toLowerCase()

  let isEnable
  if (['true', 'on', 'enable'].includes(enableArg)) isEnable = true
  else if (['false', 'off', 'disable'].includes(enableArg)) isEnable = false
  else return conn.reply(m.chat, `El primer argumento debe ser *true/false* o *on/off*`, m)

  switch (type) {
    case 'welcome':
    case 'bienvenida':
      if (!m.isGroup && !isOwner) {
        global.dfail('group', m, conn)
        throw false
      } else if (m.isGroup && !isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.welcome = isEnable
      break  

    case 'antiprivado':
    case 'antiprivate':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.antiPrivate = isEnable
      break

    case 'restrict':
    case 'restringir':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.restrict = isEnable
      break

    case 'antibot':
    case 'antibots':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.antiBot = isEnable
      break

    case 'autoaceptar':
    case 'aceptarauto':
      if (!m.isGroup && !isOwner) {
        global.dfail('group', m, conn)
        throw false
      } else if (m.isGroup && !isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.autoAceptar = isEnable
      break

    case 'autorechazar':
    case 'rechazarauto':
      if (!m.isGroup && !isOwner) {
        global.dfail('group', m, conn)
        throw false
      } else if (m.isGroup && !isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.autoRechazar = isEnable
      break

    case 'autoresponder':
    case 'autorespond':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.autoresponder = isEnable
      break

    case 'antisubbots':
    case 'antibot2':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.antiBot2 = isEnable
      break

    case 'modoadmin':
    case 'soloadmin':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.modoadmin = isEnable
      break

    case 'reaction':
    case 'reaccion':
      if (!m.isGroup && !isOwner) {
        global.dfail('group', m, conn)
        throw false
      } else if (m.isGroup && !isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.reaction = isEnable
      break

    case 'nsfw':
    case 'modohorny':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.nsfw = isEnable
      break

    case 'jadibotmd':
    case 'modejadibot':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.jadibotmd = isEnable
      break

    case 'detect':
    case 'avisos':
      if (!m.isGroup && !isOwner) {
        global.dfail('group', m, conn)
        throw false
      } else if (m.isGroup && !isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.detect = isEnable
      break

    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.antiLink = isEnable
      break

    case 'antifake':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.antifake = isEnable
      break

    default:
      return conn.reply(m.chat, `La función *${type}* no está definida.`, m)
  }

  conn.reply(m.chat, `《✦》La función *${type}* se *${isEnable ? 'activó' : 'desactivó'}* ${isAll ? 'para el Bot globalmente' : 'en este chat'}`, m)
}

handler.help = ['true', 'false', 'on', 'off']
handler.tags = ['enable']
handler.command = /^(true|false|on|off)$/i

export default handler