package com.projetoqualis_cindy.qualis_api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PeriodicoRepository extends JpaRepository<Periodico, Long> {

    List<Periodico> findByIssn(String issn);

    List<Periodico> findByTituloContainingIgnoreCase(String titulo);

    List<Periodico> findByAreaAvaliacao(String area);

    List<Periodico> findByEstrato(String estrato);

    List<Periodico> findByAreaAvaliacaoAndEstrato(String area, String estrato);

    @Query("SELECT p.estrato, COUNT(p) FROM Periodico p WHERE p.areaAvaliacao = :area GROUP BY p.estrato")
    List<Object[]> contarPorEstratoDaArea(@Param("area") String area);

    @Query("SELECT DISTINCT p.areaAvaliacao FROM Periodico p ORDER BY p.areaAvaliacao")
    List<String> findDistinctAreas();
}