ñimport { createHash } from 'crypto'
import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let isAll = false, isUser = false

  if (args.length < 2) {
    return conn.reply(m.chat, `Uso incorrecto.\nEjemplo:\n*${usedPrefix}true bienvenida*\n*${usedPrefix}false antilink*`, m)
  }

  const enableArg = args[0]?.toLowerCase()
  const type = args[1]?.toLowerCase()

  let isEnable
  if (['true', 'on', 'enable'].includes(enableArg)) isEnable = true
  else if (['false', 'off', 'disable'].includes(enableArg)) isEnable = false
  else return conn.reply(m.chat, `El primer argumento debe ser *true/false* o *on/off*`, m)

  let success = true

  switch (type) {
    case 'welcome':
    case 'bienvenida':
      if (!m.isGroup && !isOwner) success = false
      if (m.isGroup && !isAdmin) success = false
      if (success) chat.welcome = isEnable
      break

    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) success = false
      if (success) chat.antiLink = isEnable
      break

    case 'antiprivado':
    case 'antiprivate':
      if (!isOwner) success = false
      if (success) bot.antiPrivate = isEnable
      isAll = true
      break

    case 'restrict':
    case 'restringir':
      if (!isOwner) success = false
      if (success) bot.restrict = isEnable
      isAll = true
      break

    case 'antibot':
    case 'antibots':
      if (m.isGroup && !(isAdmin || isOwner)) success = false
      if (success) chat.antiBot = isEnable
      break

    case 'autoaceptar':
    case 'aceptarauto':
      if (!m.isGroup && !isOwner) success = false
      if (m.isGroup && !isAdmin) success = false
      if (success) chat.autoAceptar = isEnable
      break

    case 'autorechazar':
    case 'rechazarauto':
      if (!m.isGroup && !isOwner) success = false
      if (m.isGroup && !isAdmin) success = false
      if (success) chat.autoRechazar = isEnable
      break

    case 'autoresponder':
    case 'autorespond':
      if (m.isGroup && !(isAdmin || isOwner)) success = false
      if (success) chat.autoresponder = isEnable
      break

    case 'antisubbots':
    case 'antibot2':
      if (m.isGroup && !(isAdmin || isOwner)) success = false
      if (success) chat.antiBot2 = isEnable
      break

    case 'modoadmin':
    case 'soloadmin':
      if (m.isGroup && !(isAdmin || isOwner)) success = false
      if (success) chat.modoadmin = isEnable
      break

    case 'reaction':
    case 'reaccion':
      if (!m.isGroup && !isOwner) success = false
      if (m.isGroup && !isAdmin) success = false
      if (success) chat.reaction = isEnable
      break

    case 'nsfw':
    case 'modohorny':
      if (m.isGroup && !(isAdmin || isOwner)) success = false
      if (success) chat.nsfw = isEnable
      break

    case 'jadibotmd':
    case 'modejadibot':
      if (!isOwner) success = false
      if (success) bot.jadibotmd = isEnable
      isAll = true
      break

    case 'detect':
    case 'avisos':
      if (!m.isGroup && !isOwner) success = false
      if (m.isGroup && !isAdmin) success = false
      if (success) chat.detect = isEnable
      break

    case 'antifake':
      if (m.isGroup && !(isAdmin || isOwner)) success = false
      if (success) chat.antifake = isEnable
      break

    default:
      return conn.reply(m.chat, `La función *${type}* no está definida.`, m)
  }

  if (!success) {
    return conn.reply(m.chat, `No tienes permisos suficientes para modificar *${type}*.`, m)
  }

  return conn.reply(m.chat, `《✦》La función *${type}* se *${isEnable ? 'activó' : 'desactivó'}* ${isAll ? 'globalmente para el Bot' : 'en este chat'}`, m)
}

handler.help = ['true', 'false', 'on', 'off']
handler.tags = ['enable']
handler.command = /^(true|false|on|off)$/i

export default handler