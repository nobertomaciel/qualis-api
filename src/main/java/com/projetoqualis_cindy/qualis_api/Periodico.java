package com.projetoqualis_cindy.qualis_api;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@JsonPropertyOrder({"ISSN", "Título", "Área de Avaliação", "Estrato"})

public class Periodico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Define que o banco gera o 1, 2, 3... automaticamente

    private Long id;

    @JsonProperty("ISSN")
    private String issn;
    @JsonProperty("Título")
    private String titulo;
    @JsonProperty("Área de Avaliação")
    private String areaAvaliacao;
    @JsonProperty("Estrato")
    private String estrato;
}
