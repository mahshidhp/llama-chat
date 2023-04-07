export function getLastSeenStatus(lastSeen) {
  let status = ''
  if (!lastSeen) {
    status = 'last seen a long time ago'
  } else {
    lastSeen = lastSeen * 1000
    const date = new Date(lastSeen)
    const now = Date.now()
    if (now - lastSeen < 60000) {
      status = 'online'
    } else {
      status =
        'last seen ' +
        date.toLocaleTimeString([], {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
    }
  }
  return status
}
