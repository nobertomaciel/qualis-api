package com.projetoqualis_cindy.qualis_api;

import com.projetoqualis_cindy.qualis_api.exception.AreaNotFoundException;
import com.projetoqualis_cindy.qualis_api.exception.PeriodicoNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class PeriodicoService {
    private final PeriodicoRepository repository;
    public PeriodicoService(PeriodicoRepository repository) {
        this.repository = repository;
    }
    public Periodico buscarPorIssn(String issn) {

        return repository.findByIssn(issn)
                .orElseThrow(()-> new PeriodicoNotFoundException("ISSN não encontrado"));
    }
    public List<Periodico> buscarPorTitulo(String titulo) {
        List<Periodico> resultado = repository.findByTituloContainingIgnoreCase(titulo);
        if (resultado.isEmpty()) {
            throw new PeriodicoNotFoundException(
                    "Nenhum periódico encontrado com o título contendo '" + titulo + "'");
        }
        return resultado;
    }

    public List<Periodico> buscarPorArea(String area) {
        List<Periodico> resultado = repository.findByAreaAvaliacao(area);
        if (resultado.isEmpty()) {
            throw new AreaNotFoundException(
                    "Área de avaliação '" + area + "não encontrada"
            );
        }
        return resultado;
    }
    public List<Periodico> buscarPorEstrato(String estrato) {
        List<Periodico> resultado = repository.findByEstrato(estrato);
        if (resultado.isEmpty()) {
            throw new PeriodicoNotFoundException(
                    "Nenhum periódico encontrado com estrato '"+ estrato + "'"
            );
        }
        return resultado;
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
    public List<String> listarAreas() {
        return repository.findDistinctAreas();
    }

}
