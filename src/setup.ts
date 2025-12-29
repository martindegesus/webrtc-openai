import {
  RealtimeAgent,
  RealtimeSession,
} from '@openai/agents/realtime';

export async function setup(connectedButton: HTMLButtonElement, textArea:HTMLAreaElement,ephemeralKey: string) {

  const agent = new RealtimeAgent({
    name: 'Greeter',
    instructions: 'Greet the user with cheer and answer questions.',
  });

  const session = new RealtimeSession(agent, {
    model: 'gpt-realtime',
    config: {
      inputAudioFormat: 'pcm16',
      outputAudioFormat: 'pcm16',
      inputAudioTranscription: {
        model: 'gpt-4o-mini-transcribe',
      },
    },
  });
  const audioCtx = new AudioContext({ sampleRate: 24000 });
  session.on("audio", (event: any) => {
    const pcm16 = new Int16Array(event.data);
    const float32 = new Float32Array(pcm16.length);

    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768;
    }

    const buffer = audioCtx.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
  });

  try {
    await session.connect({
      // To get this ephemeral key string, you can run the following command or implement the equivalent on the server side:
      // curl -s -X POST https://api.openai.com/v1/realtime/client_secrets -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" -d '{"session": {"type": "realtime", "model": "gpt-realtime"}}' | jq .value
      apiKey: ephemeralKey,
    });
    connectedButton.innerHTML = "You are Connected"
    session.on('history_updated', (history) => {
      const last = history.at(-1);

      if (last?.content?.[0]?.transcript) {
        textArea.innerHTML = last.content[0].transcript
      }
    });
    await audioCtx.resume();
  } catch (e) {
    if (e instanceof Error) {
      textArea.innerHTML = e.message;
    } else {
      textArea.innerHTML = String(e);
    }
  }
}
