import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { ImageGeneratorComponent } from './image-generator/image-generator.component'

const routes: Routes = [
  { path: '', redirectTo: '/image-generator', pathMatch: 'full' },
  { path: 'image-generator', component: ImageGeneratorComponent },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}