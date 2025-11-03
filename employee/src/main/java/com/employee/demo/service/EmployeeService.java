package com.employee.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.employee.demo.model.Employee;
import com.employee.demo.repository.EmployeeRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository repository;

    // ✅ Get all employees
    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    // ✅ Get employee by ID
    public ResponseEntity<Employee> getEmployeeById(Long id) {
        Optional<Employee> employee = repository.findById(id);
        return employee.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Add new employee
    public Employee addEmployee(Employee employee) {
        employee.setId(null); // ✅ force Hibernate to treat as INSERT
        return repository.save(employee);
    }


    // ✅ Update existing employee
    public ResponseEntity<Employee> updateEmployee(Long id, Employee updatedEmployee) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setName(updatedEmployee.getName());
                    existing.setAge(updatedEmployee.getAge());
                    existing.setDesignation(updatedEmployee.getDesignation());
                    existing.setAddress(updatedEmployee.getAddress());
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete employee
    public ResponseEntity<Void> deleteEmployee(Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
