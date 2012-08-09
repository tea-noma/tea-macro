#:if ! (defined MODE)
#:define MODE DEBUG
#:endif
//
#:if ! (defined DEPLOYMENT)
#:define DEPLOYMENT CLIENTSIDE
#:endif
//
#:if (|| (== DEVICE IPHONE) (== DEVICE ANDROID))
  #:define SCREEN_SIZE  SMALL_SIZE
#:elseif (== DEVICE IPAD)
  #:define SCREEN_SIZE  NORMAL_SIZE
#:elseif (|| (== DEVICE WINDOWSPC) (== DEVICE LINUXPC) (== DEVICE MACPC))
  #:define SCREEN_SIZE  BIG_SIZE
#:else
  #:define SCREEN_SIZE  ANY_SIZE
#:endif
#:namespace teaos
