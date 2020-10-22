import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
const material = [
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule
];
@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule {}
