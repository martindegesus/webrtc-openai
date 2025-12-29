import './style.css'
import { setup } from './setup.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="card">
      <h1>WebRTC OpenAI Realtime API</h1>

      <div class="input-group">
        <input
          id="security-input"
          placeholder='Password'
        />

        <input
          id="ephemeral-key-input"
          placeholder="Paste ephemeral key"
        />

        <!-- Stylish textbox -->
        <textarea
          id="textbox"
        ></textarea>
      </div>

      <button id="connectedButton" disabled>You are not connected</button>
    </div>
`

const securityInput =
    document.querySelector<HTMLInputElement>('#security-input')!

const ephemeralKeyInput =
    document.querySelector<HTMLInputElement>('#ephemeral-key-input')!

const button =
    document.querySelector<HTMLButtonElement>('#connectedButton')!

const textbox =
    document.querySelector<HTMLAreaElement>('#textbox')!

let initialized = false

function tryInitialize() {
    const securityOk =
        securityInput.value.trim().toLowerCase() === 'security'

    const ephemeralKey =
        ephemeralKeyInput.value.trim()

    if (!initialized && securityOk && ephemeralKey.length > 0) {
        setup(button, textbox, ephemeralKey)
        button.disabled = false
        initialized = true
    }
}

securityInput.addEventListener('input', tryInitialize)
ephemeralKeyInput.addEventListener('input', tryInitialize)
