package com.projetoqualis_cindy.qualis_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QualisController {

    @Autowired
    private PeriodicoRepository repository;

    @GetMapping("/areas")
    public List<String> listarAreas() {
        return repository.findDistinctAreas();
    }

    @GetMapping("/periodicos")
    public List<Periodico> listarPorAreas(@RequestParam String area) {
        return repository.findByAreaAvaliacao(area);
    }
}
