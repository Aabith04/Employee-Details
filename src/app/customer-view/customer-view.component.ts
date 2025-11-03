import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent {
  // 👇 This allows parent (AppComponent) to pass customers
  @Input() customers: Customer[] = [];

  // 👇 These allow child to send events back to parent
  @Output() customerAdded = new EventEmitter<Customer>();
  @Output() customerUpdated = new EventEmitter<Customer>();
  @Output() deleteCustomer = new EventEmitter<number>();

  editingCustomer: Customer | null = null;
  loading: boolean = false;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  // ✅ Fetch all customers from backend
  loadCustomers() {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching customers:', err);
        this.loading = false;
      }
    });
  }

  // ✅ Edit handler
  @Output() editCustomer = new EventEmitter<Customer>(); // 👈 Add this at top

onEdit(customer: Customer) {
  this.editCustomer.emit(customer); // 👈 Send the selected customer to AppComponent
}

  // ✅ Delete handler (emits ID to parent)
  onDelete(id?: number) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          console.log('✅ Deleted successfully');
          this.deleteCustomer.emit(id); // 🔹 Notify parent
          this.loadCustomers();
        },
        error: (err) => console.error('❌ Delete failed:', err)
      });
    }
  }

  // ✅ After Add
  onCustomerAdded(newCustomer: Customer) {
    console.log('✅ Added:', newCustomer);
    this.customerAdded.emit(newCustomer); // 🔹 Notify parent
    this.loadCustomers();
  }

  // ✅ After Update
  onCustomerUpdated(updatedCustomer: Customer) {
    console.log('✅ Updated:', updatedCustomer);
    this.customerUpdated.emit(updatedCustomer); // 🔹 Notify parent
    this.loadCustomers();
    this.editingCustomer = null;
  }
}
