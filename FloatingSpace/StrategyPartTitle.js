
function newStrategyPartTitle () {
  const MODULE_NAME = 'Strategy Part Title'
  const ERROR_LOG = true

  const logger = newWebDebugLog()
  logger.fileName = MODULE_NAME

  let thisObject = {
    editMode: undefined,
    container: undefined,
    payload: undefined,
    physics: physics,
    draw: draw,
    getContainer: getContainer,
    finalize: finalize,
    initialize: initialize
  }

  thisObject.container = newContainer()
  thisObject.container.initialize(MODULE_NAME)
  thisObject.container.isClickeable = true
  thisObject.container.isDraggeable = false
  thisObject.container.frame.radius = 0

  let selfFocusEventSubscriptionId
  let selfNotFocuskEventSubscriptionId
  let selfMouseClickEventSubscriptionId

  return thisObject

  function finalize () {
    thisObject.container.eventHandler.stopListening(selfFocusEventSubscriptionId)
    thisObject.container.eventHandler.stopListening(selfNotFocuskEventSubscriptionId)
    thisObject.container.eventHandler.stopListening(selfMouseClickEventSubscriptionId)

    thisObject.container.finalize()
    thisObject.container = undefined
    thisObject.payload = undefined
  }

  function initialize (payload) {
    thisObject.payload = payload

    switch (payload.node.type) {
      case 'Strategy': {
        break
      }
      case 'Strategy Entry Event': {
        break
      }
      case 'Strategy Exit Event': {
        break
      }
      case 'Trade Entry Event': {
        break
      }
      case 'Stop': {
        break
      }
      case 'Take Profit': {
        break
      }
      case 'Phase': {
        break
      }
      case 'Situation': {
        break
      }
      case 'Condition': {
        break
      }
      default: {
        if (ERROR_LOG === true) { logger.write('[ERROR] initialize -> Part Type not Recognized -> type = ' + payload.node.type) }
      }
    }

    selfFocusEventSubscriptionId = thisObject.container.eventHandler.listenToEvent('onFocus', onFocus)
    selfNotFocuskEventSubscriptionId = thisObject.container.eventHandler.listenToEvent('onNotFocus', onNotFocus)
    selfMouseClickEventSubscriptionId = thisObject.container.eventHandler.listenToEvent('onMouseClick', onMouseClick)
  }

  function getContainer (point) {
    let container

    if (thisObject.container.frame.isThisPointHere(point, true) === true) {
      return thisObject.container
    } else {
      return undefined
    }
  }

  function physics () {
    let title = trimTitle(thisObject.payload.title)

    const FRAME_HEIGHT = 25
    const FRAME_WIDTH = title.length / 2 * thisObject.payload.floatingObject.currentFontSize * FONT_ASPECT_RATIO * 1.2 * 2
    thisObject.container.frame.position.x = 0 - FRAME_WIDTH / 2
    thisObject.container.frame.position.y = 0 - thisObject.container.frame.radius * 1 / 2 - thisObject.payload.floatingObject.currentFontSize * FONT_ASPECT_RATIO - 10 - FRAME_HEIGHT

    thisObject.container.frame.width = FRAME_WIDTH
    thisObject.container.frame.height = FRAME_HEIGHT
  }

  function onFocus () {
    thisObject.isOnFocus = true
  }

  function onNotFocus () {
    thisObject.isOnFocus = false
    exitEditMode()
  }

  function onMouseClick (event) {
    enterEditMode()
  }

  function exitEditMode () {
    if (thisObject.editMode === true) {
      thisObject.editMode = false
      let input = document.getElementById('input')
      input.style.display = 'none'
      thisObject.payload.title = input.value
      thisObject.payload.node.name = input.value
    }
  }

  function enterEditMode () {
    const WIDTH = thisObject.container.frame.width
    const HEIGHT = thisObject.container.frame.height
    let fontSize = thisObject.payload.floatingObject.currentFontSize

    let inputPosition = {
      x: 0,
      y: 0 + window.canvasApp.topMargin
    }

    inputPosition = thisObject.container.frame.frameThisPoint(inputPosition)
    if (inputPosition.y < window.canvasApp.topMargin) { return }

    thisObject.editMode = true
    let input = document.getElementById('input')
    input.value = thisObject.payload.title

    let backgroundColor = '0, 0, 0'
    if (thisObject.payload.uiObject.codeEditor !== undefined) {
      if (thisObject.payload.uiObject.codeEditor.visible === true) {
        backgroundColor = '204, 88, 53'
      }
    }

    input.style = 'resize: none; border: none; outline: none; box-shadow: none; overflow:hidden; font-family: Saira; font-size: ' + fontSize + 'px; background-color: rgb(' + backgroundColor + ');color:rgb(255, 255, 255); width: ' + WIDTH + 'px; height: ' + HEIGHT + 'px'
    input.style.display = 'block'
    input.focus()

    let inputDiv = document.getElementById('inputDiv')
    inputDiv.style = 'position:absolute; top:' + inputPosition.y + 'px; left:' + inputPosition.x + 'px; z-index:1; '
  }

  function draw () {
    if (thisObject.isOnFocus === true) {
      if (thisObject.payload.uiObject.codeEditor !== undefined) {
        if (thisObject.payload.uiObject.codeEditor.visible !== true) {
          drawTitleBackground()
        }
      } else {
        drawTitleBackground()
      }

      drawText()
    }
  }

  function drawTitleBackground () {
    let params = {
      cornerRadius: 3,
      lineWidth: 0.1,
      container: thisObject.container,
      borderColor: UI_COLOR.BLACK,
      backgroundColor: UI_COLOR.BLACK,
      castShadow: false,
      opacity: 0.25
    }

    roundedCornersBackground(params)
  }

  function drawText () {
    let radius = thisObject.container.frame.radius
    let labelPoint
    let fontSize = thisObject.payload.floatingObject.currentFontSize
    let label

    if (radius > 6 && thisObject.isOnFocus === true) {
      browserCanvasContext.strokeStyle = thisObject.payload.floatingObject.labelStrokeStyle

      browserCanvasContext.font = fontSize + 'px ' + UI_FONT.PRIMARY

      label = thisObject.payload.title

      if (label !== undefined) {
        label = trimTitle(label)

        labelPoint = {
          x: 0,
          y: thisObject.container.frame.height * 0.8
        }

        labelPoint = thisObject.container.frame.frameThisPoint(labelPoint)

        browserCanvasContext.font = fontSize + 'px ' + UI_FONT.PRIMARY
        browserCanvasContext.fillStyle = thisObject.payload.floatingObject.labelStrokeStyle
        browserCanvasContext.fillText(label, labelPoint.x, labelPoint.y)
      }
    }
  }

  function trimTitle (title) {
    const MAX_LABEL_LENGTH = 25
    if (title.length > MAX_LABEL_LENGTH) {
      title = title.substring(0, MAX_LABEL_LENGTH) + '...'
    }
    return title
  }
}
