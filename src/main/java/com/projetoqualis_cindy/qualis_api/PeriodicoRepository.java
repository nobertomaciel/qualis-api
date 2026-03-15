package com.projetoqualis_cindy.qualis_api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PeriodicoRepository extends JpaRepository<Periodico, Long> {

    @Query("SELECT DISTINCT p.areaAvaliacao FROM Periodico p")
    List<String> findDistinctAreas();
    List<Periodico> findByAreaAvaliacao(String area);
    List<Periodico> findByAreaAvaliacaoAndEstrato(String area, String estrato);
}