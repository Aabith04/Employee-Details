import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.css']
})
export class CustomerAddComponent implements OnChanges {
  @Input() editingCustomer: Customer | null = null;
  @Output() customerAdded = new EventEmitter<Customer>();
  @Output() customerUpdated = new EventEmitter<Customer>();

  customerForm: FormGroup;

  constructor(private fb: FormBuilder, private customerService: CustomerService) {
    this.customerForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      age: ['', Validators.required],
      designation: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editingCustomer'] && this.editingCustomer) {
      this.customerForm.patchValue(this.editingCustomer);
    }
  }

  onSubmit() {
    if (this.customerForm.invalid) return;

    const customerData: Customer = this.customerForm.value;

    if (this.editingCustomer) {
      // Update existing customer
      this.customerService.updateCustomer(customerData).subscribe({
        next: (updatedCustomer) => {
          this.customerUpdated.emit(updatedCustomer);
          this.customerForm.reset();
          this.editingCustomer = null;
        },
        error: (err) => console.error('❌ Update failed:', err)
      });
    } else {
      // Add new customer
      this.customerService.addCustomer(customerData).subscribe({
        next: (newCustomer) => {
          this.customerAdded.emit(newCustomer);
          this.customerForm.reset();
        },
        error: (err) => console.error('❌ Add failed:', err)
      });
    }
  }
}
