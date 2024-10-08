import React, { useState } from 'react';
import * as fal from '@fal-ai/serverless-client';

fal.config({
  credentials: 'ff3a5b06-5389-492c-a206-c71078d35466:51427b9d77185294f2a7a877cbecccab',
});

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await fal.subscribe('fal-ai/lora', {
        input: {
          model_name: 'stabilityai/stable-diffusion-xl-base-1.0',
          prompt: prompt,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      if (result.images && result.images.length > 0) {
        setGeneratedImage(result.images[0].url);
      } else {
        setError('No image generated');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Error generating image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Any Image Generator</h1>
      <div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here"
          rows={4}
          cols={50}
        />
      </div>
      <div>
        <button onClick={generateImage} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {generatedImage && (
        <div>
          <h2>Generated Image:</h2>
          <img src={generatedImage} alt="Generated" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
}

export default App;