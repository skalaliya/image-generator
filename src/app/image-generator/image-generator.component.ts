import { Component } from '@angular/core';
import * as fal from '@fal-ai/serverless-client';

interface GeneratedImage {
  url: string;
  prompt: string;
}

@Component({
  selector: 'ns-image-generator',
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css']
})
export class ImageGeneratorComponent {
  prompt: string = '';
  generatedImages: GeneratedImage[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor() {
    fal.config({
      credentials: 'ff3a5b06-5389-492c-a206-c71078d35466:51427b9d77185294f2a7a877cbecccab',
    });
  }

  async generateImage() {
    if (!this.prompt.trim()) {
      this.errorMessage = 'Please enter a prompt';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const result = await fal.subscribe('fal-ai/lora', {
        input: {
          model_name: 'stabilityai/stable-diffusion-xl-base-1.0',
          prompt: this.prompt,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      if (result.images && result.images.length > 0) {
        this.generatedImages.unshift({
          url: result.images[0].url,
          prompt: this.prompt
        });
      } else {
        this.errorMessage = 'No image generated';
      }
    } catch (error) {
      console.error('Error generating image:', error);
      this.errorMessage = 'Error generating image. Please try again.';
    } finally {
      this.isLoading = false;
      this.prompt = ''; // Clear the input after generating
    }
  }
}