package com.projetoqualis_cindy.qualis_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QualisController {
    private final PeriodicoService service;

    public QualisController(PeriodicoService service) {
        this.service = service;
    }

    @GetMapping("/issn/{issn}")
    public Periodico buscarIssn(@PathVariable String issn) {
        return service.buscarPorIssn(issn);
    }

    @GetMapping("/titulo")
    public List<Periodico> buscarTitulo(@RequestParam String titulo) {
        return service.buscarPorTitulo(titulo);
    }
    
}
