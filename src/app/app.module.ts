import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'
import { NativeScriptFormsModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ImageGeneratorComponent } from './image-generator/image-generator.component'

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, NativeScriptFormsModule, AppRoutingModule],
  declarations: [AppComponent, ImageGeneratorComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}