package com.rentacar.service;

import com.rentacar.entity.Invoice;
import com.rentacar.entity.Payment;
import com.rentacar.repository.InvoiceRepository;
import com.rentacar.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    public Payment savePayment(Payment payment) {

        Payment savedPayment =
                paymentRepository.save(payment);

        Invoice invoice = new Invoice();

        invoice.setPayment(savedPayment);

        invoice.setInvoiceDate(LocalDate.now());

        invoice.setInvoiceAmount(
                savedPayment.getAmount()
        );

        invoice.setInvoiceStatus("CREATED");

        invoice.setInvoiceNo(
                "INV-" +
                UUID.randomUUID()
                .toString()
                .substring(0,8)
                .toUpperCase()
        );

        invoiceRepository.save(invoice);

        return savedPayment;
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}