<template>
  <div class="game-zone">
    <div class="game-header">
      <v-icon size="20" color="primary">mdi-gamepad-variant</v-icon>
      <span class="game-title">{{ gameTitle }}</span>
      <v-chip v-if="gameStarted" size="x-small" color="primary" variant="tonal" class="ml-auto">
        Score: {{ score }}
      </v-chip>
    </div>
    <div class="game-canvas-wrap">
      <canvas ref="gameCanvas" class="game-canvas" width="300" height="300" />
      <div v-if="!gameStarted" class="game-overlay" @click="startGame">
        <v-icon size="48" color="primary">mdi-play-circle</v-icon>
        <span>Click to play</span>
      </div>
      <div v-if="gameMessage" class="game-message" :class="gameMessageClass">
        {{ gameMessage }}
        <v-btn size="x-small" variant="tonal" color="primary" class="mt-2" @click="resetGame">
          Play Again
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const themeStore = useThemeStore()
const gameCanvas = ref<HTMLCanvasElement | null>(null)
const gameStarted = ref(false)
const score = ref(0)
const gameMessage = ref('')
const gameMessageClass = ref('')

const gameTitle = computed(() => {
  switch (themeStore.currentThemeSlug) {
    case 'retro': return 'Retro Racer'
    case 'nerd': return 'Memory Cards'
    case 'coding': return 'Code Chess'
    default: return 'Tic Tac Toe'
  }
})

let animId: number | null = null
let cleanupFn: (() => void) | null = null

function startGame() {
  gameStarted.value = true
  gameMessage.value = ''
  score.value = 0
  initGame()
}

function resetGame() {
  gameMessage.value = ''
  score.value = 0
  if (animId) cancelAnimationFrame(animId)
  initGame()
}

function initGame() {
  const canvas = gameCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Cleanup previous handlers
  if (cleanupFn) cleanupFn()
  canvas.onclick = null

  const theme = themeStore.currentThemeSlug
  if (theme === 'retro') initRetroRacer(ctx, canvas)
  else if (theme === 'nerd') initMemoryCards(ctx, canvas)
  else if (theme === 'coding') initCodeChess(ctx, canvas)
  else initTicTacToe(ctx, canvas)
}

function getPrimary(): string {
  const style = getComputedStyle(document.documentElement)
  return style.getPropertyValue('--v-theme-primary').trim() || '99,102,241'
}

