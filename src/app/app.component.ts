import { Component, OnInit } from '@angular/core';
import { Customer } from './models/customer';
import { CustomerAddComponent } from './customer-add/customer-add.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerService } from './services/customer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CustomerAddComponent, CustomerViewComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  customers: Customer[] = [];
  editingCustomer: Customer | null = null;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => this.customers = data,
      error: (err) => console.error('❌ Error loading customers:', err)
    });
  }

  getCustomer(customer: Customer) {
    this.customers.push(customer);
  }

  updateCustomer(customer: Customer) {
    this.customerService.updateCustomer(customer).subscribe({
      next: (updatedCustomer) => {
        const index = this.customers.findIndex(c => c.id === updatedCustomer.id);
        if (index !== -1) {
          this.customers[index] = updatedCustomer;
        }
        this.editingCustomer = null;
        console.log('✅ Customer updated successfully:', updatedCustomer);
      },
      error: (err) => console.error('❌ Error updating customer:', err)
    });
  }

  editCustomerFromView(customer: Customer) {
    this.editingCustomer = { ...customer }; // prefill the form
  }

  deleteCustomerFromView(id: number) {
    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        this.customers = this.customers.filter(c => c.id !== id);
        console.log('🗑️ Customer deleted:', id);
      },
      error: (err) => console.error('❌ Error deleting customer:', err)
    });
  }
}
