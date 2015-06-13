import extend = require('xtend')
import videojs = require('video.js')

export default videojs

interface HotkeyOptions {
  volumeStep: number
  seekStep: number
  enableMute: boolean
  enableFullscreen: boolean
  enableNumbers: boolean
}

/**
 * Default hotkey options.
 */
const HOTKEY_OPTIONS: HotkeyOptions = {
  volumeStep: 0.1,
  seekStep: 5,
  enableMute: true,
  enableFullscreen: true,
  enableNumbers: true
}

/**
 * Interesting character codes.
 */
const SPACEBAR = 32
const LEFT_ARROW = 37
const RIGHT_ARROW = 39
const DOWN_ARROW = 40
const UP_ARROW = 38
const KEY_M = 77
const KEY_F = 70

/**
 * Enable hotkeys with video.js.
 *
 * https://github.com/ctd1500/videojs-hotkeys/blob/master/videojs.hotkeys.js
 */
function hotkeys (opts: any) {
  const player = this
  const playerEl = player.el()
  const options = <HotkeyOptions> extend(HOTKEY_OPTIONS, opts)

  // Set default player tabindex to handle keydown and doubleclick events.
  if (!player.el().hasAttribute('tabIndex')) {
    player.el().setAttribute('tabIndex', '-1')
  }

  /**
   * Check if it's a valid element toggle.
   */
  function canTogglePlayer (activeEl: Element) {
    return activeEl !== playerEl.querySelector('.vjs-control')
  }

  /**
   * Bring focus to the player on click (poster image, big play button, etc).
   */
  function click (e: any) {
    if (canTogglePlayer(document.activeElement)) {
      playerEl.focus()
    }
  }

  /**
   * Handle keypresses on the player.
   */
  function keydown (e: any) {
    if (!player.controls() || !canTogglePlayer(document.activeElement)) {
      return
    }

    const code = e.which

    switch (code) {
      case SPACEBAR:
        e.preventDefault()

        if (player.paused()) {
          player.play()
        } else {
          player.pause()
        }

        break

      case LEFT_ARROW:
        e.preventDefault()

        const newTime = Math.max(0, player.currentTime() - options.seekStep)

        player.currentTime(newTime)

        break

      case RIGHT_ARROW:
        e.preventDefault()

        player.currentTime(player.currentTime() + options.seekStep)

        break

      case DOWN_ARROW:
        e.preventDefault()

        player.volume(player.volume() - options.volumeStep)

        break

      case UP_ARROW:
        e.preventDefault()

        player.volume(player.volume() + options.volumeStep)

        break

      case KEY_M:
        if (options.enableMute) {
          player.muted(!player.muted())
        }

        break

      // Toggle Fullscreen with the F key
      case KEY_F:
        if (options.enableFullscreen) {
          if (player.isFullscreen()) {
            player.exitFullscreen()
          } else {
            player.requestFullscreen()
          }
        }

        break

      default:
        // Number keys from 0-9 skip to a percentage of the video. 0 is 0% and 9 is 90%
        if (options.enableNumbers && ((code > 47 && code < 59) || (code > 95 && code < 106))) {
          e.preventDefault()

          const step = code - (code > 95 ? 96 : 48)

          player.currentTime(player.duration() * step * 0.1)
        }
    }
  }

  /**
   * Handle double clicking the player.
   */
  function doubleClick (e: any) {
    const activeEl = e.relatedTarget || e.toElement || document.activeElement

    if (!canTogglePlayer(activeEl) || !options.enableFullscreen) {
      return
    }

    if (player.isFullscreen()) {
      player.exitFullscreen()
    } else {
      player.requestFullscreen()
    }
  }

  player.on('click', click)
  player.on('keydown', keydown)
  player.on('dblclick', doubleClick)

  return this
}

videojs.plugin('hotkeys', hotkeys)
