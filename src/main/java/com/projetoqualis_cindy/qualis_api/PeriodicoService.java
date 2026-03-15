package com.projetoqualis_cindy.qualis_api;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PeriodicoService {
    private final PeriodicoRepository repository;
    public PeriodicoService(PeriodicoRepository repository) {
        this.repository = repository;
    }
    public Periodico buscarPorIssn(String issn) {
        return repository.findByIssn(issn).orElse(null);
    }
    public List<Periodico> buscarPorTitulo(String titulo) {
        return repository.findByTituloContainingIgnoreCase(titulo);
    }
    public List<Periodico> buscarPorArea(String area) {
        return repository.findByAreaAvaliacao(area);
    }
    public List<Periodico> buscarPorEstrato(String estrato) {
        return repository.findByEstrato(estrato);
    }
    public List<Periodico> buscarPorAreaEstrato(String area, String estrato) {
        return repository.findByAreaAvaliacaoAndEstrato(area, estrato);
    }
    public List<EstatisticaEstrato> distribuicaoPorEstrato(String area){

        List<Object[]> dados = repository.contarPorEstratoDaArea(area);

        List<EstatisticaEstrato> resultado = new ArrayList<>();

        for(Object[] linha : dados){

            String estrato = (String) linha[0];
            Number quantidade = (Number) linha[1];

            resultado.add(
                    new EstatisticaEstrato(
                            estrato,
                            quantidade.longValue()
                    )
            );
        }

        return resultado;
    }

}
