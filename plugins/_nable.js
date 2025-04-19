const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin }) => {
  let chat = global.db.data.chats[m.chat]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let isAll = false

  if (!args[0] || !args[1]) {
    return conn.reply(m.chat, `Uso incorrecto.\nEjemplo:\n${usedPrefix}true bienvenida\n${usedPrefix}false antilink`, m)
  }

  const enableArg = args[0].toLowerCase()
  const type = args[1].toLowerCase()

  let isEnable
  if (['true', 'on', 'enable'].includes(enableArg)) isEnable = true
  else if (['false', 'off', 'disable'].includes(enableArg)) isEnable = false
  else return conn.reply(m.chat, `El primer argumento debe ser *true/false* o *on/off*`, m)

  switch (type) {
    case 'bienvenida':
    case 'welcome':
      if (!m.isGroup || !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.welcome = isEnable
      break

    case 'antilink':
      if (!m.isGroup || !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.antiLink = isEnable
      break

    case 'antiprivado':
    case 'antiprivate':
      if (!isOwner) return global.dfail('rowner', m, conn)
      isAll = true
      bot.antiPrivate = isEnable
      break

    case 'restrict':
    case 'restringir':
      if (!isOwner) return global.dfail('rowner', m, conn)
      isAll = true
      bot.restrict = isEnable
      break

    case 'antibot':
    case 'antibots':
      if (!m.isGroup || !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.antiBot = isEnable
      break

    case 'autoaceptar':
    case 'aceptarauto':
      if (!m.isGroup || !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.autoAceptar = isEnable
      break

    case 'autorechazar':
    case 'rechazarauto':
      if (!m.isGroup || !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.autoRechazar = isEnable
      break

    case 'autoresponder':
    case 'autorespond':
      if (!m.isGroup || !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.autoresponder = isEnable
      break

    case 'antisubbots':
    case 'antibot2':
      if (!m.isGroup || !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.antiBot2 = isEnable
      break

    case 'modoadmin':
    case 'soloadmin':
      if (!m.isGroup || !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.modoadmin = isEnable
      break

    case 'reaction':
    case 'reaccion':
      if (!m.isGroup || !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.reaction = isEnable
      break

    case 'nsfw':
    case 'modohorny':
      if (!m.isGroup || !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.nsfw = isEnable
      break

    case 'jadibotmd':
    case 'modejadibot':
      if (!isOwner) return global.dfail('rowner', m, conn)
      isAll = true
      bot.jadibotmd = isEnable
      break

    case 'detect':
    case 'avisos':
      if (!m.isGroup || !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.detect = isEnable
      break

    case 'antifake':
      if (!m.isGroup || !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.antifake = isEnable
      break

    default:
      return conn.reply(m.chat, `La función *${type}* no está definida.`, m)
  }

  return conn.reply(
    m.chat,
    `《✦》La función *${type}* fue *${isEnable ? 'activada' : 'desactivada'}* correctamente ${isAll ? 'para el bot' : 'en este grupo'}.`,
    m
  )
}

handler.command = /^(true|false|on|off)$/i

export default handler