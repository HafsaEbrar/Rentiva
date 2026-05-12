package com.rentacar.service;

import com.rentacar.entity.Company;
import com.rentacar.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
    }

    @Transactional
    public Company saveCompany(Company company) {
        if (company == null) {
            throw new RuntimeException("Company cannot be null");
        }

        if (companyRepository.existsByCompanyName(company.getCompanyName())) {
            throw new RuntimeException("Company already exists");
        }

        return companyRepository.save(company);
    }

    @Transactional
    public void deleteCompany(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new RuntimeException("Company not found with id: " + id);
        }

        companyRepository.deleteById(id);
    }
}