// =================================================================
// TIC TAC TOE with win detection + smart AI
// =================================================================
function initTicTacToe(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const board: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  let currentPlayer = 1
  let gameOver = false

  function checkWinner(): { winner: number; line: number[][] } | null {
    // Rows
    for (let r = 0; r < 3; r++) {
      if (board[r][0] !== 0 && board[r][0] === board[r][1] && board[r][1] === board[r][2]) {
        return { winner: board[r][0], line: [[r, 0], [r, 1], [r, 2]] }
      }
    }
    // Columns
    for (let c = 0; c < 3; c++) {
      if (board[0][c] !== 0 && board[0][c] === board[1][c] && board[1][c] === board[2][c]) {
        return { winner: board[0][c], line: [[0, c], [1, c], [2, c]] }
      }
    }
    // Diagonals
    if (board[0][0] !== 0 && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return { winner: board[0][0], line: [[0, 0], [1, 1], [2, 2]] }
    }
    if (board[0][2] !== 0 && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return { winner: board[0][2], line: [[0, 2], [1, 1], [2, 0]] }
    }
    return null
  }

  function isDraw(): boolean {
    return board.every((row) => row.every((cell) => cell !== 0))
  }

  function drawBoard(winLine?: number[][]) {
    const primary = getPrimary()
    ctx.clearRect(0, 0, 300, 300)

    // Grid lines
    ctx.strokeStyle = `rgba(${primary}, 0.25)`
    ctx.lineWidth = 2
    for (let i = 1; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(i * 100, 10); ctx.lineTo(i * 100, 290); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(10, i * 100); ctx.lineTo(290, i * 100); ctx.stroke()
    }

    // Pieces
    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        const cx = x * 100 + 50
        const cy = y * 100 + 50
        if (cell === 1) {
          // X
          ctx.strokeStyle = `rgba(${primary}, 0.9)`
          ctx.lineWidth = 4
          ctx.lineCap = 'round'
          ctx.beginPath(); ctx.moveTo(cx - 25, cy - 25); ctx.lineTo(cx + 25, cy + 25); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(cx + 25, cy - 25); ctx.lineTo(cx - 25, cy + 25); ctx.stroke()
        }
        else if (cell === 2) {
          // O
          ctx.strokeStyle = `rgba(${primary}, 0.5)`
          ctx.lineWidth = 4
          ctx.lineCap = 'round'
          ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2); ctx.stroke()
        }
      })
    })

    // Draw winning line
    if (winLine) {
      const [start, , end] = winLine
      ctx.strokeStyle = `rgba(${primary}, 1)`
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.shadowColor = `rgba(${primary}, 0.6)`
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.moveTo(start[1] * 100 + 50, start[0] * 100 + 50)
      ctx.lineTo(end[1] * 100 + 50, end[0] * 100 + 50)
      ctx.stroke()
      ctx.shadowBlur = 0
    }
  }

  function aiMove() {
    if (gameOver) return
    // Try to win
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === 0) {
          board[r][c] = 2
          if (checkWinner()?.winner === 2) { finishMove(); return }
          board[r][c] = 0
        }
      }
    }
    // Try to block
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === 0) {
          board[r][c] = 1
          if (checkWinner()?.winner === 1) { board[r][c] = 2; finishMove(); return }
          board[r][c] = 0
        }
      }
    }
    // Take center or random
    if (board[1][1] === 0) { board[1][1] = 2; finishMove(); return }
    const empty: [number, number][] = []
    board.forEach((row, r) => row.forEach((cell, c) => { if (cell === 0) empty.push([r, c]) }))
    if (empty.length > 0) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)]
      board[r][c] = 2
      finishMove()
    }
  }

  function finishMove() {
    const result = checkWinner()
    if (result) {
      gameOver = true
      drawBoard(result.line)
      if (result.winner === 1) {
        score.value += 10
        gameMessage.value = '🎉 You Win!'
        gameMessageClass.value = 'win'
      }
      else {
        gameMessage.value = '🤖 AI Wins!'
        gameMessageClass.value = 'lose'
      }
      return
    }
    if (isDraw()) {
      gameOver = true
      drawBoard()
      gameMessage.value = '🤝 Draw!'
      gameMessageClass.value = 'draw'
      return
    }
    drawBoard()
    currentPlayer = currentPlayer === 1 ? 2 : 1
  }

  canvas.onclick = (e) => {
    if (gameOver || currentPlayer !== 1) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX / 100)
    const y = Math.floor((e.clientY - rect.top) * scaleY / 100)
    if (x >= 0 && x < 3 && y >= 0 && y < 3 && board[y][x] === 0) {
      board[y][x] = 1
      const result = checkWinner()
      if (result) { gameOver = true; drawBoard(result.line); score.value += 10; gameMessage.value = '🎉 You Win!'; gameMessageClass.value = 'win'; return }
      if (isDraw()) { gameOver = true; drawBoard(); gameMessage.value = '🤝 Draw!'; gameMessageClass.value = 'draw'; return }
      currentPlayer = 2
      drawBoard()
      setTimeout(() => aiMove(), 400)
    }
  }

  drawBoard()
  cleanupFn = () => { canvas.onclick = null }
}

