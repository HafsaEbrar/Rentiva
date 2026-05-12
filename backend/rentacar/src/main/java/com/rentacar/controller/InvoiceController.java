package com.rentacar.controller;

import com.rentacar.entity.Invoice;
import com.rentacar.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;

    @GetMapping("/{id}")
    public Invoice getInvoiceById(
            @PathVariable Long id
    ){
        return invoiceRepository
                .findById(id)
                .orElse(null);
    }
}