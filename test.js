// Cargo.toml
[dependencies]
wasm-bindgen = "0.2"
js-sys = "0.3"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

[dev-dependencies]
wasm-bindgen-test = "0.3"

[lib]
crate-type = ["cdylib", "rlib"]

[profile.release]
opt-level = "s"
// Don't use LTO to ensure debug info is generated for benchmarking
lto = false

// src/lib.rs
use wasm_bindgen::prelude::*;
use wasm_bindgen_test::*;

wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn criar_enquete_test() {
    let titulo = "Enquete 1";
    let candidatos = JsValue::from_serde(&vec!["Candidato A", "Candidato B"]).unwrap();
    let result = criar_enquete(titulo, &candidatos);
    assert!(result.is_ok());
    let response_value: serde_json::Value = result.unwrap();
    assert!(response_value["url"].is_string());
}

#[wasm_bindgen_test]
fn registrar_enquete_test() {
    let titulo = "Enquete 1";
    let link = "http://example.com/enquete1";
    let candidatos = vec!["Candidato A", "Candidato B"];
    let result = registrar_enquete(titulo, link, &candidatos);
    assert!(result.is_ok());
}

#[wasm_bindgen_test]
fn obter_dados_enquete_test() {
    let titulo = "Enquete 1";
    let result = obter_dados_enquete(titulo);
    assert!(result.is_ok());
    let response_data: serde_json::Value = result.unwrap();
    assert_eq!(response_data["link"], "http://example.com/enquete1");
    assert!(response_data["candidatos"].is_array());
}

#[wasm_bindgen_test]
fn obter_votos_test() {
    let poll_id = "somePollId";
    let result = obter_votos(poll_id);
    assert!(result.is_ok());
    let response_data: serde_json::Value = result.unwrap();
    assert!(response_data.is_array());
    assert!(response_data[0].is_string());
}

#[wasm_bindgen_test]
fn apuracao_stv_test() {
    let votos = vec![
        vec!["Candidato A", "Candidato B", "Candidato C"],
        vec!["Candidato B", "Candidato A", "Candidato C"],
        vec!["Candidato C", "Candidato B", "Candidato A"],
        vec!["Candidato A", "Candidato C", "Candidato B"],
        vec!["Candidato B", "Candidato C", "Candidato A"],
    ];
    let num_vencedores = 2;
    let result = apuracao_stv(votos, num_vencedores);
    assert!(result.is_ok());
    let vencedores: Vec<String> = result.unwrap();
    assert_eq!(vencedores.len(), 2);
}

#[wasm_bindgen_test]
fn calcular_totais_test() {
    let votos = vec![
        vec!["Candidato A", "Candidato B", "Candidato C"],
        vec!["Candidato B", "Candidato A", "Candidato C"],
        vec!["Candidato C", "Candidato B", "Candidato A"],
        vec!["Candidato A", "Candidato C", "Candidato B"],
        vec!["Candidato B", "Candidato C", "Candidato A"],
    ];
    let result = calcular_totais(votos);
    assert!(result.is_ok());
    let totais: Vec<serde_json::Value> = result.unwrap();
    assert_eq!(totais.len(), 3);
}

#[wasm_bindgen_test]
fn redistribuir_votos_test() {
    let votos = vec![
        vec!["Candidato A", "Candidato B", "Candidato C"],
        vec!["Candidato B", "Candidato A", "Candidato C"],
        vec!["Candidato C", "Candidato B", "Candidato A"],
        vec!["Candidato A", "Candidato C", "Candidato B"],
        vec!["Candidato B", "Candidato C", "Candidato A"],
    ];
    let eliminado = "Candidato C";
    let result = redistribuir_votos(votos, eliminado);
    assert!(result.is_ok());
    let new_votos: Vec<Vec<String>> = result.unwrap();
    for voto in new_votos {
        assert!(!voto.contains(&"Candidato C".to_string()));
    }
}