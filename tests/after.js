// #teaos:if ! (defined MODE)
// #teaos:define MODE DEBUG
// #teaos:endif
//
// #teaos:if ! (defined DEPLOYMENT)
// #teaos:define DEPLOYMENT CLIENTSIDE
// #teaos:endif
//
// #teaos:if (|| (== DEVICE IPHONE) (== DEVICE ANDROID))
//   #teaos:define SCREEN_SIZE  SMALL_SIZE
// #teaos:elseif (== DEVICE IPAD)
//   #teaos:define SCREEN_SIZE  NORMAL_SIZE
// #teaos:elseif (|| (== DEVICE WINDOWSPC) (== DEVICE LINUXPC) (== DEVICE MACPC))
//   #teaos:define SCREEN_SIZE  BIG_SIZE
// #teaos:else
//   #teaos:define SCREEN_SIZE  ANY_SIZE
// #teaos:endif
