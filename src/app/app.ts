import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  rsvpForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.rsvpForm = this.fb.group({
      attending: [true, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      additionalGuests: this.fb.array([])
    });

    // Subscribe to attending changes to handle validation
    this.rsvpForm.get('attending')?.valueChanges.subscribe((isAttending: boolean) => {
      if (!isAttending) {
        this.additionalGuests.clear();
        this.rsvpForm.get('phone')?.clearValidators();
        this.rsvpForm.get('phone')?.updateValueAndValidity();
      } else {
        this.rsvpForm.get('phone')?.setValidators([Validators.required]);
        this.rsvpForm.get('phone')?.updateValueAndValidity();
      }
    });
  }

  get additionalGuests(): FormArray {
    return this.rsvpForm.get('additionalGuests') as FormArray;
  }

  addGuest(type: 'plusOne' | 'kid') {
    const guestGroup = this.fb.group({
      type: [type],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: [null, type === 'kid' ? [Validators.required, Validators.min(0)] : []]
    });
    this.additionalGuests.push(guestGroup);
  }

  removeGuest(index: number) {
    this.additionalGuests.removeAt(index);
  }

  onSubmit() {
    if (this.rsvpForm.valid) {
      this.submitted = true;
      console.log('Form Submitted', this.rsvpForm.value);
    } else {
      this.rsvpForm.markAllAsTouched();
    }
  }
}
