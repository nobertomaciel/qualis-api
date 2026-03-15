package com.projetoqualis_cindy.qualis_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QualisController {

    private final PeriodicoService service;

    @Autowired
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

    @GetMapping("/area")
    public List<Periodico> buscarArea(@RequestParam String area) {
        return service.buscarPorArea(area);
    }

    @GetMapping("/estrato")
    public List<Periodico> buscarEstrato(@RequestParam String estrato) {
        return service.buscarPorEstrato(estrato);
    }

    @GetMapping("/filtro")
    public List<Periodico> buscarAreaEstrato(
            @RequestParam String area,
            @RequestParam String estrato) {
        return service.buscarPorAreaEstrato(area, estrato);
    }

    @GetMapping("/distribuicao")
    public List<EstatisticaEstrato> distribuicao(@RequestParam String area) {
        return service.distribuicaoPorEstrato(area);
    }
}