// =================================================================
// RETRO RACER - car moves up/down, obstacles come from right to left
// =================================================================
function initRetroRacer(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  let carY = 150
  let obstacles: Array<{ x: number; y: number; speed: number; w: number }> = []
  let frame = 0
  let gameOver = false

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'ArrowUp' && carY > 20) carY -= 15
    if (e.key === 'ArrowDown' && carY < 260) carY += 15
  }
  document.addEventListener('keydown', handleKey)

  canvas.onmousemove = (e) => {
    if (gameOver) return
    const rect = canvas.getBoundingClientRect()
    const scaleY = canvas.height / rect.height
    carY = Math.max(20, Math.min(270, (e.clientY - rect.top) * scaleY))
  }

  function loop() {
    if (gameOver) return

    // Background - road going left
    ctx.fillStyle = '#3E2723'
    ctx.fillRect(0, 0, 300, 300)

    // Road lanes
    ctx.fillStyle = '#5D4037'
    ctx.fillRect(0, 30, 300, 240)

    // Lane dashes moving left
    frame++
    ctx.fillStyle = '#F5E6D3'
    for (let lane = 0; lane < 3; lane++) {
      for (let i = 0; i < 8; i++) {
        const x = ((i * 50 - frame * 2) % 400 + 400) % 400 - 50
        ctx.fillRect(x, 90 + lane * 60, 25, 3)
      }
    }

    // Car (on the left side)
    ctx.fillStyle = '#8B4513'
    ctx.fillRect(30, carY - 10, 35, 20)
    ctx.fillStyle = '#CD853F'
    ctx.fillRect(55, carY - 6, 10, 12)

    // Spawn obstacles from the right, moving left
    if (frame % 40 === 0) {
      obstacles.push({
        x: 310,
        y: 40 + Math.random() * 220,
        speed: 2 + Math.random() * 2,
        w: 15 + Math.random() * 15,
      })
    }

    obstacles = obstacles.filter((o) => o.x > -30)
    obstacles.forEach((o) => {
      o.x -= o.speed
      ctx.fillStyle = '#CD853F'
      ctx.fillRect(o.x, o.y - 8, o.w, 16)
      // Collision
      if (o.x < 65 && o.x + o.w > 30 && Math.abs(o.y - carY) < 18) {
        gameOver = true
        score.value = frame
        gameMessage.value = `💥 Crashed! Score: ${frame}`
        gameMessageClass.value = 'lose'
      }
    })

    // Score display
    ctx.fillStyle = '#F5E6D3'
    ctx.font = 'bold 12px monospace'
    ctx.fillText(`Distance: ${frame}`, 200, 20)

    score.value = frame
    if (!gameOver) animId = requestAnimationFrame(loop)
  }

  loop()
  cleanupFn = () => {
    document.removeEventListener('keydown', handleKey)
    canvas.onmousemove = null
    canvas.onclick = null
  }
}

