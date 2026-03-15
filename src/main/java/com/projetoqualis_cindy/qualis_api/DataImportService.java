package com.projetoqualis_cindy.qualis_api;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.commons.io.input.BOMInputStream;
import java.nio.charset.StandardCharsets;
import java.io.InputStreamReader;
import java.io.Reader;

import java.io.InputStream;
import java.util.List;

@Service
public class DataImportService {

    @Autowired
    private PeriodicoRepository repository;

    @PostConstruct
    public void importData() {
        try {
            InputStream is = getClass().getClassLoader().getResourceAsStream("qualis.csv");
            BOMInputStream bomInputStream = new BOMInputStream(is);
            Reader reader = new InputStreamReader(bomInputStream, StandardCharsets.UTF_8);

            CsvMapper mapper = new CsvMapper();
            CsvSchema schema = CsvSchema.emptySchema()
                    .withHeader()
                    .withColumnSeparator(';');

            MappingIterator<Periodico> it = mapper.readerFor(Periodico.class)
                    .with(schema)
                    .readValues(reader);
            List<Periodico> todos = it.readAll();

            repository.saveAll(todos);

            System.out.println(">>> SUCESSO: " + repository.count() + " registros carregados!");

        } catch (Exception e) {
            System.err.println("Erro ao importar dados: " + e.getMessage());
        }
    }
}