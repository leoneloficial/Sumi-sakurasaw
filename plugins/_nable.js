import { createHash } from 'crypto' 
import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let isAll = false, isUser = false

  // Verifica si faltan argumentos
  if (!args[0] || !args[1]) {
    return conn.reply(m.chat, `Uso incorrecto.\nEjemplo:\n*${usedPrefix}true bienvenida*\n*${usedPrefix}false antilink*`, m)
  }

  const enableArg = args[0].toLowerCase()
  const type = args[1].toLowerCase()

  let isEnable
  if (['true', 'on', 'enable'].includes(enableArg)) isEnable = true
  else if (['false', 'off', 'disable'].includes(enableArg)) isEnable = false
  else return conn.reply(m.chat, `El primer argumento debe ser *true/false* o *on/off*`, m)

  let success = false

  switch (type) {
    case 'welcome':
    case 'bienvenida':
      if (!m.isGroup && !isOwner) return global.dfail('group', m, conn)
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.welcome = isEnable
      success = true
      break  

    case 'antiprivado':
    case 'antiprivate':
      if (!isOwner) return global.dfail('rowner', m, conn)
      bot.antiPrivate = isEnable
      isAll = true
      success = true
      break

    case 'restrict':
    case 'restringir':
      if (!isOwner) return global.dfail('rowner', m, conn)
      bot.restrict = isEnable
      isAll = true
      success = true
      break

    case 'antibot':
    case 'antibots':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.antiBot = isEnable
      success = true
      break

    case 'autoaceptar':
    case 'aceptarauto':
      if (!m.isGroup && !isOwner) return global.dfail('group', m, conn)
      if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn)
      chat.autoAceptar = isEnable
      success = true
      break

    case 'autorechazar':
    case 'rechazarauto':
      if (!m.isGroup && !isOwner) return global.dfail('group', m, conn)
      if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn)
      chat.autoRechazar = isEnable
      success = true
      break

    case 'autoresponder':
    case 'autorespond':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.autoresponder = isEnable
      success = true
      break

    case 'antisubbots':
    case 'antibot2':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.antiBot2 = isEnable
      success = true
      break

    case 'modoadmin':
    case 'soloadmin':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.modoadmin = isEnable
      success = true
      break

    case 'reaction':
    case 'reaccion':
      if (!m.isGroup && !isOwner) return global.dfail('group', m, conn)
      if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn)
      chat.reaction = isEnable
      success = true
      break

    case 'nsfw':
    case 'modohorny':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.nsfw = isEnable
      success = true
      break

    case 'jadibotmd':
    case 'modejadibot':
      if (!isOwner) return global.dfail('rowner', m, conn)
      bot.jadibotmd = isEnable
      isAll = true
      success = true
      break

    case 'detect':
    case 'avisos':
      if (!m.isGroup && !isOwner) return global.dfail('group', m, conn)
      if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn)
      chat.detect = isEnable
      success = true
      break

    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.antiLink = isEnable
      success = true
      break

    case 'antifake':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.antifake = isEnable
      success = true
      break

    default:
      return conn.reply(m.chat, `La función *${type}* no está definida.`, m)
  }

  // Si la función fue aplicada correctamente
  if (success) {
    return conn.reply(m.chat, `《✦》La función *${type}* se *${isEnable ? 'activó' : 'desactivó'}* ${isAll ? 'para este Bot' : 'para este chat'}`, m)
  }

  // En caso de que no se haya activado/desactivado correctamente
  return conn.reply(m.chat, `Uso incorrecto.\nEjemplo:\n*${usedPrefix}true bienvenida*\n*${usedPrefix}false antilink*`, m)
}

// Aquí modificamos la expresión regular para que coincida más adecuadamente con los comandos.
handler.help = ['true', 'false', 'on', 'off']
handler.tags = ['nable']
handler.command = /^(true|false|on|off)\s+(welcome|bienvenida|antiprivado|antiprivate|restrict|restringir|antibot|autoaceptar|aceptarauto|autorechazar|rechazarauto|autoresponder|antisubbots|antibot2|modoadmin|soloadmin|reaction|reaccion|nsfw|modohorny|jadibotmd|modejadibot|detect|avisos|antilink|antifake)$/i

export default handler