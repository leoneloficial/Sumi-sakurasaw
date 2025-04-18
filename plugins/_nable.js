const handler = async (m, { conn, usedPrefix, args, isOwner, isAdmin, isROwner }) => {
  if (!args[0] || !args[1]) {
    return conn.reply(m.chat, `Uso incorrecto.\nEjemplo: *${usedPrefix}true bienvenida* o *${usedPrefix}false antiprivado*`, m)
  }

  let enableText = args[0].toLowerCase()
  let type = args[1].toLowerCase()
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}

  let isEnable
  if (enableText === 'true') isEnable = true
  else if (enableText === 'false') isEnable = false
  else return conn.reply(m.chat, `El primer argumento debe ser *true* o *false*`, m)

  let isAll = false, isUser = false

  switch (type) {
    case 'welcome':
    case 'bienvenida':
      if (!m.isGroup) {
        if (!isOwner) return global.dfail('group', m, conn)
      } else if (!isAdmin) return global.dfail('admin', m, conn)
      chat.welcome = isEnable
      break  

    case 'antiprivado':
    case 'antiprivate':
      isAll = true
      if (!isOwner) return global.dfail('rowner', m, conn)
      bot.antiPrivate = isEnable
      break

    case 'restrict':
    case 'restringir':
      isAll = true
      if (!isOwner) return global.dfail('rowner', m, conn)
      bot.restrict = isEnable
      break

    case 'antibot':
    case 'antibots':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.antiBot = isEnable
      break

    case 'autoaceptar':
    case 'aceptarauto':
      if (!m.isGroup) {
        if (!isOwner) return global.dfail('group', m, conn)
      } else if (!isAdmin) return global.dfail('admin', m, conn)
      chat.autoAceptar = isEnable
      break

    case 'autorechazar':
    case 'rechazarauto':
      if (!m.isGroup) {
        if (!isOwner) return global.dfail('group', m, conn)
      } else if (!isAdmin) return global.dfail('admin', m, conn)
      chat.autoRechazar = isEnable
      break

    case 'autoresponder':
    case 'autorespond':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.autoresponder = isEnable
      break

    case 'antisubbots':
    case 'antibot2':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.antiBot2 = isEnable
      break

    case 'modoadmin':
    case 'soloadmin':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.modoadmin = isEnable
      break

    case 'reaction':
    case 'reaccion':
      if (!m.isGroup) {
        if (!isOwner) return global.dfail('group', m, conn)
      } else if (!isAdmin) return global.dfail('admin', m, conn)
      chat.reaction = isEnable
      break

    case 'nsfw':
    case 'modohorny':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.nsfw = isEnable
      break

    case 'jadibotmd':
    case 'modejadibot':
      isAll = true
      if (!isOwner) return global.dfail('rowner', m, conn)
      bot.jadibotmd = isEnable
      break

    case 'detect':
    case 'avisos':
      if (!m.isGroup) {
        if (!isOwner) return global.dfail('group', m, conn)
      } else if (!isAdmin) return global.dfail('admin', m, conn)
      chat.detect = isEnable
      break

    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.antiLink = isEnable
      break

    case 'antifake':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
      chat.antifake = isEnable
      break

    default:
      return conn.reply(m.chat, `No se reconoce la función *${type}*.`, m)
  }

  conn.reply(m.chat, `《✦》La función *${type}* se *${isEnable ? 'activó' : 'desactivó'}* ${isAll ? 'para este Bot' : isUser ? '' : 'para este chat'}`, m)
}