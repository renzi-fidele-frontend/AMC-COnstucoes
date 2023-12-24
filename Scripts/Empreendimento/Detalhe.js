var enderecoDestino;

// inicializando endereco
function initMapLocalizacaoImovel() {
  ClasseGoogleMaps.InicializarMapa('map');
  ClasseGoogleMaps.SetarZoom(15);
  ClasseGoogleMaps.SetarEndereco($("#endereco-completo").text());
  ClasseGoogleMaps.ObterCoordenadasPorEndereco($("#endereco-completo").text(), function (latitude, longitude) {
    // Setando coordenadas na classe para utiliza-las posteriormente
    ClasseGoogleMaps._Latitude = latitude;
    ClasseGoogleMaps._Longitude = longitude;
    var htmlJanelaInformacao = "<div style='color:#676767;font-size:15px;font-weight:bold;'>" + $("#nome-empreendimento").text() + "</div><div style='color:black'><strong>Endereço: </strong>" + $("#endereco-completo").text() + "</div>";
    ClasseGoogleMaps.SetarMarcador(latitude, longitude, $("#nome-empreendimento").text(), false, htmlJanelaInformacao, "click");
  });


  ClasseGoogleMaps.HabilitarInputAutocomplete('endereco-origem', function (endereco, latitude, longitude) {
    enderecoDestino = endereco.formatted_address;
  });
}

// Evento botao 'traca rota'
$("#btn-tracar-rota").on('click', function () {
  ClasseGoogleMaps.CalcularRotaPorNomeEndereco($("#endereco-completo").text(), enderecoDestino);
});  