// =================================================================
// MEMORY CARDS (nerd theme)
// =================================================================
function initMemoryCards(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const symbols = ['♠', '♥', '♦', '♣', '★', '◆', '♠', '♥', '♦', '♣', '★', '◆']
  const shuffled = [...symbols].sort(() => Math.random() - 0.5)
  const revealed: boolean[] = new Array(12).fill(false)
  const matched: boolean[] = new Array(12).fill(false)
  let firstPick = -1
  let locked = false
  let moves = 0

  function draw() {
    const primary = getPrimary()
    ctx.clearRect(0, 0, 300, 300)

    for (let i = 0; i < 12; i++) {
      const col = i % 4
      const row = Math.floor(i / 4)
      const x = col * 70 + 15
      const y = row * 90 + 15

      if (matched[i]) ctx.fillStyle = `rgba(${primary}, 0.2)`
      else if (revealed[i]) ctx.fillStyle = `rgba(${primary}, 0.12)`
      else ctx.fillStyle = `rgba(${primary}, 0.04)`

      ctx.strokeStyle = `rgba(${primary}, 0.3)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(x, y, 60, 80, 6)
      ctx.fill()
      ctx.stroke()

      if (revealed[i] || matched[i]) {
        ctx.fillStyle = `rgba(${primary}, 0.9)`
        ctx.font = '24px serif'
        ctx.textAlign = 'center'
        ctx.fillText(shuffled[i], x + 30, y + 48)
      }
      else {
        ctx.fillStyle = `rgba(${primary}, 0.25)`
        ctx.font = '18px serif'
        ctx.textAlign = 'center'
        ctx.fillText('?', x + 30, y + 48)
      }
    }
  }

  canvas.onclick = (e) => {
    if (locked) return
    const rect = canvas.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width)
    const my = (e.clientY - rect.top) * (canvas.height / rect.height)

    for (let i = 0; i < 12; i++) {
      const col = i % 4
      const row = Math.floor(i / 4)
      const x = col * 70 + 15
      const y = row * 90 + 15
      if (mx >= x && mx <= x + 60 && my >= y && my <= y + 80 && !revealed[i] && !matched[i]) {
        revealed[i] = true
        draw()
        moves++

        if (firstPick === -1) {
          firstPick = i
        }
        else {
          locked = true
          const fp = firstPick
          if (shuffled[fp] === shuffled[i]) {
            matched[fp] = true
            matched[i] = true
            score.value += 10
            firstPick = -1
            locked = false
            // Check win
            if (matched.every(Boolean)) {
              gameMessage.value = `🎉 Won in ${moves} moves!`
              gameMessageClass.value = 'win'
            }
          }
          else {
            setTimeout(() => {
              revealed[fp] = false
              revealed[i] = false
              firstPick = -1
              locked = false
              draw()
            }, 800)
          }
        }
        break
      }
    }
  }

  draw()
  cleanupFn = () => { canvas.onclick = null }
}

// =================================================================
// CODE CHESS - simplified knight's tour puzzle
// =================================================================
function initCodeChess(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const SIZE = 6
  const CELL = 50
  const visited: boolean[][] = Array.from({ length: SIZE }, () => new Array(SIZE).fill(false))
  let knightR = 0
  let knightC = 0
  visited[0][0] = true
  let moveCount = 1

  const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]

  function getValidMoves(r: number, c: number): [number, number][] {
    return knightMoves
      .map(([dr, dc]) => [r + dr, c + dc] as [number, number])
      .filter(([nr, nc]) => nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !visited[nr][nc])
  }

  function draw() {
    const primary = getPrimary()
    ctx.clearRect(0, 0, 300, 300)

    // Board
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const x = c * CELL
        const y = r * CELL
        const isLight = (r + c) % 2 === 0

        if (visited[r][c]) {
          ctx.fillStyle = `rgba(${primary}, 0.15)`
        }
        else {
          ctx.fillStyle = isLight ? `rgba(${primary}, 0.03)` : `rgba(${primary}, 0.08)`
        }
        ctx.fillRect(x, y, CELL, CELL)
        ctx.strokeStyle = `rgba(${primary}, 0.1)`
        ctx.strokeRect(x, y, CELL, CELL)
      }
    }

    // Valid moves highlight
    const validMoves = getValidMoves(knightR, knightC)
    validMoves.forEach(([r, c]) => {
      ctx.fillStyle = `rgba(${primary}, 0.2)`
      ctx.beginPath()
      ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 8, 0, Math.PI * 2)
      ctx.fill()
    })

    // Knight
    ctx.font = '28px serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = `rgba(${primary}, 0.9)`
    ctx.fillText('♞', knightC * CELL + CELL / 2, knightR * CELL + CELL / 2 + 10)

    // Move count
    ctx.font = 'bold 11px monospace'
    ctx.fillStyle = `rgba(${primary}, 0.6)`
    ctx.textAlign = 'left'
    ctx.fillText(`Moves: ${moveCount}/${SIZE * SIZE}`, 5, 295)
  }

  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width)
    const my = (e.clientY - rect.top) * (canvas.height / rect.height)
    const clickC = Math.floor(mx / CELL)
    const clickR = Math.floor(my / CELL)

    const validMoves = getValidMoves(knightR, knightC)
    const isValid = validMoves.some(([r, c]) => r === clickR && c === clickC)

    if (isValid) {
      knightR = clickR
      knightC = clickC
      visited[knightR][knightC] = true
      moveCount++
      score.value = moveCount

      draw()

      // Check win
      if (moveCount === SIZE * SIZE) {
        gameMessage.value = `🏆 Knight's Tour Complete!`
        gameMessageClass.value = 'win'
        return
      }

      // Check stuck
      if (getValidMoves(knightR, knightC).length === 0) {
        gameMessage.value = `🛑 Stuck at ${moveCount} moves!`
        gameMessageClass.value = 'lose'
      }
    }
  }

  draw()
  cleanupFn = () => { canvas.onclick = null }
}

watch(() => themeStore.currentThemeSlug, () => {
  if (gameStarted.value) {
    if (animId) cancelAnimationFrame(animId)
    gameMessage.value = ''
    score.value = 0
    initGame()
  }
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  if (cleanupFn) cleanupFn()
})
</script>

<style scoped>
.game-zone {
  background: rgb(var(--v-theme-surface), 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgb(var(--v-theme-primary), 0.2);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.game-title {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.game-canvas-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
  background: rgb(var(--v-theme-on-surface), 0.03);
}

.game-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.game-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgb(var(--v-theme-surface), 0.7);
  backdrop-filter: blur(6px);
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface), 0.7);
}

.game-overlay:hover {
  background: rgb(var(--v-theme-surface), 0.5);
}

.game-message {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-surface), 0.85);
  backdrop-filter: blur(8px);
  font-size: 1.1rem;
  font-weight: 800;
  font-family: var(--font-heading);
  animation: msg-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.game-message.win { color: #10b981; }
.game-message.lose { color: #ef4444; }
.game-message.draw { color: rgb(var(--v-theme-primary)); }

@keyframes msg-pop {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
